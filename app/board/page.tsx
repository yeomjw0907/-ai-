export default function BoardPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">결과물 게시판</h1>
        <span className="text-xs text-ink-muted">최신순 · 인기순</span>
      </div>
      <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center">
        <p className="text-sm text-ink-muted">
          아직 결과물이 없어요. <br /> 첫 결과물을 올려보세요!
        </p>
        <p className="mt-2 text-xs text-ink-muted">(게시판은 Phase 3·4에서 동작합니다)</p>
      </div>
    </div>
  );
}
