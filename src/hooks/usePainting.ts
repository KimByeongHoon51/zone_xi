// hooks/usePainting.ts — 드래그/사각/지우개 포인터 로직 (구현 명세서 12장)
import { useCallbackRef } from './useCallbackRef';
import { useRef, useState, useCallback } from 'react';
import { useStore } from '../state/store';

interface PaintingApi {
  containerRef: (el: HTMLDivElement | null) => void;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerLeave: () => void;
  hoveredIdx: number | null;
  rectPreview: Set<number> | null;
}

export function usePainting(
  rows: number,
  cols: number,
  onHover?: (idx: number | null) => void
): PaintingApi {
  const elRef = useRef<HTMLDivElement | null>(null);
  const painting = useRef(false);
  const rectMode = useRef(false);
  const startIdx = useRef<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [rectPreview, setRectPreview] = useState<Set<number> | null>(null);
  const onHoverRef = useCallbackRef(onHover);

  const containerRef = useCallback((el: HTMLDivElement | null) => {
    elRef.current = el;
  }, []);

  const idxFromEvent = useCallback(
    (e: React.PointerEvent): number | null => {
      const el = elRef.current;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return null;
      const col = Math.min(cols - 1, Math.max(0, Math.floor((x / r.width) * cols)));
      const row = Math.min(rows - 1, Math.max(0, Math.floor((y / r.height) * rows)));
      return row * cols + col;
    },
    [rows, cols]
  );

  const rectRange = useCallback(
    (a: number, b: number): number[] => {
      const ar = Math.floor(a / cols),
        ac = a % cols;
      const br = Math.floor(b / cols),
        bc = b % cols;
      const r0 = Math.min(ar, br),
        r1 = Math.max(ar, br);
      const c0 = Math.min(ac, bc),
        c1 = Math.max(ac, bc);
      const out: number[] = [];
      for (let r = r0; r <= r1; r++)
        for (let c = c0; c <= c1; c++) out.push(r * cols + c);
      return out;
    },
    [cols]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const idx = idxFromEvent(e);
      if (idx == null) return;
      const { tool, activePlayer, beginStroke, paintTile } = useStore.getState();
      if (activePlayer == null) return;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      beginStroke();
      painting.current = true;
      startIdx.current = idx;
      rectMode.current = tool === 'rect' || e.shiftKey;
      if (rectMode.current) {
        setRectPreview(new Set([idx]));
      } else {
        paintTile(idx);
      }
    },
    [idxFromEvent]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const idx = idxFromEvent(e);
      if (idx !== hoveredIdx) {
        setHoveredIdx(idx);
        onHoverRef.current?.(idx);
      }
      if (!painting.current || idx == null) return;
      if (rectMode.current && startIdx.current != null) {
        setRectPreview(new Set(rectRange(startIdx.current, idx)));
      } else {
        useStore.getState().paintTile(idx);
      }
    },
    [idxFromEvent, hoveredIdx, rectRange, onHoverRef]
  );

  const finish = useCallback(
    (e: React.PointerEvent) => {
      if (!painting.current) return;
      const idx = idxFromEvent(e);
      if (rectMode.current && startIdx.current != null && idx != null) {
        useStore.getState().paintTiles(rectRange(startIdx.current, idx));
      }
      painting.current = false;
      rectMode.current = false;
      startIdx.current = null;
      setRectPreview(null);
    },
    [idxFromEvent, rectRange]
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => finish(e), [finish]);

  const onPointerLeave = useCallback(() => {
    setHoveredIdx(null);
    onHoverRef.current?.(null);
  }, [onHoverRef]);

  return {
    containerRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave,
    hoveredIdx,
    rectPreview,
  };
}
