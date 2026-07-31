// constants/formations.ts — 포메이션 프리셋 (건너뛰기용, 구현 명세서 2·17장)
import type { Player, Position, PhaseZones } from '../state/types';
import { assignColor } from './palette';
import { CONFIG } from './config';

// 선수 정의: 등번호·포지션·이름·기본 활동 영역(비율 박스, 해상도 무관)
interface Seed {
  no: number;
  position: Position;
  name: string;
  // 활동 영역 비율 박스 [rowFrac0, rowFrac1] × [colFrac0, colFrac1]
  // rowFrac 0 = 상단(공격), 1 = 하단(자기 골문)
  box: [number, number, number, number];
}

const GK_SEED: Seed = {
  no: 1,
  position: 'GK',
  name: 'GK',
  box: [0.9, 1.0, 0.3, 0.7],
};

// 4-3-3 — 균형형 (백라인을 살짝 올려 서드가 고르게 분포)
const F_433: Seed[] = [
  { no: 11, position: 'FW', name: 'LW', box: [0.0, 0.42, 0.0, 0.35] },
  { no: 9, position: 'FW', name: 'ST', box: [0.0, 0.4, 0.28, 0.72] },
  { no: 7, position: 'FW', name: 'RW', box: [0.0, 0.42, 0.65, 1.0] },
  { no: 8, position: 'MF', name: 'LCM', box: [0.3, 0.66, 0.12, 0.5] },
  { no: 6, position: 'MF', name: 'CM', box: [0.32, 0.68, 0.3, 0.7] },
  { no: 10, position: 'MF', name: 'RCM', box: [0.3, 0.66, 0.5, 0.88] },
  { no: 3, position: 'DF', name: 'LB', box: [0.5, 0.9, 0.0, 0.32] },
  { no: 4, position: 'DF', name: 'LCB', box: [0.56, 0.92, 0.2, 0.55] },
  { no: 5, position: 'DF', name: 'RCB', box: [0.56, 0.92, 0.45, 0.8] },
  { no: 2, position: 'DF', name: 'RB', box: [0.5, 0.9, 0.68, 1.0] },
  GK_SEED,
];

// 4-4-2 — 견고한 블록 (수비 서드에 질량 집중 + 중앙 미드 분리로 과밀 낮게)
const F_442: Seed[] = [
  { no: 9, position: 'FW', name: 'ST', box: [0.0, 0.4, 0.16, 0.55] },
  { no: 10, position: 'FW', name: 'ST', box: [0.0, 0.4, 0.45, 0.84] },
  { no: 7, position: 'MF', name: 'RM', box: [0.34, 0.72, 0.64, 1.0] },
  { no: 11, position: 'MF', name: 'LM', box: [0.34, 0.72, 0.0, 0.36] },
  { no: 8, position: 'MF', name: 'CM', box: [0.28, 0.58, 0.22, 0.58] },
  { no: 6, position: 'FW', name: 'DM', box: [0.52, 0.84, 0.42, 0.78] },
  { no: 3, position: 'DF', name: 'LB', box: [0.6, 1.0, 0.0, 0.32] },
  { no: 4, position: 'DF', name: 'LCB', box: [0.68, 1.0, 0.2, 0.55] },
  { no: 5, position: 'DF', name: 'RCB', box: [0.68, 1.0, 0.45, 0.8] },
  { no: 2, position: 'DF', name: 'RB', box: [0.6, 1.0, 0.68, 1.0] },
  GK_SEED,
];

// 3-5-2 — 중앙 봉쇄 (중원·중앙에 질량 집중, 측면 질량 얕음)
const F_352: Seed[] = [
  { no: 9, position: 'FW', name: 'ST', box: [0.0, 0.4, 0.2, 0.58] },
  { no: 10, position: 'FW', name: 'ST', box: [0.0, 0.4, 0.42, 0.8] },
  { no: 7, position: 'MF', name: 'RWB', box: [0.36, 0.82, 0.6, 0.94] },
  { no: 3, position: 'MF', name: 'LWB', box: [0.36, 0.82, 0.06, 0.4] },
  { no: 8, position: 'MF', name: 'LCM', box: [0.32, 0.62, 0.16, 0.5] },
  { no: 6, position: 'MF', name: 'DM', box: [0.5, 0.82, 0.32, 0.68] },
  { no: 11, position: 'FW', name: 'RCM', box: [0.32, 0.62, 0.5, 0.84] },
  { no: 4, position: 'DF', name: 'LCB', box: [0.66, 1.0, 0.12, 0.46] },
  { no: 5, position: 'DF', name: 'CB', box: [0.68, 1.0, 0.33, 0.67] },
  { no: 2, position: 'DF', name: 'RCB', box: [0.66, 1.0, 0.54, 0.88] },
  GK_SEED,
];

const PRESETS = {
  '4-3-3': F_433,
  '4-4-2': F_442,
  '3-5-2': F_352,
} as const;

export const FORMATIONS = ['4-3-3', '4-4-2', '3-5-2'] as const;
export type FormationName = (typeof FORMATIONS)[number];
export const GK_NO = 1;

// 비율 박스 → 타일 집합
function boxToSet(
  box: [number, number, number, number],
  rows: number,
  cols: number
): Set<number> {
  const [r0, r1, c0, c1] = box;
  const set = new Set<number>();
  for (let row = 0; row < rows; row++) {
    const rf = (row + 0.5) / rows;
    if (rf < r0 || rf > r1) continue;
    for (let col = 0; col < cols; col++) {
      const cf = (col + 0.5) / cols;
      if (cf < c0 || cf > c1) continue;
      set.add(row * cols + col);
    }
  }
  return set;
}

// 포지션별 등장 순서에 따라 팔레트 명도 색 배정
export function buildPlayers(formation: FormationName = '4-3-3'): Player[] {
  const counter: Record<Position, number> = { FW: 0, MF: 0, DF: 0, GK: 0 };
  return PRESETS[formation].map((s) => {
    const idx = counter[s.position]++;
    return {
      no: s.no,
      position: s.position,
      name: s.name,
      color: assignColor(s.position, idx),
    };
  });
}

// 박스 시드를 예산(B) 이하로 캡: 박스 중심에 가장 가까운 B칸만 남긴다.
// 강제 공백(§13) 원칙상 기본 배치의 각 선수 칸 수는 반드시 B 이하여야 한다.
function capToBudget(
  set: Set<number>,
  box: [number, number, number, number],
  rows: number,
  cols: number,
  budget: number
): Set<number> {
  if (set.size <= budget) return set;
  const [r0, r1, c0, c1] = box;
  const cr = ((r0 + r1) / 2) * rows; // 박스 중심 (타일 좌표계)
  const cc = ((c0 + c1) / 2) * cols;
  const scored = [...set].map((idx) => {
    const row = Math.floor(idx / cols) + 0.5;
    const col = (idx % cols) + 0.5;
    return { idx, d: (row - cr) ** 2 + (col - cc) ** 2 };
  });
  scored.sort((a, b) => a.d - b.d);
  return new Set(scored.slice(0, budget).map((s) => s.idx));
}

// 포메이션 기본 수비 배치 시드 (각 필드 플레이어 ≤ 예산)
export function buildDefaultZones(
  rows: number,
  cols: number,
  formation: FormationName = '4-3-3'
): PhaseZones {
  const pz: PhaseZones = {};
  const B = CONFIG.tileBudget(rows, cols);
  for (const s of PRESETS[formation]) {
    const raw = boxToSet(s.box, rows, cols);
    // GK는 예산 대상 아님(잠금·소형). 필드 플레이어만 캡.
    pz[s.no] = s.position === 'GK' ? raw : capToBudget(raw, s.box, rows, cols, B);
  }
  return pz;
}

// GK 전용 고정 타일 (자기 골문 앞 중앙)
export function buildGkZone(rows: number, cols: number): Set<number> {
  return boxToSet(GK_SEED.box, rows, cols);
}
