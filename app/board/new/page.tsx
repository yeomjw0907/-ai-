"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostForm from "@/components/PostForm";
import { createBoardPost, getCurrentUser, type CurrentUser, type PostFormValues } from "@/lib/posts";

export default function NewPostPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    getCurrentUser().then((nextUser) => {
      setUser(nextUser);
      setIsChecking(false);
    });
  }, []);

  async function handleSubmit(values: PostFormValues) {
    const postId = await createBoardPost(values);
    router.push(`/board/${postId}`);
  }

  if (isChecking) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse rounded bg-line" />
        <div className="h-96 animate-pulse rounded-card bg-surface" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <h1 className="text-lg font-bold">콘테스트 작품 올리기</h1>
        <div className="rounded-card border border-line bg-surface p-6 text-center shadow-sm">
          <p className="text-sm leading-6 text-ink-muted">콘테스트 작품을 올리려면 먼저 로그인해주세요.</p>
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
        <Link href="/board" className="text-sm font-semibold text-primary">
          ← 콘테스트로
        </Link>
        <h1 className="mt-3 text-lg font-bold">콘테스트 작품 올리기</h1>
      </div>
      <PostForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
}
