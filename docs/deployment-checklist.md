# 배포 체크리스트 — 대진대학교 AI캠퍼스

> 순서대로 따라가면 빈 앱부터 실제 도메인까지. (강의 9번 실습과 동일 흐름)

## 1. Supabase 세팅
- [ ] Supabase 프로젝트 생성
- [ ] SQL Editor에 `database-schema.md`의 DDL 실행 (테이블·뷰)
- [ ] RLS 정책 실행 (`is_admin()` 포함)
- [ ] Storage 버킷 `post-images` 생성 (public read)
- [ ] Project URL · anon key 확보 → 환경변수에 사용

## 2. 로그인 세팅 (학번 + 비밀번호)
- [ ] Supabase → **Authentication → Providers → Email** 활성화
- [ ] **"Confirm email" OFF** (학번을 가짜 이메일로 쓰므로 필수 — 안 끄면 가입이 막힘)
- [ ] 외부 OAuth(카카오 등) 설정 **불필요** — 학번 로그인으로 자체 완결
- [ ] (가입 흐름) 앱에서 `학번@ai-campus.local`로 signUp → `profiles`에 학번·이름·과 저장

## 3. Vercel 배포
- [ ] GitHub 저장소 연결 → Vercel 프로젝트 import
- [ ] 환경변수 등록 (`env.md` 참고): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`
- [ ] **STEP 0**: 빈 앱이라도 먼저 한 번 배포 성공시키기
- [ ] 완성본 재배포

## 4. PWA
- [ ] `public/manifest.json` (이름·아이콘·테마색)
- [ ] 아이콘 192/512 png
- [ ] 서비스워커 등록 (또는 `next-pwa`)
- [ ] 폰에서 "홈 화면에 추가" 동작 확인

## 5. 도메인 연결 (시연 + 가이드)
- [ ] 도메인 구매(가비아/Cloudflare 등)
- [ ] Vercel 프로젝트 → Domains에 추가 → 안내된 DNS 레코드 등록
- [ ] DNS 전파 대기(수 분~수 시간) 후 https 확인
- [ ] **Supabase Site URL / Redirect URLs**에 새 도메인 반영

## 6. 결제 (오늘은 미구현 · 언급만)
- [ ] 강의에서 "토스페이먼츠/포트원 등으로 이렇게 붙는다"만 설명

## 7. 배포 후 스모크 테스트
- [ ] 비로그인으로 자료·게시판 열람 OK
- [ ] 회원가입(학번·이름·과·비번) → 자동 로그인 OK
- [ ] 로그아웃 후 학번/비번으로 재로그인 OK
- [ ] 같은 학번 재가입 시 "이미 가입된 학번" 처리 OK
- [ ] 글쓰기(URL+스샷+설명) → 게시 OK
- [ ] 좋아요 / 최신순·인기순 토글 OK
- [ ] 본인 글 수정·삭제 OK / 강사 admin 삭제 OK
