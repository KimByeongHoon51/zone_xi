// lib/budget.ts — 【A】 페인트 예산 헬퍼 (구현 명세서 v1.1 §13)
// 예산은 상태에 저장하지 않고 zones[phase][no].size 에서 파생한다.
import { CONFIG } from '../constants/config';
import { GK_NO } from '../constants/formations';
import type { PhaseZones } from '../state/types';

// 선수당 예산 B
export const budgetOf = (rows: number, cols: number) =>
  CONFIG.tileBudget(rows, cols);

// 특정 선수의 남은 예산
export const remaining = (
  no: number,
  pz: PhaseZones,
  rows: number,
  cols: number
) => budgetOf(rows, cols) - (pz[no]?.size ?? 0);

// 팀(필드 플레이어) 총 사용량 — GK 제외
export const teamFilled = (pz: PhaseZones) =>
  Object.entries(pz).reduce(
    (s, [no, set]) => (Number(no) === GK_NO ? s : s + set.size),
    0
  );

// 팀 총 예산 = B × 10
export const teamBudget = (rows: number, cols: number) =>
  budgetOf(rows, cols) * CONFIG.OUTFIELD;

// 팀 예산 사용 비율 (0..1) — 유사도 게이팅용
export const fillRatio = (pz: PhaseZones, rows: number, cols: number) =>
  teamFilled(pz) / teamBudget(rows, cols);
