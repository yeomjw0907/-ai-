"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PostForm from "@/components/PostForm";
import {
  getBoardPost,
  getCurrentUser,
  updateBoardPost,
  type BoardPost,
  type CurrentUser,
  type PostFormValues,
} from "@/lib/posts";

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<BoardPost | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function load() {
      const [nextPost, nextUser] = await Promise.all([getBoardPost(params.id), getCurrentUser()]);
      if (!ignore) {
        setPost(nextPost);
        setUser(nextUser);
        setIsLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [params.id]);

  async function handleSubmit(values: PostFormValues) {
    await updateBoardPost(params.id, values);
    router.push(`/board/${params.id}`);
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse rounded bg-line" />
        <div className="h-96 animate-pulse rounded-card bg-surface" />
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

  const canEdit = Boolean(user && (user.id === post.author_id || user.isAdmin));

  if (!canEdit) {
    return (
      <div className="space-y-4">
        <Link href={`/board/${post.id}`} className="text-sm font-semibold text-primary">
          ← 상세로
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
        <Link href={`/board/${post.id}`} className="text-sm font-semibold text-primary">
          ← 상세로
        </Link>
        <h1 className="mt-3 text-lg font-bold">콘테스트 작품 수정</h1>
      </div>
      <PostForm mode="edit" initialPost={post} onSubmit={handleSubmit} />
    </div>
  );
}
