export default function SignupPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">회원가입</h1>
      <div className="space-y-3 rounded-card border border-line bg-surface p-6">
        {[
          { label: "학번", type: "text" },
          { label: "이름", type: "text" },
          { label: "과", type: "text" },
          { label: "비밀번호", type: "password" },
          { label: "비밀번호 확인", type: "password" },
        ].map((f) => (
          <input
            key={f.label}
            type={f.type}
            className="w-full rounded-ctl border border-line px-3 py-3 text-sm"
            placeholder={f.label}
            disabled
          />
        ))}
        <button
          className="w-full rounded-ctl bg-primary py-3 text-sm font-semibold text-white"
          disabled
        >
          가입하기 (Phase 2)
        </button>
        <p className="pt-1 text-center text-xs text-ink-muted">
          학번으로 로그인합니다. 가입 즉시 이용 가능해요.
        </p>
      </div>
    </div>
  );
}
