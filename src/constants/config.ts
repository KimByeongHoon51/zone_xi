// constants/config.ts — 튜닝 상수 (구현 명세서 8장)
export const CONFIG = {
  OVERCROWD: 3, // 과밀 판정: 한 타일을 덮은 선수 수 ≥ 3
  OVERCROWD_LOW: 2, // '낮은 과밀' 기준 (성향 태그용): 과밀 타일 ≤ 2
  HIGH_RISK_WEIGHT: 0.3, // 위험 구역 후보: 가중치 ≥ 0.30
  UNDERCOVER: 0.34, // 구역 커버리지 비율 < 0.34 이면 '공백'으로 간주
  BALANCE_TOL: 0.12, // |좌우 균형| < 0.12 → 균형
  CENTER_HIGH: 0.45, // 중앙 집중 판정
  FLANK_MIN: 0.15, // 측면(L+R) 질량 < 0.15 → 측면 공백
  DEF_SHARE_HIGH: 0.4, // 수비 서드 집중 판정
  ATT_SHARE_HIGH: 0.4, // 공격 서드 집중 판정
};
