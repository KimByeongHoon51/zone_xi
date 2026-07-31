// constants/config.ts — 튜닝 상수 (구현 명세서 v1.1 §8)
export const CONFIG = {
  // ── 지표 임계값 ──
  OVERCROWD: 3, // 과밀 판정: 한 타일을 덮은 선수 수 ≥ 3
  OVERCROWD_LOW: 2, // '낮은 과밀' 기준 (성향 태그용): 과밀 타일 ≤ 2
  HIGH_RISK_WEIGHT: 0.3, // 위험 구역 후보: 가중치 ≥ 0.30
  UNDERCOVER: 0.34, // 구역 커버리지 비율 < 0.34 이면 '공백'으로 간주
  BALANCE_TOL: 0.12, // |좌우 균형| < 0.12 → 균형
  CENTER_HIGH: 0.45, // 중앙 집중 판정
  FLANK_MIN: 0.15, // 측면(L+R) 질량 < 0.15 → 측면 공백
  DEF_SHARE_HIGH: 0.4, // 수비 서드 집중 판정
  ATT_SHARE_HIGH: 0.4, // 공격 서드 집중 판정

  // ── A. 페인트 예산 ──
  OUTFIELD: 10, // 필드 플레이어(GK 제외)
  // 전체 타일 ÷ 10, 강제 공백 보장. 14×7 → 9칸/선수. 10명×9=90 < 98 → 최소 8칸 필연 공백.
  tileBudget: (rows: number, cols: number) => {
    const b = Math.floor((rows * cols) / 10);
    // 나머지가 0인 해상도(예: 10×5=50)는 공백이 안 생기므로 1 감산
    return (rows * cols) % 10 === 0 ? b - 1 : b;
  },

  // ── B. 형태 유사도 ──
  SIM_MIN_FILL: 0.5, // 팀 예산의 50% 이상 칠해야 유사도 표시(콜드 스타트)
  SIM_TIE: 5, // 상위 2팀 유사도 차 ≤ 5%p 이면 둘 다 노출
};
