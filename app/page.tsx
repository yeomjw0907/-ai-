export default function HomePage() {
  return (
    <div className="space-y-4">
      <section className="rounded-card border border-line bg-surface p-5">
        <p className="text-xs font-semibold text-primary">대진대학교 AI캠퍼스</p>
        <h1 className="mt-1 text-xl font-bold">바이브코딩 창업캠프에 오신 걸 환영합니다</h1>
        <p className="mt-2 text-sm text-ink-muted">
          오늘의 자료와 결과물 게시판이 여기 모여요. 아래 메뉴로 이동하세요.
        </p>
      </section>

      <section className="rounded-card border border-line bg-surface p-5">
        <h2 className="text-sm font-semibold">강의 자료</h2>
        <p className="mt-1 text-sm text-ink-muted">
          오늘의 흐름 · 프롬프트 치트시트 · 도구 링크 — <b>Phase 1에서 채워집니다.</b>
        </p>
      </section>
    </div>
  );
}
