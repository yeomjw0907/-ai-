"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ScreenshotPlaceholder from "@/components/ScreenshotPlaceholder";
import {
  deleteBoardPost,
  getBoardPost,
  getCurrentUser,
  getLikeState,
  togglePostLike,
  type BoardPost,
  type CurrentUser,
} from "@/lib/posts";
import { isSupabaseConfigured } from "@/lib/supabase";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<BoardPost | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadPost() {
      setIsLoading(true);
      const [nextPost, nextUser] = await Promise.all([getBoardPost(params.id), getCurrentUser()]);
      const nextIsLiked = nextUser ? await getLikeState(params.id, nextUser.id) : false;
      if (!ignore) {
        setPost(nextPost);
        setUser(nextUser);
        setIsLiked(nextIsLiked);
        setIsLoading(false);
      }
    }

    loadPost();

    return () => {
      ignore = true;
    };
  }, [params.id]);

  async function refreshPost() {
    const nextPost = await getBoardPost(params.id);
    setPost(nextPost);
  }

  async function handleLike() {
    setMessage("");

    if (!user) {
      setMessage("좋아요를 누르려면 로그인해주세요.");
      return;
    }

    setIsMutating(true);
    try {
      await togglePostLike(params.id, user.id, isLiked);
      setIsLiked((liked) => !liked);
      await refreshPost();
    } catch {
      setMessage("좋아요 처리에 실패했습니다.");
    } finally {
      setIsMutating(false);
    }
  }

  async function handleDelete() {
    if (!post) return;
    const ok = window.confirm("이 결과물을 삭제할까요?");
    if (!ok) return;

    setIsMutating(true);
    setMessage("");
    try {
      await deleteBoardPost(post.id);
      router.push("/board");
    } catch {
      setMessage("삭제 권한이 없거나 삭제에 실패했습니다.");
      setIsMutating(false);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="space-y-4">
        <Link href="/board" className="text-sm font-semibold text-primary">
          ← 콘테스트로
        </Link>
        <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center text-sm text-ink-muted">
          Supabase 환경변수가 아직 설정되지 않았습니다.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-5 w-24 animate-pulse rounded bg-line" />
        <div className="h-80 animate-pulse rounded-card bg-surface" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="space-y-4">
        <Link href="/board" className="text-sm font-semibold text-primary">
          ← 콘테스트로
        </Link>
        <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center">
          <p className="text-sm text-ink-muted">콘테스트 작품을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const canManage = Boolean(user && (user.id === post.author_id || user.isAdmin));

  return (
    <div className="space-y-4">
      <Link href="/board" className="text-sm font-semibold text-primary">
        ← 콘테스트로
      </Link>

      <article className="overflow-hidden rounded-card border border-line bg-surface shadow-sm">
        <div className="aspect-[16/10] bg-bg">
          {post.image_url ? (
            <img src={post.image_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <ScreenshotPlaceholder />
          )}
        </div>

        <div className="space-y-4 p-5">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3 text-xs text-ink-muted">
              <span>
                {post.author?.name ?? "익명"}
                {post.author?.department ? ` · ${post.author.department}` : ""}
              </span>
              <span>{formatDate(post.created_at)}</span>
            </div>
            <h1 className="text-xl font-bold">{post.title}</h1>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{post.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleLike}
              disabled={isMutating}
              className={`rounded-full px-3 py-2 text-sm font-bold transition active:scale-95 disabled:opacity-60 ${
                isLiked ? "bg-accent text-white" : "bg-accent/10 text-accent hover:bg-accent/15"
              }`}
            >
              {isLiked ? "♥" : "♡"} {post.like_count}
            </button>
            {!user ? <span className="text-xs text-ink-muted">로그인하면 좋아요를 누를 수 있어요.</span> : null}
          </div>

          <a
            href={post.app_url}
            target="_blank"
            rel="noreferrer"
            className="block rounded-ctl bg-primary py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-strong active:scale-[0.99]"
          >
            앱 열어보기
          </a>

          {canManage ? (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/board/${post.id}/edit`}
                className="rounded-ctl border border-line py-3 text-center text-sm font-semibold text-primary transition hover:border-primary"
              >
                수정
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isMutating}
                className="rounded-ctl border border-line py-3 text-sm font-semibold text-accent transition hover:border-accent disabled:opacity-60"
              >
                삭제
              </button>
            </div>
          ) : null}

          {message ? <p className="text-center text-xs text-accent">{message}</p> : null}
        </div>
      </article>
    </div>
  );
}
