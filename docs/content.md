# 강의 자료 콘텐츠

> 홈/자료 화면에 노출할 원문. 참가자가 QR로 들어왔을 때 바로 볼 수 있는 내용을 기준으로 작성한다.

## 1. 디자인 레퍼런스 바로가기


| 이름        | URL                                                    | 용도                |
| --------- | ------------------------------------------------------ | ----------------- |
| Mobbin    | [https://mobbin.com/](https://mobbin.com/)             | 실제 앱 화면 레퍼런스      |
| Awwwards  | [https://www.awwwards.com/](https://www.awwwards.com/) | 완성도 높은 웹사이트 톤앤무드  |
| Land-book | [https://land-book.com/](https://land-book.com/)       | 랜딩페이지 구조와 섹션 구성   |
| Dribbble  | [https://dribbble.com/](https://dribbble.com/)         | 카드, 버튼, 앱 화면 아이디어 |
| 21st.dev  | [https://21st.dev/](https://21st.dev/)                 | 웹 UI 컴포넌트와 인터랙션 참고 |


## 2. 발표자료 바로가기

| 이름 | URL | 용도 |
|---|---|---|
| 강의자료 | [/lecture-deck.html](/lecture-deck.html) | 오늘 발표에서 사용한 메인 강의자료 |


## 3. 사전 회원가입

Cursor를 설치하고 GitHub 계정을 먼저 만든다. 그다음 Vercel과 Supabase는 **GitHub 계정으로 계속하기**를 선택하면 쉽게 가입할 수 있다.


| 서비스      | URL                                                                              | 왜 필요한가                     |
| -------- | -------------------------------------------------------------------------------- | -------------------------- |
| Cursor   | [https://cursor.com/](https://cursor.com/)                                       | AI와 함께 코드를 만들고 수정하기 위해 필요   |
| GitHub   | [https://github.com/signup](https://github.com/signup)                           | 코드를 저장하고 공유하기 위해 필요        |
| Vercel   | [https://vercel.com/signup](https://vercel.com/signup)                           | GitHub 계정으로 가입하면 배포 연결이 쉬움 |
| Supabase | [https://supabase.com/dashboard/sign-up](https://supabase.com/dashboard/sign-up) | GitHub 계정으로 가입하면 시작이 쉬움    |


## 4. 기본 폴더 프리셋

강사가 제공하는 starter 폴더는 완성 앱이 아니라, 내 앱을 만들기 위한 기본 작업 폴더다. Cursor에서 열면 아래 자료를 기준으로 기획부터 구현까지 이어갈 수 있다.

- 기획 문서 템플릿이 담긴 `docs/` 폴더
- 강사가 작성한 예시 문서
- 단계별로 복사해 쓸 수 있는 `프롬프트-치트시트.md`
- Cursor AI에게 줄 작업 규칙 `.cursorrules`
- Supabase 값 등을 적기 위한 `.env.example`

### 사용법

#### FM으로 하기

1. starter 폴더를 복사해 내 프로젝트 이름으로 바꾼다.
2. Cursor에서 폴더를 열고 `README.md`와 `docs/` 문서를 먼저 읽는다.
3. `docs/1-PRD-템플릿.md`를 내 아이디어로 채운다.
4. `docs/2-화면흐름-템플릿.md`에 필요한 화면과 이동 순서를 적는다.
5. `프롬프트-치트시트.md`의 프롬프트를 Cursor 채팅에 붙여넣어 화면과 기능을 하나씩 만든다.

#### VIBE로 하기

스타터킷을 Cursor로 연 뒤 아래 프롬프트를 채팅창에 붙여넣는다.

```text
이 폴더는 바이브코딩 스타터킷입니다.

먼저 README.md, .cursorrules, docs 폴더 안의 템플릿과 예시 문서를 읽고 구조를 파악해줘.

그다음 내가 만들 앱을 정할 수 있도록 꼭 필요한 질문 5개만 해줘.
내가 답하면 그 내용을 바탕으로 docs/1-PRD-템플릿.md와 docs/2-화면흐름-템플릿.md를 초안으로 채워줘.

아직 코드는 만들지 말고, 문서 초안과 다음에 구현할 1순위 화면만 제안해줘.
```

## 5. Cursor에서 화면 확인하는 방법

`npm run dev`는 내 컴퓨터에서 임시 개발 서버를 켜는 명령어다. 주소는 보통 `http://localhost:3000`으로 열린다.

### FM으로 하기

1. Cursor에서 프로젝트 폴더를 연다.
2. 상단 메뉴에서 Terminal을 열거나 `Ctrl + ` 단축키로 터미널을 연다.
3. 처음 한 번은 `npm install`을 입력해 필요한 패키지를 설치한다.
4. `npm run dev`를 입력해 개발 서버를 실행한다.
5. 브라우저에서 `http://localhost:3000`을 열어 화면을 확인한다.

### VIBE로 하기

```text
이 프로젝트를 내 컴퓨터에서 실행해서 화면을 확인하고 싶어.

먼저 package.json을 읽고 어떤 명령어를 써야 하는지 확인해줘.
필요하면 의존성 설치부터 개발 서버 실행까지 순서대로 도와줘.

에러가 나면 에러 메시지를 바탕으로 원인을 설명하고, 내가 바로 따라 할 수 있는 다음 행동을 알려줘.
```

## 6. GitHub에 코드 올리는 방법

### FM으로 하기

1. GitHub에서 새 Repository를 만든다.
2. Repository 화면에서 HTTPS 주소를 복사한다. 예: `https://github.com/아이디/저장소.git`
3. Cursor에서 프로젝트 폴더를 열고 터미널에 아래 명령어를 입력한다. `복사한_URL`만 GitHub Repository 주소로 바꾼다.

```bash
git remote add origin 복사한_URL
```

4. 변경된 파일을 올릴 준비 상태로 만든다.

```bash
git add .
```

5. 지금까지 작업한 내용을 저장 지점으로 남긴다.

```bash
git commit -m "첫 배포"
```

6. GitHub에 업로드한다.

```bash
git push -u origin main
```

7. GitHub 저장소 페이지에서 파일이 올라갔는지 확인한다.

> 이미 remote가 등록되어 있다는 에러가 나오면 `git remote -v`로 현재 연결된 주소를 먼저 확인한다.

### VIBE로 하기

```text
이 프로젝트를 GitHub에 올리고 싶어.

먼저 현재 git 상태를 확인하고, 커밋하면 안 되는 파일(.env.local, 비밀 키, 빌드 결과물 등)이 있는지 봐줘.
그다음 GitHub 새 저장소에 올리기 위한 순서를 초보자 기준으로 안내해줘.

GitHub Repository URL을 내가 붙여넣으면, 터미널에서 실행할 명령어를 순서대로 알려줘.
에러가 나면 에러 메시지를 보고 다음에 입력할 명령어를 알려줘.
```

## 7. Supabase 설정하는 방법

### FM으로 하기

1. Supabase에 GitHub 계정으로 가입하고 새 프로젝트를 만든다.
2. 내 앱에 회원가입, 게시글, 이미지 업로드, 좋아요 같은 기능이 필요한지 정리한다.
3. Cursor에게 필요한 테이블, 인증 방식, Storage 버킷을 먼저 설계해달라고 요청한다.
4. Cursor가 만든 SQL이나 설정 순서를 확인한 뒤 Supabase 대시보드에 적용한다.
5. Project Settings > API에서 Project URL과 공개 가능한 anon key를 복사한다.
6. Cursor에게 내 프로젝트의 환경변수 파일에 어떤 이름으로 넣어야 하는지 확인받는다.

> Supabase의 2~6번은 앱마다 달라진다. 예를 들어 이미지 업로드가 없는 앱이면 Storage가 필요 없고, 로그인 없는 앱이면 Auth 설정도 줄어든다.

### VIBE로 하기

```text
이 프로젝트에 Supabase를 연결하고 싶어.

먼저 이 앱에 어떤 데이터가 저장되어야 하는지 같이 정리해줘.
예를 들어 회원, 게시글, 댓글, 좋아요, 이미지 업로드가 필요한지 확인해줘.

그다음 필요한 테이블, 인증 방식, Storage 버킷, 환경변수 이름을 제안해줘.
그다음 Supabase 대시보드에서 어떤 순서로 설정해야 하는지 체크리스트로 알려줘.

절대 service_role 키를 클라이언트 코드에 넣지 말고, 공개 가능한 anon key만 쓰는 방식으로 안내해줘.
```

## 8. Vercel로 배포하는 방법

### FM으로 하기

1. Vercel에서 Add New Project를 누른다.
2. GitHub 저장소를 선택하고 Import한다.
3. 환경변수에 Supabase URL과 Anon Key를 입력한다.
4. Deploy를 눌러 배포가 끝날 때까지 기다린다.
5. 배포 URL을 열어 앱이 정상 동작하는지 확인한다.

### VIBE로 하기

```text
이 프로젝트를 Vercel로 배포하고 싶어.

먼저 배포 전에 확인해야 할 것들(package.json, 환경변수, GitHub 연결 상태)을 점검해줘.
그다음 Vercel에서 Import부터 환경변수 입력, Deploy, 배포 URL 확인까지 순서대로 안내해줘.

배포 실패가 나면 에러 로그에서 봐야 할 부분과 다음 해결 방법도 알려줘.
```

## 9. 기본 개발 용어 가이드


| 용어     | 설명                                                      |
| ------ | ------------------------------------------------------- |
| 프론트엔드  | 사람이 직접 보는 화면. 버튼, 글자, 카드, 입력창이 여기에 해당                   |
| 백엔드    | 화면 뒤에서 일을 처리하는 부분. 로그인 확인, 저장, 권한 체크를 담당                |
| DB     | 데이터를 넣어두는 엑셀 파일 같은 곳. 회원, 글, 댓글, 좋아요가 저장됨               |
| API    | 프론트엔드가 백엔드나 DB에 부탁할 때 쓰는 주문서. 예: 글 목록 가져와줘              |
| 서버     | 요청을 받고 결과를 돌려주는 컴퓨터. 보통 직접 만지지 않고 서비스로 빌려 씀             |
| 로컬호스트  | 내 컴퓨터 안에서만 열리는 테스트 주소. 예: `localhost:3000`              |
| 배포     | 내 컴퓨터 밖에서도 누구나 접속할 수 있게 인터넷에 올리는 일                      |
| GitHub | 코드를 올려두는 클라우드 저장소. 개발자용 구글드라이브라고 생각하면 됨                 |
| commit | 현재까지 작업한 내용을 저장 지점으로 남기는 일. 게임 세이브 포인트와 비슷함             |
| push   | 내 컴퓨터의 commit을 GitHub에 업로드하는 일                          |
| 환경변수   | 비밀 키나 프로젝트 주소처럼 코드에 직접 쓰면 안 되는 설정값. 보통 `.env.local`에 넣음 |


