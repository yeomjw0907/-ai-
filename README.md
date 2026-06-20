# 대진대학교 AI캠퍼스

바이브코딩 창업캠프 데모 앱 — **강의 자료 + 결과물 게시판** PWA.
이 앱 자체가 강의의 "실제 개발 과정(도그푸딩)" 예시다.

## 스택
Next.js (App Router·TS) · Tailwind CSS · Supabase(DB·Auth·Storage) · Vercel 배포 · PWA
로그인: **학번 + 비밀번호** (외부 OAuth 없음)

## 시작하기
```bash
npm install
cp .env.example .env.local   # 값 채우기 (Phase 2부터 필요)
npm run dev                  # http://localhost:3000
```

## 문서
기획·설계·로드맵은 [`docs/`](docs/README.md) 참고.
- 왜 만들었나: [docs/project-brief.md](docs/project-brief.md)
- 요구사항: [docs/PRD.md](docs/PRD.md)
- 구현 로드맵(Phase): [docs/roadmap.md](docs/roadmap.md)
- AI 작업 규칙: [CLAUDE.md](CLAUDE.md)

## 진행 상황
- **Phase 0 (현재):** Next.js + Tailwind scaffold · 화면 뼈대 · PWA manifest · 선배포
- 이후: 자료(P1) → 인증(P2) → 게시판 읽기(P3) → 쓰기(P4) → 마감·도메인(P5)
