export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">결과물 상세</h1>
      <div className="rounded-card border border-dashed border-line bg-surface p-8 text-center text-sm text-ink-muted">
        글 ID: {id}
        <br />
        (스샷·URL·좋아요는 Phase 3·4에서 구현)
      </div>
    </div>
  );
}
