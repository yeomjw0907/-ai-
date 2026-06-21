# 환경변수 — 대진대학교 AI캠퍼스

> 실제 값은 `.env.local`(git 제외)에. 샘플은 `../.env.example` 참고.

## 앱에서 쓰는 변수
| 변수 | 설명 | 발급처 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 공개(anon) 키 — 클라이언트용 | Supabase → API |
| `NEXT_PUBLIC_SITE_URL` | 배포 사이트 URL | 배포 후 Vercel 도메인/커스텀 도메인 |

> `NEXT_PUBLIC_` 접두사는 **브라우저에 노출**된다. anon 키는 공개돼도 RLS가 데이터를 보호하므로 OK.
> service_role 키 등 비밀 키는 클라이언트에 절대 넣지 않는다. (이 앱은 클라이언트+RLS만으로 동작하므로 불필요)
> Vercel에 값을 추가하거나 바꾼 뒤에는 반드시 Redeploy 해야 배포본에 반영된다.

## 로그인은 키가 필요 없다
- 로그인은 **학번 + 비밀번호**(Supabase Email Auth)라 외부 OAuth 키가 없다.
- 학번→내부 이메일 변환에 쓰는 도메인(`ai-campus.local`)은 코드 상수로 관리(환경변수 아님).
- Supabase 대시보드에서 **Confirm email OFF**만 해두면 됨.
- Supabase Auth의 비밀번호 최소 길이는 앱 기준과 맞춰 **8자 이상**으로 설정한다.

## 로컬 실행
1. `.env.example` → `.env.local` 복사
2. 위 3개 값 채우기
3. `npm run dev`
