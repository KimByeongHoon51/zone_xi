// components/report/TendencyTag.tsx — 성향 태그 표시 (구현 명세서 16장)
import type { TendencyResult } from '../../lib/tendency';

export function TendencyTag({ t }: { t: TendencyResult }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-brand to-emerald-700 p-5 text-white shadow-lg">
      <div className="text-[11px] font-medium uppercase tracking-widest text-white/70">
        성향 태그
      </div>
      <div className="mt-1 text-3xl font-extrabold">{t.tag}</div>
      <div className="mt-1 text-sm text-white/80">{t.ref}</div>
      <p className="mt-2 text-[13px] leading-relaxed text-white/90">{t.desc}</p>
    </div>
  );
}
