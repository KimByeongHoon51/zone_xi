// lib/tendency.ts — 성향 태그 규칙 (구현 명세서 10장)
import type { Metrics } from './metrics';
import { CONFIG } from '../constants/config';

export type Tendency =
  | '견고한 블록'
  | '하이 리스크'
  | '중앙 봉쇄'
  | '균형형'
  | '표준형';

export interface TendencyResult {
  tag: Tendency;
  ref: string; // 실측 팀 대응 사례
  desc: string; // 한 줄 설명 (규칙 기반, 예측 아님)
}

export function tendencyTag(m: Metrics, overcrowdTiles: number): TendencyResult {
  const backGap = m.zoneCoverRatio['def_C'] < CONFIG.UNDERCOVER; // 후방 중앙 공백
  const flankGap = m.flankShare < CONFIG.FLANK_MIN; // 측면 공백

  if (
    m.defShare >= CONFIG.DEF_SHARE_HIGH &&
    overcrowdTiles <= CONFIG.OVERCROWD_LOW
  )
    return {
      tag: '견고한 블록',
      ref: '실측 대응: 스페인형',
      desc: '수비 서드에 질량을 몰되 과밀은 낮게 유지한 배치입니다.',
    };
  if (m.attShare >= CONFIG.ATT_SHARE_HIGH && backGap)
    return {
      tag: '하이 리스크',
      ref: '실측 대응: 프랑스형',
      desc: '전방에 질량을 실었고 후방 중앙에 공백이 남아 있습니다.',
    };
  if (m.centerShare >= CONFIG.CENTER_HIGH && flankGap)
    return {
      tag: '중앙 봉쇄',
      ref: '실측 대응: 아르헨티나형',
      desc: '중앙에 질량을 집중했고 측면 질량이 얕습니다.',
    };
  if (Math.abs(m.balance) < CONFIG.BALANCE_TOL && !flankGap)
    return {
      tag: '균형형',
      ref: '좌우·측면이 고르게 분포',
      desc: '좌우 균형이 잡혀 있고 측면 질량도 확보돼 있습니다.',
    };
  return {
    tag: '표준형',
    ref: '뚜렷한 편향 없음',
    desc: '특정 성향으로 분류되지 않는 표준적인 분포입니다.',
  };
}
