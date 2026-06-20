import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">로그인</h1>
      <div className="space-y-3 rounded-card border border-line bg-surface p-6">
        <input
          className="w-full rounded-ctl border border-line px-3 py-3 text-sm"
          placeholder="학번"
          disabled
        />
        <input
          type="password"
          className="w-full rounded-ctl border border-line px-3 py-3 text-sm"
          placeholder="비밀번호"
          disabled
        />
        <button
          className="w-full rounded-ctl bg-primary py-3 text-sm font-semibold text-white"
          disabled
        >
          로그인 (Phase 2)
        </button>
        <p className="pt-1 text-center text-xs text-ink-muted">
          계정이 없나요?{" "}
          <Link href="/signup" className="font-semibold text-primary">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
