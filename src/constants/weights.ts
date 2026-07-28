// constants/weights.ts — 위험 가중치 상수 (구현 명세서 7장)
// 결승 + 3·4위전 2경기 실측 재확인값.
import type { ZoneKey } from '../lib/mapping';

export const ZONE_WEIGHTS: Record<ZoneKey, number> = {
  att_L: 0.17,
  att_LI: 0.36,
  att_C: 1.0,
  att_RI: 0.36,
  att_R: 0.17,
  mid_L: 0.08,
  mid_LI: 0.16,
  mid_C: 0.45,
  mid_RI: 0.16,
  mid_R: 0.08,
  def_L: 0.13,
  def_LI: 0.27,
  def_C: 0.75,
  def_RI: 0.27,
  def_R: 0.13,
};
// 가장 위험: 공격 중앙(1.00) > 수비 중앙(0.75) > 공격 인사이드(0.36). 가장 안전: 측면 중원(0.08).

export function riskGrade(w: number): string {
  if (w >= 0.7) return '최고 위험';
  if (w >= 0.3) return '높음';
  if (w >= 0.13) return '보통';
  return '낮음';
}
