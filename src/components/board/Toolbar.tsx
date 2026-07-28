// components/board/Toolbar.tsx — 좌측 툴바 (뷰/도구/국면/선수 칩) 구현 명세서 1·17장
import { useStore } from '../../state/store';
import type { Tool } from '../../state/types';
import { ViewModeToggle } from './ViewModeToggle';
import { PhaseToggle } from './PhaseToggle';
import { PlayerChips } from './PlayerChips';

const TOOLS: { t: Tool; label: string; icon: string; hint: string }[] = [
  { t: 'brush', label: '브러시', icon: '🖌️', hint: '드래그로 칠하기' },
  { t: 'rect', label: '사각', icon: '⬛', hint: '드래그 범위 일괄 (Shift로도 가능)' },
  { t: 'eraser', label: '지우개', icon: '🩹', hint: '드래그로 지우기' },
];

export function Toolbar() {
  const view = useStore((s) => s.view);
  const tool = useStore((s) => s.tool);
  const setTool = useStore((s) => s.setTool);
  const undo = useStore((s) => s.undo);
  const resetPhase = useStore((s) => s.resetPhase);
  const reseedPhase = useStore((s) => s.reseedPhase);
  const historyLen = useStore((s) => s.history.length);

  return (
    <aside className="flex w-[228px] shrink-0 flex-col gap-4 overflow-y-auto rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
          뷰
        </div>
        <ViewModeToggle />
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
          국면
        </div>
        <PhaseToggle />
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
          도구
        </div>
        <div className="flex gap-1.5">
          {TOOLS.map((o) => (
            <button
              key={o.t}
              onClick={() => setTool(o.t)}
              title={o.hint}
              disabled={view === 'density'}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-md py-2 text-[11px] font-medium transition disabled:opacity-40 ${
                tool === o.t
                  ? 'bg-brand/10 text-brand ring-1 ring-brand/30'
                  : 'bg-slate-100 text-subtle hover:text-ink'
              }`}
            >
              <span className="text-base">{o.icon}</span>
              {o.label}
            </button>
          ))}
        </div>
        <div className="mt-2 flex gap-1.5">
          <button
            onClick={undo}
            disabled={historyLen === 0}
            className="flex-1 rounded-md bg-slate-100 py-1.5 text-xs font-medium text-subtle transition hover:text-ink disabled:opacity-40"
          >
            ↺ 실행취소
          </button>
          <button
            onClick={reseedPhase}
            title="현재 국면을 기본 배치로 복원"
            className="flex-1 rounded-md bg-slate-100 py-1.5 text-xs font-medium text-subtle transition hover:text-ink"
          >
            ⟳ 기본배치
          </button>
        </div>
        <button
          onClick={resetPhase}
          className="mt-1.5 w-full rounded-md bg-slate-100 py-1.5 text-xs font-medium text-warn transition hover:bg-warn/10"
        >
          현재 국면 전체 지우기
        </button>
      </div>

      <div className="border-t border-slate-100 pt-3">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
          선수 (10명 + GK)
        </div>
        <PlayerChips />
      </div>
    </aside>
  );
}
