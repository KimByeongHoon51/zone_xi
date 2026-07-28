// lib/metrics.ts — 지표 계산 (구현 명세서 9장)
import { ZONE_KEYS } from './mapping';
import { ZONE_WEIGHTS } from '../constants/weights';
import { tileToZone, colToChannel, rowToThird } from './mapping';
import type { PhaseZones } from '../state/types';
import { CONFIG } from '../constants/config';

export interface Metrics {
  coveragePct: number; // 커버리지 %
  riskZoneCount: number; // 위험 구역 수 (노출)
  overcrowdTiles: number; // 과밀 칸 수 (노출)
  balance: number; // -1(우측)..+1(좌측)
  tilt: '균형' | '좌측 치우침' | '우측 치우침';
  leftMass: number; // 좌측 질량 (표기용)
  rightMass: number; // 우측 질량 (표기용)
  // 내부용 (노출 금지)
  riskExposure: number;
  zoneCoverRatio: Record<string, number>;
  attShare: number;
  midShare: number;
  defShare: number;
  centerShare: number;
  flankShare: number;
  // 위험 구역 목록 (리포트용): 고위험 + 공백
  riskZones: string[];
}

export function computeMetrics(
  pz: PhaseZones,
  rows: number,
  cols: number
): Metrics {
  const total = rows * cols;
  const cov = new Map<number, number>();
  for (const set of Object.values(pz))
    for (const i of set) cov.set(i, (cov.get(i) ?? 0) + 1);

  // 1) 커버리지 %
  const coveragePct = Math.round((cov.size / total) * 100);

  // 2) 과밀 칸 수
  let overcrowdTiles = 0;
  for (const c of cov.values()) if (c >= CONFIG.OVERCROWD) overcrowdTiles++;

  // 구역별 커버 비율
  const zTotal: Record<string, number> = {},
    zCov: Record<string, number> = {};
  for (let i = 0; i < total; i++) {
    const z = tileToZone(i, rows, cols);
    zTotal[z] = (zTotal[z] ?? 0) + 1;
    if ((cov.get(i) ?? 0) >= 1) zCov[z] = (zCov[z] ?? 0) + 1;
  }
  const zoneCoverRatio: Record<string, number> = {};
  for (const z of ZONE_KEYS) zoneCoverRatio[z] = (zCov[z] ?? 0) / zTotal[z];

  // 3) 위험 구역 수: 가중치 높고(≥0.30) 공백(<0.34)인 구역
  const riskZones = ZONE_KEYS.filter(
    (z) =>
      ZONE_WEIGHTS[z] >= CONFIG.HIGH_RISK_WEIGHT &&
      zoneCoverRatio[z] < CONFIG.UNDERCOVER
  );
  const riskZoneCount = riskZones.length;

  // 내부 위험 노출 = Σ 가중치 × (1 − 커버비율)
  const riskExposure = ZONE_KEYS.reduce(
    (s, z) => s + ZONE_WEIGHTS[z] * (1 - zoneCoverRatio[z]),
    0
  );

  // 4) 좌우 균형 (col 중앙 제외)
  const mid = (cols - 1) / 2;
  let left = 0,
    right = 0,
    attMass = 0,
    midMass = 0,
    defMass = 0,
    cMass = 0,
    flankMass = 0,
    tot = 0;
  for (const [i, c] of cov) {
    const col = i % cols,
      row = Math.floor(i / cols);
    tot += c;
    if (col < mid) left += c;
    else if (col > mid) right += c;
    const t = rowToThird(row, rows);
    if (t === 'att') attMass += c;
    else if (t === 'mid') midMass += c;
    else defMass += c;
    const ch = colToChannel(col, cols);
    if (ch === 'C') cMass += c;
    if (ch === 'L' || ch === 'R') flankMass += c;
  }
  const balance = (left - right) / (left + right || 1);
  const tilt =
    Math.abs(balance) < CONFIG.BALANCE_TOL
      ? '균형'
      : balance > 0
        ? '좌측 치우침'
        : '우측 치우침';

  return {
    coveragePct,
    riskZoneCount,
    overcrowdTiles,
    balance,
    tilt,
    leftMass: left,
    rightMass: right,
    riskExposure,
    zoneCoverRatio,
    attShare: attMass / (tot || 1),
    midShare: midMass / (tot || 1),
    defShare: defMass / (tot || 1),
    centerShare: cMass / (tot || 1),
    flankShare: flankMass / (tot || 1),
    riskZones,
  };
}

// 선수별 좌/우/중 편중
export function playerSide(
  no: number,
  pz: PhaseZones,
  cols: number
): 'L' | 'R' | 'C' | 'none' {
  const set = pz[no];
  if (!set || set.size === 0) return 'none';
  const mid = (cols - 1) / 2;
  let sum = 0;
  for (const i of set) sum += i % cols;
  const avg = sum / set.size;
  return avg < mid - 0.25 ? 'L' : avg > mid + 0.25 ? 'R' : 'C';
}

// 과밀 칸 목록 (제안 생성용)
export function overcrowdTileList(pz: PhaseZones): number[] {
  const cov = new Map<number, number>();
  for (const set of Object.values(pz))
    for (const i of set) cov.set(i, (cov.get(i) ?? 0) + 1);
  const out: number[] = [];
  for (const [i, c] of cov) if (c >= CONFIG.OVERCROWD) out.push(i);
  return out;
}
