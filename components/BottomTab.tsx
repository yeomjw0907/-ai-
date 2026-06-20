"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "자료", match: (p: string) => p === "/" },
  { href: "/board", label: "게시판", match: (p: string) => p.startsWith("/board") },
  { href: "/login", label: "내 정보", match: (p: string) => p === "/login" || p === "/signup" },
];

export default function BottomTab() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-app border-t border-line bg-surface">
      <ul className="grid grid-cols-3">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`flex flex-col items-center justify-center gap-1 py-3 text-xs font-medium ${
                  active ? "text-primary" : "text-ink-muted"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    active ? "bg-primary" : "bg-transparent"
                  }`}
                />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
