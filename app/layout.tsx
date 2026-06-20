import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import BottomTab from "@/components/BottomTab";

export const metadata: Metadata = {
  title: "대진대학교 AI캠퍼스",
  description: "바이브코딩 창업캠프 — 강의 자료 + 결과물 게시판",
  manifest: "/manifest.json",
  icons: { icon: "/logo_color.png", apple: "/logo_color.png" },
};

export const viewport: Viewport = {
  themeColor: "#0B4DA2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="mx-auto flex min-h-screen w-full max-w-app flex-col bg-bg">
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo_color.png"
                alt="대진대학교"
                width={132}
                height={28}
                priority
                className="h-7 w-auto"
              />
              <span className="text-sm font-semibold text-ink-muted">AI캠퍼스</span>
            </Link>
          </header>

          <main className="flex-1 px-4 pb-24 pt-4">{children}</main>

          <BottomTab />
        </div>
      </body>
    </html>
  );
}
