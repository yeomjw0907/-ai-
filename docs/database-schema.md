# DB 스키마 — 대진대학교 AI캠퍼스 (Supabase / PostgreSQL)

## 1. 테이블 개요


| 테이블                   | 역할                                       |
| --------------------- | ---------------------------------------- |
| `profiles`            | 사용자 정보(학번·이름·과·admin). `auth.users`와 1:1 |
| `public_profiles`     | 공개 작성자 표시용 뷰. `id·name·department`만 노출   |
| `posts`               | 결과물 게시글(URL·이미지·제목·한줄설명)                 |
| `likes`               | 좋아요 (사용자 × 글, 1회)                        |
| Storage `post-images` | 스크린샷 이미지 파일                              |


## 2. 관계

```
auth.users ──1:1── profiles ──1:N── posts ──1:N── likes ──N:1── profiles
```

> **로그인 방식:** Supabase Auth는 이메일 기반이라, **학번을 내부 이메일로 변환**해서 쓴다.
> `학번 20231234 → auth.users.email = 20231234@ai-campus.local` (사용자에겐 노출 안 함).
> 학번 원본·이름·과는 아래 `profiles`에 저장한다.

## 3. DDL

```sql
-- 확장
create extension if not exists "pgcrypto";

-- profiles : auth.users 와 1:1
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  student_no  text not null unique,   -- 학번
  name        text not null,          -- 이름 (게시판 표시명)
  department  text not null,          -- 과
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- 공개 작성자 표시용 뷰 : 학번과 admin 여부는 노출하지 않는다.
create view public.public_profiles as
select id, name, department
from public.profiles;

-- posts : 결과물 게시글
create table public.posts (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  description text not null,          -- 한줄설명
  app_url     text not null,          -- 배포된 앱 URL
  image_url   text,                   -- 스크린샷 (Storage public URL)
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index posts_created_at_idx on public.posts (created_at desc);

-- likes : 좋아요 (복합 PK 로 중복 방지)
create table public.likes (
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- 인기순 정렬용 뷰 (좋아요 수 포함)
create view public.posts_with_likes as
select p.*, coalesce(count(l.user_id), 0) as like_count
from public.posts p
left join public.likes l on l.post_id = p.id
group by p.id;
```

## 4. RLS (Row Level Security) 정책

> 공개 콘텐츠는 누구나 읽고, `profiles` 원본은 본인 또는 admin 만 읽는다.
> 공개 화면의 작성자 표시는 `public_profiles` 뷰(`id·name·department`)만 사용해 학번 노출을 막는다.

```sql
alter table public.profiles enable row level security;
alter table public.posts    enable row level security;
alter table public.likes    enable row level security;

-- admin 판별 헬퍼
create or replace function public.is_admin() returns boolean
language sql security definer stable as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- profiles : 원본 프로필은 본인 또는 admin 만 조회, 본인만 생성/수정
create policy "profiles read own or admin"
on public.profiles for select
using (auth.uid() = id or public.is_admin());

create policy "profiles insert own"
on public.profiles for insert
with check (auth.uid() = id);

create policy "profiles update own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- public_profiles : 공개 작성자 표시용. 앱에서는 게시판/Q&A 작성자 조회에 이 뷰를 사용한다.
-- 노출 컬럼은 id, name, department 뿐이며 student_no, is_admin 은 포함하지 않는다.

-- posts : 누구나 조회 / 로그인 본인만 작성 / 본인·admin 수정·삭제
create policy "posts read"   on public.posts for select using (true);
create policy "posts insert" on public.posts for insert with check (auth.uid() = author_id);
create policy "posts update" on public.posts for update using (auth.uid() = author_id or public.is_admin());
create policy "posts delete" on public.posts for delete using (auth.uid() = author_id or public.is_admin());

-- likes : 누구나 조회(카운트) / 본인만 추가·삭제
create policy "likes read"   on public.likes for select using (true);
create policy "likes insert" on public.likes for insert with check (auth.uid() = user_id);
create policy "likes delete" on public.likes for delete using (auth.uid() = user_id);
```

## 5. Storage

- 버킷: `**post-images**` — public read
- 업로드: 로그인 사용자, 경로 규칙 `post-images/{user_id}/{파일명}`
- 정책: read = public / insert = authenticated (경로 첫 폴더가 본인 uid)

## 6. 가입 처리 (학번 로그인)

1. Supabase 대시보드 → **Authentication → Providers → Email → "Confirm email" OFF** (가짜 이메일이라 필수).
2. 회원가입(S6): 학번·이름·과·비밀번호 입력 →
  ```ts
   const email = `${studentNo}@ai-campus.local`;
   const { data, error } = await supabase.auth.signUp({
     email, password,
     options: { data: { student_no: studentNo, name, department } },
   });
   // 성공 시 (confirm off라 즉시 세션) profiles insert
   await supabase.from("profiles").insert({
     id: data.user.id, student_no: studentNo, name, department,
   });
  ```
3. 로그인(S5): `supabase.auth.signInWithPassword({ email:` ${studentNo}@ai-campus.local`, password })`
4. (선택) `auth.users` insert 트리거로 `raw_user_meta_data`를 읽어 profiles 자동 생성하는 방식도 가능.

## 7. admin 지정

- 강사 계정은 가입 후, 대시보드 SQL로 수동 지정:
  ```sql
  update public.profiles set is_admin = true where student_no = '<강사 학번>';
  ```

