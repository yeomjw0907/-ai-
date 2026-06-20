export default function LoginPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">내 정보 · 로그인</h1>
      <div className="rounded-card border border-line bg-surface p-6 text-center">
        <p className="text-sm text-ink-muted">결과물을 올리려면 로그인하세요.</p>
        <button
          className="mt-4 w-full rounded-ctl bg-[#FEE500] py-3 text-sm font-semibold text-[#191600]"
          disabled
        >
          카카오로 로그인 (Phase 2)
        </button>
      </div>
    </div>
  );
}
