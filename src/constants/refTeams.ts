// constants/refTeams.ts — 【B】 실제 팀 수비 커버 프로파일 근사 (구현 명세서 v1.1 §17)
// ⚠ profile은 '측정한 커버 분포'가 아니라 리포트의 수비 압박 위치·라인 높이·블록 비중에서
//    근사한 수비 커버 프로파일이다. basis:'summary'는 요약 근거 → 카드에 '요약 근사' 뱃지 필수.

export interface RefTeam {
  key: string;
  name: string;
  tag: string;
  basis: 'report' | 'summary';
  profile: {
    thirds: { att: number; mid: number; def: number };
    inward: number; // 중앙 지향 비율 0..1
  };
}

export const REF_TEAMS: RefTeam[] = [
  {
    key: 'ESP',
    name: '스페인',
    tag: '견고한 블록',
    basis: 'summary',
    profile: { thirds: { att: 0.3, mid: 0.35, def: 0.35 }, inward: 0.55 },
  },
  {
    key: 'ARG',
    name: '아르헨티나',
    tag: '중앙 봉쇄',
    basis: 'summary',
    profile: { thirds: { att: 0.25, mid: 0.3, def: 0.45 }, inward: 0.78 },
  },
  {
    key: 'FRA',
    name: '프랑스',
    tag: '하이 리스크',
    basis: 'report',
    profile: { thirds: { att: 0.34, mid: 0.43, def: 0.23 }, inward: 0.25 },
  },
  {
    key: 'ENG',
    name: '잉글랜드',
    tag: '조밀·딥',
    basis: 'report',
    profile: { thirds: { att: 0.12, mid: 0.3, def: 0.58 }, inward: 0.24 },
  },
];
