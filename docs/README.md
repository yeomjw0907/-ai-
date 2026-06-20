# 대진대학교 AI캠퍼스 — 문서 인덱스

바이브코딩 창업캠프 데모 앱의 기획·설계 문서 모음.
(강의 6·7번 "실제 개발 과정 / 가이드"의 예시 자료로도 사용)

## 문서
| 문서 | 내용 |
|---|---|
| [project-brief.md](project-brief.md) | **왜 만들었나** — 기획 배경·문제의식·역할 (강의 5·6번 토대) |
| [PRD.md](PRD.md) | 제품 요구사항 — 목적·핵심기능·범위·성공기준 |
| [user-flow.md](user-flow.md) | 화면 목록·플로우·정보구조(IA) |
| [database-schema.md](database-schema.md) | 테이블·관계·RLS·Storage (DDL 포함) |
| [architecture.md](architecture.md) | 기술 구조(3층)·인증 흐름·폴더 구조 |
| [design-system.md](design-system.md) | 색·폰트·컴포넌트 규칙 |
| [content.md](content.md) | **강의 자료 원문** — 디자인 레퍼런스·기본 폴더 프리셋·개발 용어 |
| [deployment-checklist.md](deployment-checklist.md) | Supabase·Vercel·도메인 배포 절차 (학번 로그인) |
| [env.md](env.md) | 환경변수 설명 (샘플: `../.env.example`) |
| [roadmap.md](roadmap.md) | **구현 로드맵** — 추가 예정 문서 + Phase별 계획 |
| [lecture-deck-prompt.md](lecture-deck-prompt.md) | **강의안(HTML) 재생성 프롬프트** — 다른 세션에 붙여넣어 덱 생성 |
| [../CLAUDE.md](../CLAUDE.md) | Cursor/Claude 작업 규칙 |

> 추가 예정 문서(`seed-data.md`·`test-plan.md`·`lecture-mapping.md`)는 [roadmap.md](roadmap.md)에서 시점과 함께 관리.

## 제품 요약
- **이름:** 대진대학교 AI캠퍼스
- **형태:** PWA (모바일 우선)
- **스택:** Next.js + Vercel + Supabase (로그인: 학번+비밀번호, 외부 OAuth 없음)
- **핵심:** ① 강의 자료(비로그인 열람) ② 결과물 게시판(학번 로그인 후 업로드·좋아요)
