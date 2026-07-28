// screens/Landing.tsx — S1 랜딩 (구현 명세서 2·17장)
import { useStore } from '../state/store';
import { COPY } from '../constants/copy';

export function Landing() {
  const setStep = useStore((s) => s.setStep);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-brand text-white">
      {/* 배경 전술판 문양 */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <g fill="none" stroke="#fff" strokeWidth={0.3}>
          {Array.from({ length: 15 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 7} x2={100} y2={i * 7} />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`v${i}`} x1={i * 14.3} y1={0} x2={i * 14.3} y2={100} />
          ))}
          <circle cx={50} cy={50} r={12} />
        </g>
      </svg>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-8 py-16">
        <div className="animate-fade-in-up">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-white/80 ring-1 ring-white/20">
            2026 월드컵 데이터 · 축구 전술 실험실
          </div>
          <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl">
            {COPY.brand}
          </h1>
          <p className="mt-4 text-2xl font-bold text-emerald-100 sm:text-3xl">
            "{COPY.tagline}"
          </p>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/80">
            {COPY.subTagline}
          </p>

          <button
            onClick={() => setStep(2)}
            className="mt-8 rounded-xl bg-white px-8 py-3.5 text-lg font-bold text-brand shadow-lg transition hover:scale-[1.02] hover:bg-emerald-50"
          >
            {COPY.start} →
          </button>
        </div>

        {/* 핵심 루프 4단계 */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COPY.loop.map((s) => (
            <div
              key={s.n}
              className="rounded-xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-sm"
            >
              <div className="text-[11px] font-bold text-emerald-200">{s.n}</div>
              <div className="mt-1 text-base font-bold">{s.t}</div>
              <div className="mt-1 text-[12px] leading-relaxed text-white/70">
                {s.d}
              </div>
            </div>
          ))}
        </div>

        {/* 원칙 */}
        <div className="mt-10 space-y-1.5">
          {COPY.principles.map((p, i) => (
            <div key={i} className="flex items-start gap-2 text-[13px] text-white/75">
              <span className="mt-0.5 text-emerald-300">✓</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 측정 한계 (상시) */}
      <footer className="relative z-10 border-t border-white/10 px-8 py-4">
        <p className="mx-auto max-w-4xl text-[11px] leading-relaxed text-white/50">
          {COPY.limitation}
        </p>
      </footer>
    </div>
  );
}
