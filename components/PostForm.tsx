"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { BoardPost, PostFormValues } from "@/lib/posts";

type PostFormProps = {
  mode: "create" | "edit";
  initialPost?: BoardPost;
  onSubmit: (values: PostFormValues) => Promise<void>;
};

export default function PostForm({ mode, initialPost, onSubmit }: PostFormProps) {
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [description, setDescription] = useState(initialPost?.description ?? "");
  const [appUrl, setAppUrl] = useState(initialPost?.app_url ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewUrl = useMemo(() => {
    if (!imageFile) return initialPost?.image_url ?? null;
    return URL.createObjectURL(imageFile);
  }, [imageFile, initialPost?.image_url]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      await onSubmit({
        title,
        description,
        appUrl,
        imageFile,
        existingImageUrl: initialPost?.image_url,
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "저장에 실패했습니다.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-card border border-line bg-surface p-5 shadow-sm">
      <label className="block space-y-2">
        <span className="text-sm font-semibold">제목</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-ctl border border-line px-3 py-3 text-sm outline-none transition focus:border-primary"
          placeholder="예: AI 여행 일정 추천 앱"
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold">앱 URL</span>
        <input
          value={appUrl}
          onChange={(event) => setAppUrl(event.target.value)}
          className="w-full rounded-ctl border border-line px-3 py-3 text-sm outline-none transition focus:border-primary"
          placeholder="https://..."
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold">한줄설명</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="min-h-24 w-full rounded-ctl border border-line px-3 py-3 text-sm outline-none transition focus:border-primary"
          placeholder="어떤 문제를 해결하는 앱인지 짧게 적어주세요."
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold">스크린샷 이미지</span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
          className="w-full rounded-ctl border border-line px-3 py-3 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-primary"
        />
        {previewUrl ? (
          <div className="overflow-hidden rounded-ctl border border-line">
            <img src={previewUrl} alt="스크린샷 미리보기" className="aspect-[16/10] w-full object-cover" />
          </div>
        ) : (
          <p className="rounded-ctl bg-bg p-3 text-xs text-ink-muted">
            스크린샷은 선택사항이지만, 올리면 콘테스트에서 더 잘 보여요.
          </p>
        )}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-ctl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-60"
      >
        {isSubmitting ? "저장 중..." : mode === "create" ? "결과물 올리기" : "수정 완료"}
      </button>
      {message ? <p className="text-center text-xs text-accent">{message}</p> : null}
    </form>
  );
}
