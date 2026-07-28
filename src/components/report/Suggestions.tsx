// components/report/Suggestions.tsx — 발견·제안 문장 (구현 명세서 16장)
import type { Finding } from '../../lib/suggestions';

export function FindingList({
  title,
  icon,
  items,
  accent,
}: {
  title: string;
  icon: string;
  items: Finding[];
  accent: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-bold text-ink">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((f, i) => (
          <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-ink">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
            <span>{f.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
