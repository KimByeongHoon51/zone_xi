// components/pitch/PitchGrid.tsx — 타일 그리드 + 그라우트 (구현 명세서 3·13·17장)
import { useMemo } from 'react';
import { useStore } from '../../state/store';
import { TOKENS, densityColor, inkFor } from '../../constants/palette';
import { PitchMarkings } from './PitchMarkings';
import { usePainting } from '../../hooks/usePainting';

interface Props {
  onHoverTile?: (idx: number | null) => void;
  interactive?: boolean; // false면 리포트 스냅샷용(정적)
  forceView?: 'edit' | 'density'; // 스냅샷에서 뷰 강제
  height?: string; // 판 높이 (기본 편집판, 스냅샷에서 축소용)
}

export function PitchGrid({
  onHoverTile,
  interactive = true,
  forceView,
  height = 'min(84vh, 780px)',
}: Props) {
  const { rows, cols } = useStore((s) => s.resolution);
  const phase = useStore((s) => s.phase);
  const storeView = useStore((s) => s.view);
  const view = forceView ?? (storeView === 'team' ? 'edit' : storeView);
  const players = useStore((s) => s.players);
  const activePlayer = useStore((s) => s.activePlayer);
  const zones = useStore((s) => s.zones[phase]);

  const painting = usePainting(rows, cols, onHoverTile);

  // 색/번호/포지션 조회 맵
  const colorOf = useMemo(() => {
    const m = new Map<number, string>();
    for (const p of players) m.set(p.no, p.color);
    return m;
  }, [players]);

  // 타일별 커버 선수 목록
  const coverers = useMemo(() => {
    const arr: number[][] = Array.from({ length: rows * cols }, () => []);
    for (const p of players) {
      const set = zones[p.no];
      if (!set) continue;
      for (const idx of set) if (idx < arr.length) arr[idx].push(p.no);
    }
    return arr;
  }, [zones, players, rows, cols]);

  const total = rows * cols;
  const tiles = [];
  for (let i = 0; i < total; i++) {
    const cs = coverers[i];
    const count = cs.length;
    let bg = TOKENS.pitchUnpainted;
    let label = '';
    let ink = TOKENS.textPrimary;
    let opacity = 1;
    let ring = false;

    if (view === 'density') {
      if (count > 0) {
        bg = densityColor(count);
        label = String(count);
        ink = inkFor(bg);
      } else {
        bg = TOKENS.pitchUnpainted;
      }
    } else {
      // edit view
      if (count > 0) {
        const activeCovers = activePlayer != null && cs.includes(activePlayer);
        const primary = activeCovers ? activePlayer! : cs[0];
        bg = colorOf.get(primary) ?? TOKENS.pitchUnpainted;
        label = String(primary);
        ink = inkFor(bg);
        if (activePlayer != null && !activeCovers) opacity = 0.4;
        if (count >= 3) ring = true;
      }
    }

    const isPreview = painting.rectPreview?.has(i);
    tiles.push(
      <div
        key={i}
        data-idx={i}
        className="relative flex items-center justify-center"
        style={{
          background: bg,
          opacity,
          boxShadow: ring
            ? `inset 0 0 0 2px ${TOKENS.overcrowd}`
            : undefined,
        }}
      >
        {label && (
          <span
            className="pointer-events-none select-none font-semibold"
            style={{
              color: ink,
              fontSize: 'clamp(9px, 1.1vw, 13px)',
              opacity: view === 'density' ? 0.85 : 0.92,
            }}
          >
            {label}
          </span>
        )}
        {isPreview && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'rgba(20,83,45,0.35)' }}
          />
        )}
      </div>
    );
  }

  return (
    <div
      ref={painting.containerRef}
      className="relative touch-none no-select select-none overflow-hidden rounded-lg shadow-xl ring-1 ring-black/10"
      style={{
        aspectRatio: `${cols} / ${rows}`,
        height,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: '1.5px',
        background: TOKENS.tileGrout,
        cursor: interactive
          ? activePlayer == null
            ? 'not-allowed'
            : 'crosshair'
          : 'default',
      }}
      onPointerDown={interactive ? painting.onPointerDown : undefined}
      onPointerMove={interactive ? painting.onPointerMove : undefined}
      onPointerUp={interactive ? painting.onPointerUp : undefined}
      onPointerLeave={interactive ? painting.onPointerLeave : undefined}
    >
      {tiles}
      <PitchMarkings onPaint={false} />
    </div>
  );
}
