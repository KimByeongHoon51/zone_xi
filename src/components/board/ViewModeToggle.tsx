// components/board/ViewModeToggle.tsx — 편집/밀집도 뷰 전환
import { useStore } from '../../state/store';
import type { ViewMode } from '../../state/types';

const OPTS: { v: ViewMode; label: string }[] = [
  { v: 'edit', label: '편집' },
  { v: 'density', label: '밀집도' },
];

export function ViewModeToggle() {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  return (
    <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
      {OPTS.map((o) => (
        <button
          key={o.v}
          onClick={() => setView(o.v)}
          className={`flex-1 rounded-md px-2 py-1.5 text-sm font-medium transition ${
            view === o.v
              ? 'bg-white text-ink shadow-sm'
              : 'text-subtle hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
