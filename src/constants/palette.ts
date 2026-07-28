// constants/palette.ts — 색상 팔레트 (구현 명세서 5장)
import type { Position } from '../state/types';

// 포지션 계열색 + 선수별 명도 변주 (밝음→어두움). 등번호 병기.
export const PALETTE = {
  FW: ['#F87171', '#EF4444', '#DC2626'], // 공격수 3명 (빨강)
  MF: ['#4ADE80', '#22C55E', '#16A34A'], // 미드필더 3명 (초록)
  DF: ['#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8'], // 수비수 4명 (파랑)
  GK: '#FACC15', // 골키퍼 (노랑, 고정·잠금)
} as const;

// 선수별 색 배정: 같은 포지션 선수를 순서대로 배열에서 뽑아 준다.
export function assignColor(position: Position, indexInPosition: number): string {
  if (position === 'GK') return PALETTE.GK;
  const list = PALETTE[position];
  return list[indexInPosition % list.length];
}

// 등번호 텍스트 대비: 밝은 타일엔 진한 글자
export const NUMBER_INK = { light: '#0f172a', dark: '#ffffff' };
// 밝은 색(대비 낮음) 목록 → 진한 글자 사용
export const LIGHT_FILLS = new Set(['#F87171', '#4ADE80', '#60A5FA', '#FACC15']);

export function inkFor(fill: string): string {
  return LIGHT_FILLS.has(fill) ? NUMBER_INK.light : NUMBER_INK.dark;
}

// UI / 판 토큰
export const TOKENS = {
  pitchUnpainted: '#E9EEEA', // 미색칠 타일 (빈 잔디)
  tileGrout: '#0b1220', // 타일 경계선
  markings: '#64748B', // 페널티박스/센터서클/골 (미색칠 위)
  markingsOnPaint: '#FFFFFF', // 색칠 위 마킹
  textPrimary: '#1F2933',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  brand: '#14532D', // 강조(제목/태그)
  warn: '#DC2626', // 공백 경고
  overcrowd: '#B45309', // 과밀 강조
};

// 밀집도 뷰 히트맵 (coverage count → 색)
export const DENSITY_SCALE: Record<0 | 1 | 2 | 3, string> = {
  0: '#FCA5A5', // 공백 (붉은 경고)
  1: '#BBF7D0', // 적정
  2: '#4ADE80', // 두꺼움
  3: '#F59E0B', // 과밀 (3명 이상)
};
export const densityColor = (c: number) =>
  DENSITY_SCALE[Math.min(c, 3) as 0 | 1 | 2 | 3];
