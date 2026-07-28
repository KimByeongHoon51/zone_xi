// components/board/PlayerChips.tsx — 선수 칩(등번호) 목록, 활성 선수 선택
import { useStore } from '../../state/store';
import { GK_NO } from '../../constants/formations';
import { inkFor } from '../../constants/palette';
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

  return (
    <div className="space-y-3">
      {POS_ORDER.map((pos) => {
        const group = players.filter((p) => p.position === pos);
        if (group.length === 0) return null;
        return (
          <div key={pos}>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
              {POS_LABEL[pos]}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {group.map((p) => {
                const locked = p.no === GK_NO;
                const active = activePlayer === p.no;
                const painted = (zones[p.no]?.size ?? 0) > 0;
                return (
                  <button
                    key={p.no}
                    disabled={locked}
                    onClick={() => setActivePlayer(p.no)}
                    title={
                      locked
                        ? '골키퍼는 자동 배치·잠금'
                        : `${p.name ?? ''} · ${painted ? `${zones[p.no]?.size}칸` : '미색칠'}`
                    }
                    className={`relative flex h-9 w-9 items-center justify-center rounded-md text-sm font-bold transition ${
                      locked ? 'cursor-not-allowed opacity-60' : 'hover:scale-105'
                    } ${active ? 'ring-2 ring-offset-2 ring-brand' : 'ring-1 ring-black/10'}`}
                    style={{ background: p.color, color: inkFor(p.color) }}
                  >
                    {p.no}
                    {locked && (
                      <span className="absolute -right-1 -top-1 text-[9px]">🔒</span>
                    )}
                    {!locked && !painted && (
                      <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-warn" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <p className="pt-1 text-[11px] leading-relaxed text-muted">
        칩을 고른 뒤 판을 드래그해 활동 영역을 칠하세요. 골키퍼는 자동 배치됩니다.
      </p>
    </div>
  );
}
