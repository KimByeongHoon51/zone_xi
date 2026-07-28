// state/types.ts — 앱 전역 상태 스키마 (구현 명세서 4장)
export type Step = 1 | 2 | 3 | 4;
export type Phase = 'defense' | 'attack';
export type ViewMode = 'edit' | 'density' | 'team';
export type Tool = 'brush' | 'rect' | 'eraser';
export type Position = 'FW' | 'MF' | 'DF' | 'GK';

export interface Player {
  no: number; // 등번호 (고유 key)
  position: Position;
  color: string; // hex, palette에서 배정
  name?: string; // 몰입용, 계산엔 미사용
}

// 국면별: 등번호 → 칠한 타일 집합
export type PhaseZones = Record<number, Set<number>>;

export interface HistoryEntry {
  phase: Phase;
  playerNo: number;
  before: number[]; // 직렬화된 Set (undo용)
}

export interface AppState {
  step: Step;
  resolution: { rows: number; cols: number }; // MVP { rows:14, cols:7 }
  phase: Phase;
  view: ViewMode;
  tool: Tool;
  activePlayer: number | null; // 현재 색칠 대상 등번호
  players: Player[]; // GK 포함 11명
  zones: { defense: PhaseZones; attack: PhaseZones };
  history: HistoryEntry[];
  attackInitialized: boolean; // 공격 국면을 수비에서 복사했는지
}
