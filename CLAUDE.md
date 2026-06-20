# CLAUDE.md — 대진대학교 AI캠퍼스 (AI 작업 규칙)

> Cursor/Claude가 이 프로젝트에서 항상 지킬 규칙. 코드를 만들기 전에 이 문서를 기준으로 삼는다.
> (바이브코딩의 핵심 = AI에게 줄 컨텍스트를 또렷하게 정리해두는 것)

## 1. 이 앱이 뭐냐
바이브코딩 창업캠프 데모 PWA. 두 가지를 한다:
1. **강의 자료**(흐름·치트시트·도구링크) — 로그인 없이 열람
2. **결과물 게시판** — 학번 로그인 후 본인 앱(URL+스샷+한줄설명) 업로드, 좋아요, 최신순/인기순

왜 만들었는지(배경·의도)는 `docs/project-brief.md`, 요구사항은 `docs/PRD.md`, 화면은 `docs/user-flow.md`, 데이터는 `docs/database-schema.md`.

브랜드 로고: `logo_color.png` (대진대 공식 엠블럼) — 헤더·PWA 아이콘에 사용.

## 2. 기술 스택 (고정)
- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** (모바일 우선, 컨테이너 최대폭 480px)
- **Supabase** — `@supabase/supabase-js` (DB·Auth·Storage)
- **로그인: 학번 + 비밀번호** (외부 OAuth 없음)
- **PWA** (manifest + service worker)
- 배포: **Vercel**
> 다른 프레임워크/UI 라이브러리/상태관리 도구를 임의로 추가하지 말 것. 추가가 필요하면 먼저 물어볼 것.

### 로그인 구현 규칙 (중요)
- Supabase Auth는 이메일 기반 → **학번을 내부 이메일로 변환**해서 쓴다: `이메일 = `${학번}@ai-campus.local``. 도메인 상수는 한 곳에서 관리.
- 회원가입 입력: **학번 · 이름 · 과 · 비밀번호 · 비밀번호 확인**. 비번 일치 검사는 클라이언트에서.
- 로그인 입력: **학번 · 비밀번호**.
- 가입 성공 후 `profiles`(student_no·name·department) insert. 사용자에게 이메일·OAuth를 절대 노출하지 말 것.
- Supabase는 **Confirm email OFF** 전제(가짜 이메일). 카카오/구글 등 OAuth 붙이지 말 것.

## 3. 디자인
`docs/design-system.md`를 따른다. 색·폰트·컴포넌트 규칙 임의 변경 금지.
- Primary `#0B4DA2`, Accent(♡) `#FF4D6D`, 폰트 Pretendard
- 카드 중심, radius 12~16, 터치 영역 48px, 또렷한 정보 위계

## 4. 데이터 / 보안 규칙
- DB 접근은 **클라이언트 supabase-js + RLS**로 한다. 별도 백엔드 서버를 만들지 않는다.
- 스키마/정책은 `docs/database-schema.md`와 **일치**시킨다. 테이블·컬럼명을 바꾸지 말 것. (`profiles`: student_no·name·department·is_admin)
- **service_role 키를 클라이언트에 절대 넣지 않는다.** 공개 가능한 건 anon 키뿐.
- 권한: 글 작성=본인, 수정·삭제=본인 또는 admin. 좋아요=본인 1회.
- 이미지 업로드 경로: `post-images/{user_id}/{파일명}`.

## 5. 코드 컨벤션
- TypeScript strict. 의미 있는 타입, `any` 지양.
- 컴포넌트는 작게, 화면 단위는 `app/`의 라우트로.
- Supabase 클라이언트는 `lib/supabase.ts` 한 곳에서 생성해 재사용.
- 사용자에게 보이는 문구는 **한국어**.
- 비밀값은 `.env.local`. 코드/깃에 하드코딩 금지.

## 6. 작업 방식
- 한 번에 **하나씩** 구현하고 확인(QA)한 뒤 다음으로. (강의 흐름과 동일)
- 막연한 요청 대신, PRD의 기능 단위(F1~F3)로 쪼개 진행.
- 불확실하면 추측해서 큰 구조를 바꾸지 말고 **먼저 질문**한다.

## 7. 하지 말 것
- 범위(Scope) 밖 기능(결제·댓글·알림·검색·다국어) 임의 구현 금지 — `docs/PRD.md` 5장 참고.
- 스키마·디자인 토큰·스택 임의 변경 금지.
