"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ScreenshotPlaceholder from "@/components/ScreenshotPlaceholder";
import { getQaQuestions, type QaQuestion } from "@/lib/qa";
import { isSupabaseConfigured } from "@/lib/supabase";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric" }).format(new Date(value));
}

export default function QaPage() {
  const [questions, setQuestions] = useState<QaQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadQuestions() {
      setIsLoading(true);
      const nextQuestions = await getQaQuestions();
      if (!ignore) {
        setQuestions(nextQuestions);
        setIsLoading(false);
      }
    }

    loadQuestions();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Q&A</h1>
        <Link
          href="/qa/new"
          className="rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-strong active:scale-95"
        >
          질문하기
        </Link>
      </div>

      {!isSupabaseConfigured ? (
        <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center">
          <p className="text-sm text-ink-muted">Supabase 환경변수가 아직 설정되지 않았습니다.</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((item) => (
            <div key={item} className="h-36 animate-pulse rounded-card bg-surface shadow-sm" />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center">
          <p className="text-sm text-ink-muted">
            아직 질문이 없어요. <br /> 막히는 부분을 편하게 올려보세요!
          </p>
          <Link href="/qa/new" className="mt-4 inline-flex text-sm font-semibold text-primary">
            첫 질문 올리기
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((question) => (
            <Link
              key={question.id}
              href={`/qa/${question.id}`}
              className="block rounded-card border border-line bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
            >
              <div className="mb-3 aspect-[16/9] overflow-hidden rounded-ctl">
                {question.image_url ? (
                  <img src={question.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ScreenshotPlaceholder />
                )}
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="line-clamp-1 text-base font-bold">{question.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-ink-muted">{question.body}</p>
                </div>
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                  댓글 {question.comment_count}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-ink-muted">
                <span>
                  {question.author?.name ?? "익명"}
                  {question.author?.department ? ` · ${question.author.department}` : ""}
                </span>
                <span>{formatDate(question.created_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
