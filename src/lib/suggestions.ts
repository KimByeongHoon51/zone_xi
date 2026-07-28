// lib/suggestions.ts — 제안 문구 생성 (규칙 기반, 구현 명세서 16장)
// 원칙: 정답이 아니라 '잉여(과밀) ↔ 결핍(공백)'을 연결한다. 명령형·예측 금지.
import type { Metrics } from './metrics';
import { ZONE_NAMES } from '../constants/zones';
import { ZONE_WEIGHTS } from '../constants/weights';
import { tileToZone } from './mapping';
import type { PhaseZones } from '../state/types';
import { overcrowdTileList } from './metrics';

export interface Finding {
  text: string;
}

// 발견: 가장 위험한 공백 + 최대 과밀
export function buildFindings(
  m: Metrics,
  overcrowdTiles: number
): Finding[] {
  const out: Finding[] = [];

  // 가장 위험한 공백 구역
  if (m.riskZones.length > 0) {
    const worst = [...m.riskZones].sort(
      (a, b) => ZONE_WEIGHTS[b as keyof typeof ZONE_WEIGHTS] - ZONE_WEIGHTS[a as keyof typeof ZONE_WEIGHTS]
    )[0];
    out.push({
      text: `가장 위험도가 높은 공백은 「${ZONE_NAMES[worst]}」 구역입니다. 이 구역이 비면 상대 슈팅이 집중되는 자리입니다.`,
    });
  } else {
    out.push({
      text: '고위험 구역 중 공백으로 남은 곳이 없습니다. 위험 구역 커버는 확보돼 있습니다.',
    });
  }

  // 과밀
  if (overcrowdTiles > 0) {
    out.push({
      text: `${overcrowdTiles}칸이 3명 이상 겹쳐 있습니다. 겹친 칸은 다른 곳에 쓸 수 있는 여유입니다.`,
    });
  } else {
    out.push({
      text: '3명 이상 겹친 과밀 칸은 없습니다. 커버가 넓게 분산돼 있습니다.',
    });
  }

  // 편중 서술
  if (m.tilt !== '균형') {
    out.push({
      text: `질량이 ${m.tilt} 상태입니다 (좌측 ${m.leftMass} · 우측 ${m.rightMass}).`,
    });
  }

  return out;
}

// 제안: 과밀 + 공백 동시 → 잉여를 결핍으로 연결
export function buildSuggestions(
  m: Metrics,
  pz: PhaseZones,
  rows: number,
  cols: number
): Finding[] {
  const out: Finding[] = [];
  const crowded = overcrowdTileList(pz);

  if (crowded.length > 0 && m.riskZones.length > 0) {
    // 과밀 칸이 속한 구역 (첫 과밀 칸 기준)
    const crowdZone = tileToZone(crowded[0], rows, cols);
    const worst = [...m.riskZones].sort(
      (a, b) => ZONE_WEIGHTS[b as keyof typeof ZONE_WEIGHTS] - ZONE_WEIGHTS[a as keyof typeof ZONE_WEIGHTS]
    )[0];
    out.push({
      text: `「${ZONE_NAMES[crowdZone]}」에 겹친 인원 중 1명을 「${ZONE_NAMES[worst]}」 쪽으로 옮기면 과밀과 공백이 함께 줄어듭니다.`,
    });
    out.push({
      text: `대가: ${ZONE_NAMES[crowdZone]}의 밀도가 낮아집니다. 그 구역을 얼마나 두껍게 둘지는 선택입니다.`,
    });
  } else if (m.riskZones.length > 0) {
    out.push({
      text: `여유(과밀) 칸이 없어 옮길 인원이 마땅치 않습니다. 위험 공백을 메우려면 다른 구역의 커버를 얇게 하는 맞교환이 필요합니다.`,
    });
  } else if (crowded.length > 0) {
    out.push({
      text: `위험 공백은 없지만 ${crowded.length}칸이 과밀합니다. 이 여유를 넓게 펴면 커버리지를 더 올릴 수 있습니다.`,
    });
  } else {
    out.push({
      text: '위험 공백도 과밀도 두드러지지 않습니다. 현재 배치는 공간 배분의 일관성이 안정적입니다.',
    });
  }

  return out;
}
