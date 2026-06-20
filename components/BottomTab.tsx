"use client";

import type { ElementType } from "react";
import { BookOpenText, CircleHelp, Trophy, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type TabItem = {
  href: string;
  label: string;
  icon: ElementType<{ className?: string; strokeWidth?: number }>;
  match: (pathname: string) => boolean;
};

const TABS: TabItem[] = [
  { href: "/", label: "자료", icon: BookOpenText, match: (pathname) => pathname === "/" },
  { href: "/board", label: "콘테스트", icon: Trophy, match: (pathname) => pathname.startsWith("/board") },
  { href: "/qa", label: "Q&A", icon: CircleHelp, match: (pathname) => pathname.startsWith("/qa") },
  { href: "/login", label: "내 정보", icon: UserRound, match: (pathname) => pathname === "/login" || pathname === "/signup" },
];

export default function BottomTab() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-app border-t border-line bg-surface/95 px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl"
      aria-label="주요 메뉴"
    >
      <ul className="grid grid-cols-4 gap-1">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`group relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-ctl px-2 text-[11px] font-bold transition-all duration-200 active:scale-95 ${
                  active
                    ? "bg-primary/10 text-primary shadow-[0_8px_20px_rgba(11,77,162,0.10)]"
                    : "text-ink-muted hover:bg-bg hover:text-ink"
                }`}
              >
                <span
                  className={`flex h-7 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                    active ? "animate-[tabIconBounce_420ms_ease-out] text-primary" : "text-ink-muted group-hover:text-ink"
                  }`}
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.6 : 2.2} />
                </span>
                <span className="leading-none">{tab.label}</span>
                <span
                  className={`absolute bottom-1 h-0.5 rounded-full bg-primary transition-all duration-300 ${
                    active ? "w-6 opacity-100" : "w-0 opacity-0"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
