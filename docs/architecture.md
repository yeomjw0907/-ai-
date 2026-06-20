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
│  · Auth (Kakao OAuth)                          │
│  · Storage (post-images)                       │
└───────────────┬─────────────────────────────┘
                │  OAuth
┌───────────────┴─────────────────────────────┐
│  카카오 로그인 (OAuth Provider)                │
└─────────────────────────────────────────────┘
```

## 2. 기술 선택
| 층 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | **Next.js (App Router, TypeScript)** | Vercel 1급 지원, PWA·라우팅 표준 |
| 스타일 | **Tailwind CSS** | 빠른 모바일 우선 UI, Cursor 친화 |
| 배포 | **Vercel** | Git 연결 → 자동 배포, 도메인·환경변수 GUI |
| DB·인증·파일 | **Supabase** | Postgres + Auth + Storage를 한 곳에서, RLS로 보안 |
| 로그인 | **카카오 OAuth** | 국내 대학생 친화, Supabase에 provider 내장 |
| 앱 형태 | **PWA** | 스토어 없이 홈 화면 설치 |

## 3. 인증 흐름
1. `로그인(S5)` → `supabase.auth.signInWithOAuth({ provider: 'kakao' })`
2. 카카오 동의 → Supabase 콜백(`/auth/v1/callback`) → 세션 발급
3. 앱이 `profiles`에서 내 행 확인 → 없거나 `display_name` 비면 **온보딩(S6)**
4. 표시이름 저장 후 정상 이용

## 4. 데이터 접근 패턴
- 대부분 **클라이언트에서 supabase-js 직접 호출** + **RLS로 권한 보장** (별도 백엔드 서버 없음).
- 인기순 정렬은 `posts_with_likes` 뷰 사용.
- 이미지 업로드: Storage `post-images/{uid}/...` 업로드 → public URL을 `posts.image_url`에 저장.

## 5. 폴더 구조(예정)
```
ai-campus/
├─ app/
│  ├─ page.tsx              # S1 홈/자료
│  ├─ board/                # S2 목록, S3 상세, S4 글쓰기
│  ├─ login/                # S5
│  └─ onboarding/           # S6
├─ components/
├─ lib/supabase.ts          # 클라이언트
├─ public/                  # manifest, 아이콘
├─ docs/                    # 기획·설계 문서
├─ CLAUDE.md                # AI 작업 규칙
└─ .env.local              # 환경변수 (git 제외)
```

## 6. 외부 의존 / 경계
- **Vercel**: 호스팅·도메인·환경변수
- **Supabase**: 데이터·세션·파일 (프로젝트 키 필요)
- **카카오 개발자**: OAuth 앱 (REST 키 + Redirect URI 등록)
