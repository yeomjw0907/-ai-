"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createQaQuestion } from "@/lib/qa";
import { getCurrentUser, type CurrentUser } from "@/lib/posts";

export default function NewQaQuestionPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const previewUrl = useMemo(() => (imageFile ? URL.createObjectURL(imageFile) : null), [imageFile]);

  useEffect(() => {
    getCurrentUser().then((nextUser) => {
      setUser(nextUser);
      setIsChecking(false);
    });
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const questionId = await createQaQuestion({ title, body, imageFile });
      router.push(`/qa/${questionId}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "질문 저장에 실패했습니다.");
      setIsSubmitting(false);
    }
  }

  if (isChecking) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse rounded bg-line" />
        <div className="h-80 animate-pulse rounded-card bg-surface" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <h1 className="text-lg font-bold">질문 올리기</h1>
        <div className="rounded-card border border-line bg-surface p-6 text-center shadow-sm">
          <p className="text-sm leading-6 text-ink-muted">질문을 올리려면 먼저 로그인해주세요.</p>
          <Link
            href="/login"
            className="mt-4 inline-flex rounded-ctl bg-primary px-4 py-3 text-sm font-semibold text-white"
          >
            로그인하러 가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Link href="/qa" className="text-sm font-semibold text-primary">
          ← Q&A로
        </Link>
        <h1 className="mt-3 text-lg font-bold">질문 올리기</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-card border border-line bg-surface p-5 shadow-sm">
        <label className="block space-y-2">
          <span className="text-sm font-semibold">질문 제목</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-ctl border border-line px-3 py-3 text-sm outline-none transition focus:border-primary"
            placeholder="예: Supabase 로그인에서 막혔어요"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold">질문 내용</span>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="min-h-32 w-full rounded-ctl border border-line px-3 py-3 text-sm outline-none transition focus:border-primary"
            placeholder="어디서 막혔는지, 어떤 화면인지 적어주세요."
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold">스크린샷</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
            className="w-full rounded-ctl border border-line px-3 py-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-primary"
          />
          {previewUrl ? (
            <img src={previewUrl} alt="질문 스크린샷 미리보기" className="aspect-[16/9] w-full rounded-ctl object-cover" />
          ) : (
            <p className="rounded-ctl bg-bg p-3 text-xs text-ink-muted">
              화면 캡처를 올리면 답변을 받기 쉬워요.
            </p>
          )}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-ctl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-60"
        >
          {isSubmitting ? "저장 중..." : "질문 올리기"}
        </button>
        {message ? <p className="text-center text-xs text-accent">{message}</p> : null}
      </form>
    </div>
  );
}
