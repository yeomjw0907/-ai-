"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import ScreenshotPlaceholder from "@/components/ScreenshotPlaceholder";
import { getCurrentUser, type CurrentUser } from "@/lib/posts";
import {
  COMMENT_REACTIONS,
  createQaComment,
  deleteQaComment,
  deleteQaQuestion,
  getQaComments,
  getQaQuestion,
  toggleQaCommentReaction,
  updateQaComment,
  type CommentReaction,
  type QaComment,
  type QaQuestion,
} from "@/lib/qa";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function QaDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [question, setQuestion] = useState<QaQuestion | null>(null);
  const [comments, setComments] = useState<QaComment[]>([]);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [body, setBody] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentBody, setEditingCommentBody] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const nextUser = await getCurrentUser();
    const [nextQuestion, nextComments] = await Promise.all([
      getQaQuestion(params.id),
      getQaComments(params.id, nextUser?.id),
    ]);
    setUser(nextUser);
    setQuestion(nextQuestion);
    setComments(nextComments);
    setIsLoading(false);
  }

  useEffect(() => {
    let ignore = false;

    async function loadInitial() {
      setIsLoading(true);
      const nextUser = await getCurrentUser();
      const [nextQuestion, nextComments] = await Promise.all([
        getQaQuestion(params.id),
        getQaComments(params.id, nextUser?.id),
      ]);

      if (!ignore) {
        setUser(nextUser);
        setQuestion(nextQuestion);
        setComments(nextComments);
        setIsLoading(false);
      }
    }

    loadInitial();

    return () => {
      ignore = true;
    };
  }, [params.id]);

  async function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("댓글을 달려면 로그인해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createQaComment(params.id, body);
      setBody("");
      await load();
    } catch {
      setMessage("댓글 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReaction(comment: QaComment, emoji: CommentReaction) {
    setMessage("");

    if (!user) {
      setMessage("반응하려면 로그인해주세요.");
      return;
    }

    const isActive = comment.myReactions.includes(emoji);
    try {
      await toggleQaCommentReaction(comment.id, user, emoji, isActive);
      await load();
    } catch {
      setMessage("반응 처리에 실패했습니다.");
    }
  }

  async function handleQuestionDelete() {
    if (!question) return;
    const ok = window.confirm("이 질문을 삭제할까요? 댓글도 함께 삭제됩니다.");
    if (!ok) return;

    try {
      await deleteQaQuestion(question.id);
      router.push("/qa");
    } catch {
      setMessage("질문 삭제에 실패했습니다.");
    }
  }

  function startCommentEdit(comment: QaComment) {
    setEditingCommentId(comment.id);
    setEditingCommentBody(comment.body);
  }

  async function handleCommentUpdate(commentId: string) {
    setMessage("");

    try {
      await updateQaComment(commentId, editingCommentBody);
      setEditingCommentId(null);
      setEditingCommentBody("");
      await load();
    } catch {
      setMessage("댓글 수정에 실패했습니다.");
    }
  }

  async function handleCommentDelete(commentId: string) {
    const ok = window.confirm("이 댓글을 삭제할까요?");
    if (!ok) return;

    setMessage("");
    try {
      await deleteQaComment(commentId);
      await load();
    } catch {
      setMessage("댓글 삭제에 실패했습니다.");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-5 w-24 animate-pulse rounded bg-line" />
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

  const canManageQuestion = Boolean(user && (user.id === question.author_id || user.isAdmin));

  return (
    <div className="space-y-4">
      <Link href="/qa" className="text-sm font-semibold text-primary">
        ← Q&A로
      </Link>

      <article className="overflow-hidden rounded-card border border-line bg-surface shadow-sm">
        <div className="aspect-[16/9]">
          {question.image_url ? (
            <img src={question.image_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ScreenshotPlaceholder />
          )}
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-3 text-xs text-ink-muted">
            <span>
              {question.author?.name ?? "익명"}
              {question.author?.department ? ` · ${question.author.department}` : ""}
            </span>
            <span>{formatDate(question.created_at)}</span>
          </div>
          <h1 className="text-xl font-bold">{question.title}</h1>
          <p className="whitespace-pre-wrap text-sm leading-6 text-ink-muted">{question.body}</p>
          {canManageQuestion ? (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href={`/qa/${question.id}/edit`}
                className="rounded-ctl border border-line py-2.5 text-center text-sm font-semibold text-primary transition hover:border-primary"
              >
                수정
              </Link>
              <button
                type="button"
                onClick={handleQuestionDelete}
                className="rounded-ctl border border-line py-2.5 text-sm font-semibold text-accent transition hover:border-accent"
              >
                삭제
              </button>
            </div>
          ) : null}
        </div>
      </article>

      <section className="space-y-3">
        <h2 className="text-base font-bold">댓글 {comments.length}</h2>
        {comments.length === 0 ? (
          <div className="rounded-card border border-dashed border-line bg-surface p-6 text-center text-sm text-ink-muted">
            아직 댓글이 없어요. 첫 답변을 남겨보세요.
          </div>
        ) : (
          comments.map((comment) => {
            const canManageComment = Boolean(user && (user.id === comment.author_id || user.isAdmin));
            const isEditing = editingCommentId === comment.id;

            return (
              <article key={comment.id} className="rounded-card border border-line bg-surface p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between gap-3 text-xs text-ink-muted">
                  <span>
                    {comment.author?.name ?? "익명"}
                    {comment.author?.department ? ` · ${comment.author.department}` : ""}
                  </span>
                  <span>{formatDate(comment.created_at)}</span>
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingCommentBody}
                      onChange={(event) => setEditingCommentBody(event.target.value)}
                      className="min-h-24 w-full rounded-ctl border border-line px-3 py-3 text-sm outline-none transition focus:border-primary"
                      required
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleCommentUpdate(comment.id)}
                        className="rounded-ctl bg-primary py-2.5 text-sm font-semibold text-white"
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditingCommentBody("");
                        }}
                        className="rounded-ctl border border-line py-2.5 text-sm font-semibold text-ink-muted"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-6">{comment.body}</p>
                )}

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {COMMENT_REACTIONS.map((emoji) => {
                    const active = comment.myReactions.includes(emoji);
                    const count = comment.reactions[emoji];
                    return (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleReaction(comment, emoji)}
                        className={`rounded-full border px-2.5 py-1 text-sm transition active:scale-95 ${
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-line bg-bg text-ink-muted hover:border-primary"
                        }`}
                      >
                        {emoji} {count > 0 ? count : ""}
                      </button>
                    );
                  })}
                </div>

                {canManageComment && !isEditing ? (
                  <div className="mt-3 flex gap-2 text-xs font-semibold">
                    <button type="button" onClick={() => startCommentEdit(comment)} className="text-primary">
                      수정
                    </button>
                    <button type="button" onClick={() => handleCommentDelete(comment.id)} className="text-accent">
                      삭제
                    </button>
                  </div>
                ) : null}
              </article>
            );
          })
        )}
      </section>

      <form onSubmit={handleCommentSubmit} className="space-y-3 rounded-card border border-line bg-surface p-4 shadow-sm">
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="min-h-24 w-full rounded-ctl border border-line px-3 py-3 text-sm outline-none transition focus:border-primary"
          placeholder={user ? "댓글을 입력하세요." : "로그인하면 댓글을 달 수 있어요."}
          disabled={!user}
          required
        />
        <button
          type="submit"
          disabled={!user || isSubmitting}
          className="w-full rounded-ctl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-60"
        >
          {isSubmitting ? "등록 중..." : "댓글 달기"}
        </button>
        {message ? <p className="text-center text-xs text-accent">{message}</p> : null}
      </form>
    </div>
  );
}
