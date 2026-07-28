// hooks/useMetrics.ts — 현재 국면 파생 메트릭 (zones 변화 시 재계산)
import { useMemo } from 'react';
import { useStore } from '../state/store';
import { computeMetrics } from '../lib/metrics';

export function useMetrics() {
  const { rows, cols } = useStore((s) => s.resolution);
  const phase = useStore((s) => s.phase);
  const zones = useStore((s) => s.zones[phase]);
  return useMemo(
    () => computeMetrics(zones, rows, cols),
    [zones, rows, cols]
  );
}
