export default function OnboardingPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">표시 이름 정하기</h1>
      <div className="rounded-card border border-line bg-surface p-6">
        <p className="text-sm text-ink-muted">게시판에 보일 이름을 입력하세요.</p>
        <input
          className="mt-3 w-full rounded-ctl border border-line px-3 py-3 text-sm"
          placeholder="예: 홍길동"
          disabled
        />
        <p className="mt-2 text-xs text-ink-muted">(온보딩은 Phase 2에서 동작)</p>
      </div>
    </div>
  );
}
