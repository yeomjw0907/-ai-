"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { studentNoToEmail } from "@/lib/auth";
import { getMyBoardPosts, type BoardPost } from "@/lib/posts";
import { getMyQaComments, getMyQaQuestions, type MyQaComment, type QaQuestion } from "@/lib/qa";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  name: string;
  department: string;
  student_no: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default function LoginPage() {
  const [studentNo, setStudentNo] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [myPosts, setMyPosts] = useState<BoardPost[]>([]);
  const [myQuestions, setMyQuestions] = useState<QaQuestion[]>([]);
  const [myComments, setMyComments] = useState<MyQaComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadMyContent(userId: string) {
    setIsContentLoading(true);
    const [nextPosts, nextQuestions, nextComments] = await Promise.all([
      getMyBoardPosts(userId),
      getMyQaQuestions(userId),
      getMyQaComments(userId),
    ]);

    setMyPosts(nextPosts);
    setMyQuestions(nextQuestions);
    setMyComments(nextComments);
    setIsContentLoading(false);
  }

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;

    client.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;

      const { data: profileData } = await client
        .from("profiles")
        .select("id, name, department, student_no")
        .eq("id", data.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        await loadMyContent(data.user.id);
      }
    });
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!supabase || !isSupabaseConfigured) {
      setMessage("Supabase 환경변수가 아직 설정되지 않았습니다.");
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: studentNoToEmail(studentNo),
      password,
    });

    if (error || !data.user) {
      setMessage("학번 또는 비밀번호를 확인하세요.");
      setIsLoading(false);
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, name, department, student_no")
      .eq("id", data.user.id)
      .single();

    setProfile(profileData);
    await loadMyContent(data.user.id);
    setMessage("로그인되었습니다.");
    setIsLoading(false);
  }

  async function handleLogout() {
    if (!supabase) return;

    setIsLoading(true);
    await supabase.auth.signOut();
    setProfile(null);
    setMyPosts([]);
    setMyQuestions([]);
    setMyComments([]);
    setStudentNo("");
    setPassword("");
    setMessage("로그아웃되었습니다.");
    setIsLoading(false);
  }

  if (profile) {
    const totalCount = myPosts.length + myQuestions.length + myComments.length;

    return (
      <div className="space-y-4">
        <h1 className="text-lg font-bold">내 정보</h1>
        <div className="space-y-4 rounded-card border border-line bg-surface p-6 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-primary">로그인 중</p>
            <h2 className="mt-1 text-xl font-bold">{profile.name}</h2>
            <p className="mt-1 text-sm text-ink-muted">
              {profile.department} · {profile.student_no}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full rounded-ctl border border-line py-3 text-sm font-semibold text-primary transition hover:border-primary disabled:opacity-60"
          >
            {isLoading ? "처리 중..." : "로그아웃"}
          </button>
          {message ? <p className="text-center text-xs text-ink-muted">{message}</p> : null}
        </div>

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-base font-bold">내가 쓴 글과 댓글</h2>
              <p className="mt-1 text-xs text-ink-muted">
                콘테스트 글, Q&A 질문, 댓글을 한 번에 모아봤어요.
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
              총 {totalCount}개
            </span>
          </div>

          {isContentLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-24 animate-pulse rounded-card bg-surface shadow-sm" />
              ))}
            </div>
          ) : totalCount === 0 ? (
            <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center">
              <p className="text-sm text-ink-muted">아직 작성한 글이나 댓글이 없어요.</p>
              <div className="mt-4 flex justify-center gap-3 text-sm font-semibold">
                <Link href="/board/new" className="text-primary">
                  작품 올리기
                </Link>
                <Link href="/qa/new" className="text-primary">
                  질문하기
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <ContentSection title="콘테스트 글" count={myPosts.length} emptyText="올린 작품이 없어요.">
                {myPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/board/${post.id}`}
                    className="block rounded-card border border-line bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="line-clamp-1 text-sm font-bold">{post.title}</h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink-muted">
                          {post.description}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-accent/10 px-2 py-1 text-xs font-bold text-accent">
                        ♡ {post.like_count}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-ink-muted">{formatDate(post.created_at)}</p>
                  </Link>
                ))}
              </ContentSection>

              <ContentSection title="Q&A 질문" count={myQuestions.length} emptyText="작성한 질문이 없어요.">
                {myQuestions.map((question) => (
                  <Link
                    key={question.id}
                    href={`/qa/${question.id}`}
                    className="block rounded-card border border-line bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="line-clamp-1 text-sm font-bold">{question.title}</h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-ink-muted">
                          {question.body}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                        댓글 {question.comment_count}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-ink-muted">{formatDate(question.created_at)}</p>
                  </Link>
                ))}
              </ContentSection>

              <ContentSection title="내가 쓴 댓글" count={myComments.length} emptyText="작성한 댓글이 없어요.">
                {myComments.map((comment) => (
                  <Link
                    key={comment.id}
                    href={`/qa/${comment.question_id}`}
                    className="block rounded-card border border-line bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
                  >
                    <p className="text-xs font-semibold text-primary">
                      {comment.question?.title ?? "삭제되었거나 찾을 수 없는 질문"}
                    </p>
                    <p className="mt-2 line-clamp-3 text-sm leading-6">{comment.body}</p>
                    <p className="mt-3 text-xs text-ink-muted">{formatDate(comment.created_at)}</p>
                  </Link>
                ))}
              </ContentSection>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">로그인</h1>
      <form onSubmit={handleLogin} className="space-y-3 rounded-card border border-line bg-surface p-6 shadow-sm">
        <input
          value={studentNo}
          onChange={(event) => setStudentNo(event.target.value)}
          className="w-full rounded-ctl border border-line px-3 py-3 text-sm outline-none transition focus:border-primary"
          placeholder="학번"
          inputMode="numeric"
          required
        />
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="비밀번호"
          required
        />
        <button
          className="w-full rounded-ctl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
        {message ? <p className="text-center text-xs text-accent">{message}</p> : null}
        <p className="pt-1 text-center text-xs text-ink-muted">
          계정이 없나요?{" "}
          <Link href="/signup" className="font-semibold text-primary">
            회원가입
          </Link>
        </p>
      </form>
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
  placeholder,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = isVisible ? EyeOff : Eye;

  return (
    <div className="relative">
      <input
        type={isVisible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-ctl border border-line px-3 py-3 pr-12 text-sm outline-none transition focus:border-primary"
        placeholder={placeholder}
        required={required}
      />
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition hover:bg-primary/10 hover:text-primary"
        aria-label={isVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function ContentSection({
  title,
  count,
  emptyText,
  children,
}: {
  title: string;
  count: number;
  emptyText: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold">{title}</h3>
        <span className="text-xs font-semibold text-ink-muted">{count}개</span>
      </div>
      {count === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-surface p-5 text-center text-sm text-ink-muted">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </section>
  );
}
