# 아키텍처 — 대진대학교 AI캠퍼스

## 1. 3층 구조 한눈에
```
┌─────────────────────────────────────────────┐
│  화면 (Frontend)                              │
│  Next.js (App Router, TS) + Tailwind          │
│  PWA (manifest + service worker)              │
│  → Vercel 에 배포                              │
└───────────────┬─────────────────────────────┘
                │  @supabase/supabase-js
┌───────────────┴─────────────────────────────┐
│  백엔드 / 데이터 (Supabase)                    │
│  · Postgres (posts · profiles · likes)        │
│  · Auth (Email/Password — 학번을 내부 이메일로) │
│  · Storage (post-images)                       │
└─────────────────────────────────────────────┘
```

## 2. 기술 선택
| 층 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | **Next.js (App Router, TypeScript)** | Vercel 1급 지원, PWA·라우팅 표준 |
| 스타일 | **Tailwind CSS** | 빠른 모바일 우선 UI, Cursor 친화 |
| 배포 | **Vercel** | Git 연결 → 자동 배포, 도메인·환경변수 GUI |
| DB·인증·파일 | **Supabase** | Postgres + Auth + Storage를 한 곳에서, RLS로 보안 |
| 로그인 | **학번 + 비밀번호** | 외부 OAuth 없이 Supabase Auth만으로. 캠프 친화·셋업 단순 |
| 앱 형태 | **PWA** | 스토어 없이 홈 화면 설치 |

## 3. 인증 흐름 (학번 로그인)
> Supabase Auth는 이메일 기반 → **학번을 내부 이메일로 변환**해서 사용. 사용자에겐 학번만 보인다.

- **회원가입(S6)**: 학번·이름·과·비밀번호 입력 → `signUp({ email: "학번@ai-campus.local", password, options:{ data:{ student_no, name, department }}})` → 성공 시 `profiles`에 학번·이름·과 insert
- **로그인(S5)**: 학번·비밀번호 → `signInWithPassword({ email: "학번@ai-campus.local", password })`
- 전제: Supabase에서 **Confirm email OFF** (가짜 이메일이라 필수), 학번 중복은 Supabase가 자동 차단
- 세션·`auth.uid()`·RLS는 일반 Supabase Auth와 동일하게 동작

## 4. 데이터 접근 패턴
- 대부분 **클라이언트에서 supabase-js 직접 호출** + **RLS로 권한 보장** (별도 백엔드 서버 없음).
- 인기순 정렬은 `posts_with_likes` 뷰 사용.
- 이미지 업로드: Storage `post-images/{uid}/...` 업로드 → public URL을 `posts.image_url`에 저장.

## 5. 폴더 구조(예정)
```
ai-campus(repo root)/
├─ app/
│  ├─ page.tsx              # S1 홈/자료
│  ├─ board/                # S2 목록, S3 상세, S4 글쓰기
│  ├─ login/                # S5 로그인(학번/비번)
│  └─ signup/               # S6 회원가입(학번·이름·과·비번)
├─ components/
├─ lib/supabase.ts          # 클라이언트
├─ public/                  # manifest, 아이콘
├─ docs/                    # 기획·설계 문서
├─ CLAUDE.md                # AI 작업 규칙
└─ .env.local              # 환경변수 (git 제외)
```

## 6. 외부 의존 / 경계
- **Vercel**: 호스팅·도메인·환경변수
- **Supabase**: 데이터·세션·파일 (프로젝트 URL + anon key 필요)
- *외부 OAuth(카카오 등) 없음 — 학번 로그인으로 자체 완결.*
