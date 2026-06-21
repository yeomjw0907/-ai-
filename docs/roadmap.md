# 구현 로드맵 — 대진대학교 AI캠퍼스

> ① 추가로 만들 문서 ② Phase별 구현 계획. 진행하면서 이 문서를 기준으로 체크한다.
> 원칙: **"STEP 0 = 배포부터"**, 그리고 **한 Phase가 끝날 때마다 배포 가능한 상태** 유지. (강의 흐름과 동일)

---

## 1. 문서 현황 & 추가 예정

### ✅ 작성 완료 (`docs/`, 루트)


| 문서                           | 내용                                          |
| ---------------------------- | ------------------------------------------- |
| `project-brief.md`           | 왜 만들었나 (배경·의도)                              |
| `PRD.md`                     | 제품 요구사항                                     |
| `user-flow.md`               | 화면·플로우·IA                                   |
| `database-schema.md`         | 테이블·RLS·Storage (DDL)                       |
| `architecture.md`            | 기술 구조·인증 흐름                                 |
| `design-system.md`           | 색·폰트·컴포넌트·로고                                |
| `deployment-checklist.md`    | 배포 절차                                       |
| `env.md` / `../.env.example` | 환경변수                                        |
| `../CLAUDE.md`               | AI 작업 규칙                                    |
| `roadmap.md`                 | (이 문서)                                      |
| `content.md`                 | **강의 자료 실제 콘텐츠** — 디자인 레퍼런스·기본 폴더 프리셋·개발 용어 |


### 🔜 추가로 만들 문서


| 문서                       | 내용                                                         | 필요 시점   |
| ------------------------ | ---------------------------------------------------------- | ------- |
| `seed-data.md`           | 데모/스크린샷용 **시드 게시글** 예시(제목·URL·설명·이미지)                      | Phase 5 |
| `test-plan.md`           | **QA 시나리오** — 기능별 점검 체크리스트(로그인·글쓰기·권한·좋아요)                 | Phase 5 |
| `lecture-deck-prompt.md` | ✅ **강의안(HTML) 재생성 프롬프트** — 다른 세션에 붙여넣어 덱 생성 (9단 구성 전체 포함)  | 작성 완료   |
| `lecture-mapping.md`     | (선택) 기존 35슬라이드 → 신규 구조 상세 매핑표. *프롬프트로 새로 만들면 불필요할 수 있음*    | Phase 6 |
| (없음)                     | 로그인이 학번+비밀번호(Supabase Email Auth)로 단순해져 별도 OAuth 셋업 문서 불필요 | —       |


> 컴포넌트 단위 UI 스펙은 별도 문서 없이 `design-system.md` + `CLAUDE.md`로 커버한다.

---

## 2. Phase별 구현 계획

### Phase 0 — 셋업 & 선배포 (STEP 0)

- 루트에 **Next.js(App Router·TS) + Tailwind** scaffold
- 기본 레이아웃 + 라우트 뼈대(S1~S6 빈 페이지) + 하단 탭
- PWA 기본: `manifest.json` + 로고 기반 아이콘
- **Vercel 연결 → 빈 앱이라도 먼저 배포 성공**
- 산출물: 배포된 URL(빈 껍데기) · 필요문서: 없음(기존으로 충분)

### Phase 1 — 강의 자료 (F1, 비로그인)

- 홈/자료 화면 구현: 오늘의 흐름·타임테이블 / 치트시트 / 도구 링크
- 인증·DB 없이 **정적으로 먼저 완성** → 배포
- 필요문서: `**content.md`** (콘텐츠 원문)
- 산출물: QR로 들어가면 자료가 보이는 상태 (강의 5번에서 바로 시연 가능)

### Phase 2 — Supabase 연동 & 인증 (F2)

- Supabase 프로젝트 생성 → `database-schema.md` DDL·RLS 적용, `post-images` 버킷, **Confirm email OFF**
- `lib/supabase.ts` 클라이언트
- **회원가입(S6)**: 학번·이름·과·비번 → 학번을 내부 이메일로 변환해 가입 + `profiles` insert
- **로그인(S5)**: 학번+비번 / 로그아웃
- 산출물: 학번으로 가입·로그인되고 이름·과가 잡히는 상태

### Phase 3 — 게시판 읽기 (F3-읽기)

- 목록(S2): 카드 갤러리 + **최신순/인기순 토글**(`posts_with_likes` 뷰)
- 상세(S3): 스샷·URL·한줄·작성자·좋아요수
- 비로그인 열람 허용
- 산출물: (시드 글로) 게시판이 보이는 상태

### Phase 4 — 게시판 쓰기·이미지·좋아요 (F3-쓰기)

- 글쓰기/수정(S4): URL + **이미지 Storage 업로드** + 제목 + 한줄
- **좋아요(♡)** 토글 (사용자당 1회)
- 권한: 본인 수정·삭제 / 강사(admin) 삭제
- 산출물: 핵심 플로우(로그인→글쓰기→게시→좋아요) 완성

### Phase 5 — 마감·QA·도메인·PWA

- 빈상태/에러처리, `test-plan.md`로 전 기능 점검
- `seed-data.md`로 데모 게시글 채우기
- 도메인 연결(시연+가이드), PWA "홈 화면 추가" 확인
- **강의용 스크린샷 캡처** (= 6번 도그푸딩 재료)
- 산출물: 실서비스 수준 데모 + 강의 스샷 세트

### Phase 6 — 강의안 9단 개편 (앱 밖, 연계)

- `lecture-mapping.md` 확정 → `docs/바이브코딩강의안.html` 재배치
- Phase 5 스샷을 6·7·9번에 삽입, 8번(마무리) 실습 뒤로
- 도구명 Google → Cursor·Vercel·Supabase 갱신, Stitch 슬라이드 정리

---

## 3. 의존 관계 (한눈에)

```
Phase0(배포 뼈대) → Phase1(자료) → Phase2(인증) → Phase3(읽기) → Phase4(쓰기) → Phase5(마감·스샷) → Phase6(강의안)
                                   └ database-schema 적용이 Phase3·4의 전제
content.md ─┘(P1)      seed/test ─┘(P5)      lecture-mapping ─┘(P6)
```

