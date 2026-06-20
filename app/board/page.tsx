"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ScreenshotPlaceholder from "@/components/ScreenshotPlaceholder";
import { getBoardPosts, type BoardPost, type PostSort } from "@/lib/posts";
import { isSupabaseConfigured } from "@/lib/supabase";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default function BoardPage() {
  const [sort, setSort] = useState<PostSort>("newest");
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadPosts() {
      setIsLoading(true);
      const nextPosts = await getBoardPosts(sort);
      if (!ignore) {
        setPosts(nextPosts);
        setIsLoading(false);
      }
    }

    loadPosts();

    return () => {
      ignore = true;
    };
  }, [sort]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">콘테스트</h1>
        </div>
        <Link
          href="/board/new"
          className="rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-strong active:scale-95"
        >
          글쓰기
        </Link>
      </div>

      <div className="grid grid-cols-2 rounded-ctl bg-surface p-1 shadow-sm">
        {[
          { value: "newest", label: "최신순" },
          { value: "popular", label: "인기순" },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setSort(item.value as PostSort)}
            className={`rounded-[10px] py-2 text-sm font-semibold transition-all duration-200 ${
              sort === item.value ? "bg-primary text-white shadow-sm" : "text-ink-muted hover:bg-bg"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {!isSupabaseConfigured ? (
        <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center">
          <p className="text-sm text-ink-muted">Supabase 환경변수가 아직 설정되지 않았습니다.</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((item) => (
            <div key={item} className="h-48 animate-pulse rounded-card bg-surface shadow-sm" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center">
          <p className="text-sm text-ink-muted">
            아직 콘테스트 작품이 없어요. <br /> 첫 작품을 올려보세요!
          </p>
          <Link href="/board/new" className="mt-4 inline-flex text-sm font-semibold text-primary">
            작품 올리기
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/board/${post.id}`}
              className="block overflow-hidden rounded-card border border-line bg-surface shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
            >
              <div className="aspect-[16/10] bg-bg">
                {post.image_url ? (
                  <img src={post.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ScreenshotPlaceholder />
                )}
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="line-clamp-1 text-base font-bold">{post.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-ink-muted">
                      {post.description}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-accent/10 px-2 py-1 text-xs font-bold text-accent">
                    ♡ {post.like_count}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-ink-muted">
                  <span>
                    {post.author?.name ?? "익명"}
                    {post.author?.department ? ` · ${post.author.department}` : ""}
                  </span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
