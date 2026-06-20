"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCurrentUser, type CurrentUser } from "@/lib/posts";
import { getQaQuestion, updateQaQuestion, type QaQuestion } from "@/lib/qa";

export default function EditQaQuestionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [question, setQuestion] = useState<QaQuestion | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return question?.image_url ?? null;
  }, [imageFile, question?.image_url]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const [nextQuestion, nextUser] = await Promise.all([getQaQuestion(params.id), getCurrentUser()]);
      if (!ignore) {
        setQuestion(nextQuestion);
        setUser(nextUser);
        setTitle(nextQuestion?.title ?? "");
        setBody(nextQuestion?.body ?? "");
        setIsLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [params.id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      await updateQaQuestion(params.id, {
        title,
        body,
        imageFile,
        existingImageUrl: question?.image_url,
      });
      router.push(`/qa/${params.id}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "질문 수정에 실패했습니다.");
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse rounded bg-line" />
        <div className="h-80 animate-pulse rounded-card bg-surface" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="space-y-4">
        <Link href="/qa" className="text-sm font-semibold text-primary">
          ← Q&A로
        </Link>
        <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center">
          <p className="text-sm text-ink-muted">질문을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const canEdit = Boolean(user && (user.id === question.author_id || user.isAdmin));

  if (!canEdit) {
    return (
      <div className="space-y-4">
        <Link href={`/qa/${question.id}`} className="text-sm font-semibold text-primary">
          ← 질문으로
        </Link>
        <div className="rounded-card border border-line bg-surface p-6 text-center shadow-sm">
          <p className="text-sm text-ink-muted">수정 권한이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Link href={`/qa/${question.id}`} className="text-sm font-semibold text-primary">
          ← 질문으로
        </Link>
        <h1 className="mt-3 text-lg font-bold">질문 수정</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-card border border-line bg-surface p-5 shadow-sm">
        <label className="block space-y-2">
          <span className="text-sm font-semibold">질문 제목</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-ctl border border-line px-3 py-3 text-sm outline-none transition focus:border-primary"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold">질문 내용</span>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="min-h-32 w-full rounded-ctl border border-line px-3 py-3 text-sm outline-none transition focus:border-primary"
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
            <p className="rounded-ctl bg-bg p-3 text-xs text-ink-muted">새 스크린샷을 선택할 수 있습니다.</p>
          )}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-ctl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-60"
        >
          {isSubmitting ? "저장 중..." : "수정 완료"}
        </button>
        {message ? <p className="text-center text-xs text-accent">{message}</p> : null}
      </form>
    </div>
  );
}
