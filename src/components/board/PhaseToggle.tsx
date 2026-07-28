// components/board/PhaseToggle.tsx — 수비 → [공격 시 전개] 국면 전환 (구현 명세서 14장)
import { useStore } from '../../state/store';
import type { Phase } from '../../state/types';

export function PhaseToggle() {
  const phase = useStore((s) => s.phase);
  const setPhase = useStore((s) => s.setPhase);
  const attackInitialized = useStore((s) => s.attackInitialized);

  const opts: { p: Phase; label: string }[] = [
    { p: 'defense', label: '수비 국면' },
    { p: 'attack', label: '공격 시 전개' },
  ];

  return (
    <div>
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
        {opts.map((o) => (
          <button
            key={o.p}
            onClick={() => setPhase(o.p)}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition ${
              phase === o.p
                ? 'bg-brand text-white shadow-sm'
                : 'text-subtle hover:text-ink'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {phase === 'attack' && (
        <p className="mt-1.5 text-[11px] leading-relaxed text-subtle">
          {attackInitialized
            ? '수비 배치를 복사해 왔습니다. 공격 시 전진할 영역으로 수정해 보세요.'
            : ''}
        </p>
      )}
    </div>
  );
}
