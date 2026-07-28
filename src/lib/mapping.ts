// lib/mapping.ts — 타일 → 15구역 매핑 (구현 명세서 6장)
import type { PhaseZones } from '../state/types';

export type Channel = 'L' | 'LI' | 'C' | 'RI' | 'R';
export type Third = 'att' | 'mid' | 'def';
export type ZoneKey = `${Third}_${Channel}`;

export const CHANNELS: Channel[] = ['L', 'LI', 'C', 'RI', 'R'];
export const THIRDS: Third[] = ['att', 'mid', 'def'];
export const ZONE_KEYS: ZoneKey[] = THIRDS.flatMap((t) =>
  CHANNELS.map((c) => `${t}_${c}` as ZoneKey)
);

// 열 → 채널 (대칭, 중앙이 가장 넓음)
export function colToChannel(col: number, cols: number): Channel {
  const p = (col + 0.5) / cols; // 0..1
  if (p < 0.2) return 'L';
  if (p < 0.35) return 'LI';
  if (p < 0.65) return 'C';
  if (p < 0.8) return 'RI';
  return 'R';
}

// 행 → 서드 (row 0 = 공격, row max = 수비)
export function rowToThird(row: number, rows: number): Third {
  const p = (row + 0.5) / rows;
  if (p < 1 / 3) return 'att';
  if (p < 2 / 3) return 'mid';
  return 'def';
}

export function tileToZone(idx: number, rows: number, cols: number): ZoneKey {
  const row = Math.floor(idx / cols),
    col = idx % cols;
  return `${rowToThird(row, rows)}_${colToChannel(col, cols)}` as ZoneKey;
}

// 커버리지 맵: tileIdx → 덮은 선수 수
export function buildCoverage(pz: PhaseZones): Map<number, number> {
  const cov = new Map<number, number>();
  for (const set of Object.values(pz))
    for (const idx of set) cov.set(idx, (cov.get(idx) ?? 0) + 1);
  return cov; // 덮인 타일만 존재. cov.size = 덮인 타일 수
}
