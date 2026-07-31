// lib/similarity.ts — 【B】 형태 유사도 (프로파일 → 15구역 벡터 → 코사인, §17)
import { ZONE_KEYS } from './mapping';
import { REF_TEAMS, type RefTeam } from '../constants/refTeams';
import { CONFIG } from '../constants/config';

// inward(중앙 지향) → 채널 분배 (좌우 대칭, L·LI·RI·R 균등)
function channelShare(inward: number): Record<string, number> {
  const flank = (1 - inward) / 4;
  return { C: inward, LI: flank, RI: flank, L: flank, R: flank };
}

// profile → 15구역 벡터: vec[third_channel] = thirds[third] × channelShare[channel]
export function profileToVec(p: RefTeam['profile']): number[] {
  const cs = channelShare(p.inward);
  return ZONE_KEYS.map((z) => {
    const [t, c] = z.split('_');
    return (p.thirds as Record<string, number>)[t] * cs[c];
  });
}

export function cosine(a: number[], b: number[]): number {
  let d = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    d += a[i] * b[i];
    na += a[i] ** 2;
    nb += b[i] ** 2;
  }
  return na && nb ? d / Math.sqrt(na * nb) : 0;
}

export interface RankedTeam extends RefTeam {
  sim: number; // 0..100
}

// coverMass(§9) → userVec. 코사인은 스케일 불변이라 정규화 불필요.
export function rankSimilarity(coverMass: Record<string, number>): RankedTeam[] {
  const userVec = ZONE_KEYS.map((z) => coverMass[z] ?? 0);
  return REF_TEAMS.map((t) => ({
    ...t,
    sim: Math.round(cosine(userVec, profileToVec(t.profile)) * 100),
  })).sort((a, b) => b.sim - a.sim);
}

export interface SimilarityView {
  show: boolean;
  note?: string;
  near?: RankedTeam[];
}

// 노출 헬퍼: 게이팅(수비 국면 + 예산 50%↑) + 동률 처리
export function similarityView(
  phase: 'defense' | 'attack',
  coverMass: Record<string, number>,
  fillRatio: number
): SimilarityView {
  if (phase !== 'defense')
    return { show: false, note: '수비 국면에서 형태가 비교됩니다.' };
  if (fillRatio < CONFIG.SIM_MIN_FILL)
    return { show: false, note: '배치를 더 채우면 형태가 비교됩니다.' };
  const r = rankSimilarity(coverMass);
  const top = r[0],
    second = r[1];
  const near =
    second && top.sim - second.sim <= CONFIG.SIM_TIE ? [top, second] : [top];
  return { show: true, near };
}
