# 환경변수 — 대진대학교 AI캠퍼스

> 실제 값은 `.env.local`(git 제외)에. 샘플은 `../.env.example` 참고.

## 앱에서 쓰는 변수
| 변수 | 설명 | 발급처 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 공개(anon) 키 — 클라이언트용 | Supabase → API |
| `NEXT_PUBLIC_SITE_URL` | 배포 사이트 URL (OAuth redirect 기준) | 배포 후 Vercel 도메인/커스텀 도메인 |

> `NEXT_PUBLIC_` 접두사는 **브라우저에 노출**된다. anon 키는 공개돼도 RLS가 데이터를 보호하므로 OK.
> service_role 키 등 비밀 키는 클라이언트에 절대 넣지 않는다. (이 앱은 클라이언트+RLS만으로 동작하므로 불필요)

## 카카오 키는 어디에?
- 카카오 REST API 키 / Client Secret 은 **앱 `.env`가 아니라 Supabase 대시보드(Auth → Providers → Kakao)** 에 등록한다.
- 앱은 Supabase를 통해서만 카카오와 통신하므로 카카오 키를 직접 다루지 않는다.

## 로컬 실행
1. `.env.example` → `.env.local` 복사
2. 위 3개 값 채우기
3. `npm run dev`
