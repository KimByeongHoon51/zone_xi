// components/board/PlayerChips.tsx — 선수 칩 + 【A】 예산 게이지 (구현 명세서 v1.1 §13)
import { useStore } from '../../state/store';
import { GK_NO } from '../../constants/formations';
import { inkFor } from '../../constants/palette';
import { budgetOf } from '../../lib/budget';
import type { Position } from '../../state/types';

const POS_LABEL: Record<Position, string> = {
  FW: '공격',
  MF: '미드필더',
  DF: '수비',
  GK: '골키퍼',
};
const POS_ORDER: Position[] = ['FW', 'MF', 'DF', 'GK'];

export function PlayerChips() {
  const players = useStore((s) => s.players);
  const activePlayer = useStore((s) => s.activePlayer);
  const setActivePlayer = useStore((s) => s.setActivePlayer);
  const phase = useStore((s) => s.phase);
  const zones = useStore((s) => s.zones[phase]);
  const { rows, cols } = useStore((s) => s.resolution);
  const B = budgetOf(rows, cols);

  return (
    <div className="space-y-3">
      {POS_ORDER.map((pos) => {
        const group = players.filter((p) => p.position === pos);
        if (group.length === 0) return null;
        return (
          <div key={pos}>
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
              {POS_LABEL[pos]}
            </div>
            <div className="flex flex-wrap gap-2">
              {group.map((p) => {
                const locked = p.no === GK_NO;
                const active = activePlayer === p.no;
                const used = zones[p.no]?.size ?? 0;
                const full = !locked && used >= B;
                const ratio = locked ? 1 : Math.min(used / B, 1);
                return (
                  <div key={p.no} className="flex w-9 flex-col items-center gap-1">
                    <button
                      disabled={locked}
                      onClick={() => setActivePlayer(p.no)}
                      title={
                        locked
                          ? '골키퍼는 자동 배치·잠금'
                          : `${p.name ?? ''} · ${used}/${B}칸${full ? ' · 예산 소진(지우고 다시 칠하기)' : ''}`
                      }
                      className={`relative flex h-9 w-9 items-center justify-center rounded-md text-sm font-bold transition ${
                        locked ? 'cursor-not-allowed opacity-60' : 'hover:scale-105'
                      } ${
                        active
                          ? 'ring-2 ring-offset-2 ring-brand'
                          : 'ring-1 ring-black/10'
                      }`}
                      style={{ background: p.color, color: inkFor(p.color) }}
                    >
                      {p.no}
                      {locked && (
                        <span className="absolute -right-1 -top-1 text-[9px]">
                          🔒
                        </span>
                      )}
                      {full && (
                        <span
                          title="예산 소진"
                          className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-overcrowd text-[8px] font-bold text-white"
                        >
                          ✓
                        </span>
                      )}
                    </button>
                    {/* 예산 게이지 */}
                    {!locked && (
                      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${ratio * 100}%`,
                            background: full ? '#B45309' : '#14532D',
                          }}
                        />
                      </div>
                    )}
                    {!locked && (
                      <span
                        className={`text-[9px] tabular-nums ${
                          full ? 'font-bold text-overcrowd' : 'text-muted'
                        }`}
                      >
                        {used}/{B}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <p className="pt-1 text-[11px] leading-relaxed text-muted">
        선수당 <b>{B}칸</b>까지만 칠할 수 있습니다. 다 쓰면 지우개로 지운 뒤 다시
        칠하세요. 골키퍼는 자동 배치됩니다.
      </p>
    </div>
  );
}
