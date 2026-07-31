// screens/Board.tsx — S3 전술판 (핵심, 구현 명세서 1·2·17장)
import { useState } from 'react';
import { useStore } from '../state/store';
import { PitchGrid } from '../components/pitch/PitchGrid';
import { Toolbar } from '../components/board/Toolbar';
import { LiveFeedback } from '../components/board/LiveFeedback';
import { SimilarityCard } from '../components/board/SimilarityCard';
import { TileBottomSheet } from '../components/board/TileBottomSheet';
import { COPY } from '../constants/copy';

export function Board() {
  const setStep = useStore((s) => s.setStep);
  const phase = useStore((s) => s.phase);
  const activePlayer = useStore((s) => s.activePlayer);
  const players = useStore((s) => s.players);
  const [hovered, setHovered] = useState<number | null>(null);

  const active = players.find((p) => p.no === activePlayer);

  return (
    <div className="flex h-screen flex-col bg-[#f1f5f2]">
      {/* 상단 바 */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-2.5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep(2)}
            className="text-sm text-subtle hover:text-ink"
          >
            ← 설정
          </button>
          <span className="text-lg font-extrabold tracking-tight text-brand">
            {COPY.brand}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-subtle">
            {phase === 'defense' ? '수비 국면' : '공격 시 전개'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {active ? (
            <span className="flex items-center gap-1.5 text-[12px] text-subtle">
              <span
                className="h-3.5 w-3.5 rounded-sm ring-1 ring-black/10"
                style={{ background: active.color }}
              />
              선택: <b className="text-ink">#{active.no} {active.name}</b> 색칠 중
            </span>
          ) : (
            <span className="text-[12px] text-warn">← 왼쪽에서 선수를 먼저 고르세요</span>
          )}
          <button
            onClick={() => setStep(4)}
            className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90"
          >
            리포트 보기 →
          </button>
        </div>
      </header>

      {/* 본문 3분할 */}
      <div className="flex min-h-0 flex-1 items-stretch justify-center gap-4 p-4">
        <Toolbar />
        <main className="relative flex min-w-0 flex-1 items-center justify-center">
          <PitchGrid onHoverTile={setHovered} />
        </main>
        <div className="flex min-h-0 w-[300px] shrink-0 flex-col gap-2 overflow-y-auto pr-0.5">
          <LiveFeedback />
          <SimilarityCard variant="panel" />
          <TileBottomSheet idx={hovered} />
        </div>
      </div>
    </div>
  );
}
