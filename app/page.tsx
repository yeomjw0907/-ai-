"use client";

import { useId, useState, type ReactNode } from "react";
import { Check, Copy, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const designLinks = [
  {
    title: "Mobbin",
    description: "실제 앱 화면 레퍼런스를 찾기 좋습니다.",
    href: "https://mobbin.com/",
  },
  {
    title: "Awwwards",
    description: "완성도 높은 웹사이트 톤앤무드를 볼 수 있습니다.",
    href: "https://www.awwwards.com/",
  },
  {
    title: "Land-book",
    description: "랜딩페이지 구조와 섹션 구성을 참고하기 좋습니다.",
    href: "https://land-book.com/",
  },
  {
    title: "Dribbble",
    description: "카드, 버튼, 앱 화면 아이디어를 빠르게 훑어볼 수 있습니다.",
    href: "https://dribbble.com/",
  },
  {
    title: "21st.dev",
    description: "요즘 스타일의 웹 UI 컴포넌트와 인터랙션을 참고하기 좋습니다.",
    href: "https://21st.dev/",
  },
];

const signupLinks = [
  {
    title: "Cursor",
    description: "AI와 함께 코드를 만들고 수정하는 개발 도구입니다.",
    href: "https://cursor.com/",
  },
  {
    title: "GitHub",
    description: "코드를 저장하고 공유하는 계정입니다.",
    href: "https://github.com/signup",
  },
  {
    title: "Vercel",
    description: "GitHub 계정으로 계속하기를 누르면 쉽게 가입할 수 있습니다.",
    href: "https://vercel.com/signup",
  },
  {
    title: "Supabase",
    description: "GitHub 계정으로 계속하기를 누르면 쉽게 가입할 수 있습니다.",
    href: "https://supabase.com/dashboard/sign-up",
  },
];

const lectureLinks = [
  {
    title: "강의자료",
    description: "오늘 발표에서 사용한 메인 강의자료입니다.",
    href: "/lecture-deck.html",
  },
];

const glossary = [
  ["프론트엔드", "사람이 직접 보는 화면입니다. 버튼, 글자, 카드, 입력창이 여기에 해당합니다."],
  ["백엔드", "화면 뒤에서 일을 처리하는 부분입니다. 로그인 확인, 저장, 권한 체크를 담당합니다."],
  ["DB", "데이터를 넣어두는 엑셀 파일 같은 곳입니다. 회원, 글, 댓글, 좋아요가 저장됩니다."],
  ["API", "프론트엔드가 백엔드나 DB에 부탁할 때 쓰는 주문서입니다. 예: 글 목록 가져와줘."],
  ["서버", "요청을 받고 결과를 돌려주는 컴퓨터입니다. 보통 우리는 직접 만지지 않고 서비스로 빌려 씁니다."],
  ["로컬호스트", "내 컴퓨터 안에서만 열리는 테스트 주소입니다. 예: localhost:3000"],
  ["배포", "내 컴퓨터 밖에서도 누구나 접속할 수 있게 인터넷에 올리는 일입니다."],
  ["GitHub", "코드를 올려두는 클라우드 저장소입니다. 개발자용 구글드라이브라고 생각하면 됩니다."],
  ["commit", "현재까지 작업한 내용을 저장 지점으로 남기는 일입니다. 게임 세이브 포인트와 비슷합니다."],
  ["push", "내 컴퓨터의 commit을 GitHub에 업로드하는 일입니다."],
  ["환경변수", "비밀 키나 프로젝트 주소처럼 코드에 직접 쓰면 안 되는 설정값입니다. 보통 .env.local에 넣습니다."],
];

const githubSteps = [
  "GitHub에서 새 Repository를 만듭니다.",
  "Repository 화면에서 HTTPS 주소를 복사합니다.",
  "Cursor 터미널에서 git remote add origin 복사한_URL을 입력합니다.",
  "git add . 로 변경된 파일을 올릴 준비 상태로 만듭니다.",
  "git commit -m \"첫 배포\" 로 저장 지점을 만듭니다.",
  "git push -u origin main으로 GitHub에 올립니다.",
  "GitHub 저장소 페이지에서 파일이 올라갔는지 확인합니다.",
];

const githubStepCommands = {
  2: "git remote add origin 복사한_URL",
  3: "git add .",
  4: 'git commit -m "첫 배포"',
  5: "git push -u origin main",
};

const deploySteps = [
  "Vercel에서 Add New Project를 누릅니다.",
  "GitHub 저장소를 선택하고 Import합니다.",
  "환경변수에 Supabase URL과 Anon Key를 입력합니다.",
  "Deploy를 눌러 배포가 끝날 때까지 기다립니다.",
  "배포 URL을 열어 앱이 정상 동작하는지 확인합니다.",
];

const supabaseSteps = [
  "Supabase에 GitHub 계정으로 가입하고 새 프로젝트를 만듭니다.",
  "내 앱에 회원가입, 게시글, 이미지 업로드, 좋아요 같은 기능이 필요한지 정리합니다.",
  "Cursor에게 필요한 테이블, 인증 방식, Storage 버킷을 먼저 설계해달라고 요청합니다.",
  "Cursor가 만든 SQL이나 설정 순서를 확인한 뒤 Supabase 대시보드에 적용합니다.",
  "Project Settings > API에서 Project URL과 공개 가능한 anon key를 복사합니다.",
  "Cursor에게 내 프로젝트의 환경변수 파일에 어떤 이름으로 넣어야 하는지 확인받습니다.",
];

const presetSteps = [
  "starter 폴더를 복사해 내 프로젝트 이름으로 바꿉니다.",
  "Cursor에서 폴더를 열고 README와 docs 폴더의 문서를 먼저 읽습니다.",
  "docs/1-PRD-템플릿.md를 내 아이디어로 채웁니다.",
  "docs/2-화면흐름-템플릿.md에 필요한 화면과 이동 순서를 적습니다.",
  "프롬프트-치트시트.md의 프롬프트를 Cursor 채팅에 붙여넣어 화면과 기능을 하나씩 만듭니다.",
];

const vibePresetPrompt = `이 폴더는 바이브코딩 스타터킷입니다.

먼저 README.md, .cursorrules, docs 폴더 안의 템플릿과 예시 문서를 읽고 구조를 파악해줘.

그다음 내가 만들 앱을 정할 수 있도록 꼭 필요한 질문 5개만 해줘.
내가 답하면 그 내용을 바탕으로 docs/1-PRD-템플릿.md와 docs/2-화면흐름-템플릿.md를 초안으로 채워줘.

아직 코드는 만들지 말고, 문서 초안과 다음에 구현할 1순위 화면만 제안해줘.`;

const vibeLocalDevPrompt = `이 프로젝트를 내 컴퓨터에서 실행해서 화면을 확인하고 싶어.

먼저 package.json을 읽고 어떤 명령어를 써야 하는지 확인해줘.
필요하면 의존성 설치부터 개발 서버 실행까지 순서대로 도와줘.

에러가 나면 에러 메시지를 바탕으로 원인을 설명하고, 내가 바로 따라 할 수 있는 다음 행동을 알려줘.`;

const vibeGithubPrompt = `이 프로젝트를 GitHub에 올리고 싶어.

먼저 현재 git 상태를 확인하고, 커밋하면 안 되는 파일(.env.local, 비밀 키, 빌드 결과물 등)이 있는지 봐줘.
그다음 GitHub 새 저장소에 올리기 위한 순서를 초보자 기준으로 안내해줘.

가능하면 Cursor Source Control에서 눌러야 하는 버튼 기준으로 설명해줘.`;

const vibeSupabasePrompt = `이 프로젝트에 Supabase를 연결하고 싶어.

먼저 docs 폴더와 코드에서 필요한 테이블, 인증 방식, Storage 버킷, 환경변수 이름을 확인해줘.
그다음 Supabase 대시보드에서 어떤 순서로 설정해야 하는지 체크리스트로 알려줘.

절대 service_role 키를 클라이언트 코드에 넣지 말고, 공개 가능한 anon key만 쓰는 방식으로 안내해줘.`;

const vibeDeployPrompt = `이 프로젝트를 Vercel로 배포하고 싶어.

먼저 배포 전에 확인해야 할 것들(package.json, 환경변수, GitHub 연결 상태)을 점검해줘.
그다음 Vercel에서 Import부터 환경변수 입력, Deploy, 배포 URL 확인까지 순서대로 안내해줘.

배포 실패가 나면 에러 로그에서 봐야 할 부분과 다음 해결 방법도 알려줘.`;

const localDevSteps = [
  "Cursor에서 프로젝트 폴더를 엽니다.",
  "상단 메뉴에서 Terminal을 열거나 Ctrl + ` 단축키로 터미널을 엽니다.",
  "처음 한 번은 npm install을 입력해 필요한 패키지를 설치합니다.",
  "npm run dev를 입력해 개발 서버를 실행합니다.",
  "브라우저에서 http://localhost:3000을 열어 화면을 확인합니다.",
];

type PresetMode = "fm" | "vibe";
type ModeGuideProps = {
  steps: string[];
  prompt: string;
  promptTitle: string;
  promptDescription: string;
  stepCommands?: Record<number, string>;
};

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function AccordionItem({
  eyebrow,
  title,
  defaultOpen = false,
  children,
}: {
  eyebrow: string;
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <article className="overflow-hidden rounded-card border border-line bg-surface shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 p-5 text-left transition-colors duration-200 active:bg-bg"
      >
        <div>
          <p className="text-xs font-semibold text-primary">{eyebrow}</p>
          <h2 className="mt-1 text-base font-bold">{title}</h2>
        </div>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center text-primary/55 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <ChevronDownIcon />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? "max-h-[1600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`px-5 pb-5 transition-all duration-300 ${
            isOpen ? "translate-y-0" : "-translate-y-2"
          }`}
        >
          {children}
        </div>
      </div>
    </article>
  );
}

function ModeGuide({
  steps,
  prompt,
  promptTitle,
  promptDescription,
  stepCommands,
}: ModeGuideProps) {
  const [mode, setMode] = useState<PresetMode>("fm");
  const [copied, setCopied] = useState(false);
  const [copiedCommandIndex, setCopiedCommandIndex] = useState<number | null>(null);
  const switchName = useId();

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  async function copyStepCommand(index: number, command: string) {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommandIndex(index);
      window.setTimeout(() => setCopiedCommandIndex(null), 1500);
    } catch {
      setCopiedCommandIndex(null);
    }
  }

  return (
    <div className="mt-4 space-y-4">
      <Switch name={switchName} size="large">
        <Switch.Control defaultChecked label="FM" value="fm" onSelect={() => setMode("fm")} />
        <Switch.Control label="VIBE" value="vibe" onSelect={() => setMode("vibe")} />
      </Switch>

      {mode === "fm" ? (
        <div className="space-y-3">
          <ol className="space-y-2 text-sm">
            {steps.map((step, index) => {
              const command = stepCommands?.[index];
              const copiedCommand = copiedCommandIndex === index;

              return (
                <li
                  key={step}
                  className="rounded-ctl bg-bg p-3 transition-all duration-200 hover:translate-x-1 hover:bg-primary/5"
                >
                  <div className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="leading-6">{step}</span>
                  </div>
                  {command ? (
                    <div className="mt-3 rounded-ctl border border-line bg-surface p-3">
                      <div className="flex items-center justify-between gap-2">
                        <code className="min-w-0 flex-1 break-all text-xs text-ink">{command}</code>
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="relative h-8 w-8 shrink-0 disabled:opacity-100"
                                onClick={() => copyStepCommand(index, command)}
                                aria-label={copiedCommand ? "명령어 복사 완료" : "명령어 복사"}
                                disabled={copiedCommand}
                              >
                                <div
                                  className={cn(
                                    "transition-all",
                                    copiedCommand ? "scale-100 opacity-100" : "scale-0 opacity-0",
                                  )}
                                >
                                  <Check
                                    className="stroke-emerald-500"
                                    size={15}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                  />
                                </div>
                                <div
                                  className={cn(
                                    "absolute transition-all",
                                    copiedCommand ? "scale-0 opacity-0" : "scale-100 opacity-100",
                                  )}
                                >
                                  <Copy size={15} strokeWidth={2} aria-hidden="true" />
                                </div>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="px-2 py-1 text-xs">
                              {copiedCommand ? "복사 완료" : "이 명령어만 복사"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      ) : (
        <div className="rounded-ctl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-primary">{promptTitle}</p>
              <p className="mt-1 text-xs leading-5 text-ink-muted">
                {promptDescription}
              </p>
            </div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="relative shrink-0 disabled:opacity-100"
                    onClick={copyPrompt}
                    aria-label={copied ? "프롬프트 복사 완료" : "프롬프트 복사"}
                    disabled={copied}
                  >
                    <div
                      className={cn(
                        "transition-all",
                        copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
                      )}
                    >
                      <Check
                        className="stroke-emerald-500"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </div>
                    <div
                      className={cn(
                        "absolute transition-all",
                        copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
                      )}
                    >
                      <Copy size={16} strokeWidth={2} aria-hidden="true" />
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-xs">
                  {copied ? "복사 완료" : "프롬프트 복사"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-ctl bg-white p-3 text-xs leading-5 text-ink shadow-inner">
            {prompt}
          </pre>
        </div>
      )}
    </div>
  );
}

function PresetGuide() {
  return (
    <ModeGuide
      steps={presetSteps}
      prompt={vibePresetPrompt}
      promptTitle="VIBE로 시작할 때 치는 프롬프트"
      promptDescription="스타터킷을 Cursor로 연 뒤, 채팅창에 그대로 붙여넣으세요."
    />
  );
}

export default function HomePage() {
  return (
    <div className="space-y-5">
      <section className="rounded-card border border-line bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
        <p className="text-xs font-semibold text-primary">대진대학교 AI캠퍼스</p>
        <h1 className="mt-1 text-xl font-bold">바이브코딩 창업캠프에 오신 걸 환영합니다</h1>
        <p className="mt-2 text-sm text-ink-muted">
          오늘 쓸 링크, 기본 폴더 프리셋 사용법, 꼭 알아야 할 개발 용어를 한곳에 모았습니다.
        </p>
      </section>

      <section className="space-y-3">
        <AccordionItem eyebrow="00 · 사전 준비" title="회원가입해야 하는 서비스" defaultOpen>
          <div className="space-y-2">
            <p className="rounded-ctl bg-primary/5 p-3 text-xs leading-5 text-primary">
              Cursor를 설치하고 GitHub 계정을 먼저 만들면, Vercel과 Supabase도 GitHub 계정으로 쉽게 시작할 수 있습니다.
            </p>
            {signupLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-ctl border border-line p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-sm active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{link.title}</p>
                  <ExternalLink size={16} strokeWidth={2} className="shrink-0 text-primary" aria-hidden="true" />
                </div>
                <p className="mt-1 text-xs leading-5 text-ink-muted">{link.description}</p>
              </a>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem eyebrow="01 · 발표자료" title="강의자료 바로가기" defaultOpen>
          <div className="space-y-2">
            {lectureLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-ctl border border-line p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-sm active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{link.title}</p>
                  <ExternalLink size={16} strokeWidth={2} className="shrink-0 text-primary" aria-hidden="true" />
                </div>
                <p className="mt-1 text-xs leading-5 text-ink-muted">{link.description}</p>
              </a>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem eyebrow="02 · 화면 참고" title="디자인 레퍼런스 바로가기" defaultOpen>
          <div className="space-y-2">
            {designLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-ctl border border-line p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-sm active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{link.title}</p>
                  <ExternalLink size={16} strokeWidth={2} className="shrink-0 text-primary" aria-hidden="true" />
                </div>
                <p className="mt-1 text-xs leading-5 text-ink-muted">{link.description}</p>
              </a>
            ))}
          </div>
        </AccordionItem>

        <AccordionItem eyebrow="03 · 시작 세팅" title="기본 폴더 프리셋 사용법">
          <p className="text-sm leading-6 text-ink-muted">
            스타터킷은 완성 앱이 아니라, 내 앱을 만들기 위한 기본 작업 폴더입니다.
            기획 문서 템플릿·프롬프트 치트시트·AI 작업 규칙(.cursorrules)이 들어있습니다.
          </p>
          <a
            href="/daejin-vibecoding-starter.zip"
            download
            className="mt-4 flex items-center justify-between gap-3 rounded-ctl bg-primary p-4 text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
          >
            <span className="flex items-center gap-3">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 shrink-0"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M7 10l5 5 5-5" />
                <path d="M12 15V3" />
              </svg>
              <span>
                <span className="block text-sm font-bold">스타터킷 다운로드</span>
                <span className="block text-xs text-white/80">기획 템플릿 · 치트시트 · .cursorrules (ZIP)</span>
              </span>
            </span>
            <Download size={18} strokeWidth={2.25} className="shrink-0" aria-hidden="true" />
          </a>
          <PresetGuide />
        </AccordionItem>

        <AccordionItem eyebrow="04 · 로컬 실행" title="Cursor에서 화면 확인하는 방법">
          <p className="mb-4 rounded-ctl bg-primary/5 p-3 text-xs leading-5 text-primary">
            `npm run dev`는 내 컴퓨터에서 임시 서버를 켜는 명령어입니다. 주소는 보통
            `http://localhost:3000`으로 열립니다.
          </p>
          <ModeGuide
            steps={localDevSteps}
            prompt={vibeLocalDevPrompt}
            promptTitle="VIBE로 로컬 실행할 때 치는 프롬프트"
            promptDescription="프로젝트 폴더를 Cursor로 연 뒤, 채팅창에 그대로 붙여넣으세요."
          />
        </AccordionItem>

        <AccordionItem eyebrow="05 · GitHub" title="GitHub에 코드 올리는 방법">
          <ModeGuide
            steps={githubSteps}
            prompt={vibeGithubPrompt}
            promptTitle="VIBE로 GitHub에 올릴 때 치는 프롬프트"
            promptDescription="커밋하거나 올리기 전에 채팅창에 붙여넣고 점검받으세요."
            stepCommands={githubStepCommands}
          />
        </AccordionItem>

        <AccordionItem eyebrow="06 · Supabase" title="Supabase 설정하는 방법">
          <ModeGuide
            steps={supabaseSteps}
            prompt={vibeSupabasePrompt}
            promptTitle="VIBE로 Supabase 설정할 때 치는 프롬프트"
            promptDescription="Supabase 프로젝트를 만들기 전이나 만든 직후에 붙여넣으세요."
          />
        </AccordionItem>

        <AccordionItem eyebrow="07 · 배포" title="Vercel로 배포하는 방법">
          <ModeGuide
            steps={deploySteps}
            prompt={vibeDeployPrompt}
            promptTitle="VIBE로 Vercel 배포할 때 치는 프롬프트"
            promptDescription="Vercel Import 전에 붙여넣고 배포 준비를 점검받으세요."
          />
        </AccordionItem>

        <AccordionItem eyebrow="08 · 용어 정리" title="기본 개발 용어 가이드">
          <div className="divide-y divide-line rounded-ctl border border-line">
            {glossary.map(([term, description]) => (
              <div key={term} className="p-3 transition-colors duration-200 hover:bg-bg">
                <p className="text-sm font-semibold">{term}</p>
                <p className="mt-1 text-xs leading-5 text-ink-muted">{description}</p>
              </div>
            ))}
          </div>
        </AccordionItem>
      </section>
    </div>
  );
}
