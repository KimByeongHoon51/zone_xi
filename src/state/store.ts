// state/store.ts — Zustand 전역 스토어 (구현 명세서 4·12·14장)
import { create } from 'zustand';
import type {
  AppState,
  Phase,
  Step,
  Tool,
  ViewMode,
} from './types';
import {
  buildPlayers,
  buildDefaultZones,
  buildGkZone,
  GK_NO,
  type FormationName,
} from '../constants/formations';
import { CONFIG } from '../constants/config';

const ROWS = 14;
const COLS = 7;

interface Actions {
  setStep: (s: Step) => void;
  setPhase: (p: Phase) => void;
  setView: (v: ViewMode) => void;
  setTool: (t: Tool) => void;
  setActivePlayer: (no: number | null) => void;
  setFormation: (f: FormationName) => void;
  seed: (f: FormationName) => void; // 프리셋 시드 후 보드로 이동 준비
  goBoard: (f: FormationName) => void; // 설정 → 보드
  beginStroke: () => void; // 스트로크 시작 시 history push
  paintTile: (idx: number) => void; // 활성 선수 타일 추가/제거
  paintTiles: (idxs: number[]) => void; // 사각 영역 일괄
  undo: () => void;
  resetPhase: () => void; // 현재 국면 전체 지우기(GK 제외)
  reseedPhase: () => void; // 현재 국면 기본 배치로 복원
  initAttackFromDefense: () => void;
  formation: FormationName;
}

type Store = AppState & Actions;

function emptyZones(): AppState['zones'] {
  return { defense: {}, attack: {} };
}

export const useStore = create<Store>((set, get) => ({
  // ── 초기 상태 ──
  step: 1,
  resolution: { rows: ROWS, cols: COLS },
  phase: 'defense',
  view: 'edit',
  tool: 'brush',
  activePlayer: null,
  players: buildPlayers('4-3-3'),
  zones: emptyZones(),
  history: [],
  attackInitialized: false,
  formation: '4-3-3',

  // ── 네비게이션 ──
  setStep: (s) => set({ step: s }),
  setPhase: (p) => {
    // 공격 국면을 처음 열면 수비 배치를 복사(초기값)
    if (p === 'attack' && !get().attackInitialized) get().initAttackFromDefense();
    set({ phase: p, activePlayer: null });
  },
  setView: (v) => set({ view: v }),
  setTool: (t) => set({ tool: t }),
  setActivePlayer: (no) => {
    if (no === GK_NO) return; // GK 잠금
    set({ activePlayer: no });
  },
  setFormation: (f) => set({ formation: f }),

  // ── 시드 & 진입 ──
  seed: (f) => {
    const { rows, cols } = get().resolution;
    set({
      players: buildPlayers(f),
      zones: { defense: buildDefaultZones(rows, cols, f), attack: {} },
      formation: f,
      attackInitialized: false,
      history: [],
      activePlayer: null,
      phase: 'defense',
      view: 'edit',
      tool: 'brush',
    });
  },
  goBoard: (f) => {
    get().seed(f);
    set({ step: 3 });
  },

  // ── 페인팅 ──
  beginStroke: () => {
    const { phase, activePlayer, zones, history } = get();
    if (activePlayer == null || activePlayer === GK_NO) return;
    const cur = zones[phase][activePlayer] ?? new Set<number>();
    set({
      history: [
        ...history.slice(-49), // 최근 50개만 유지
        { phase, playerNo: activePlayer, before: [...cur] },
      ],
    });
  },
  paintTile: (idx) => {
    const { phase, activePlayer, tool, zones, resolution } = get();
    if (activePlayer == null || activePlayer === GK_NO) return;
    const prev = zones[phase][activePlayer] ?? new Set<number>();
    const B = CONFIG.tileBudget(resolution.rows, resolution.cols);
    const next = new Set(prev);
    if (tool === 'eraser') next.delete(idx);
    else {
      if (prev.size >= B && !prev.has(idx)) return; // 예산 소진 → 색칠 차단
      next.add(idx);
    }
    if (next.size === prev.size && tool !== 'eraser') return; // 변화 없음
    set({
      zones: {
        ...zones,
        [phase]: { ...zones[phase], [activePlayer]: next },
      },
    });
  },
  paintTiles: (idxs) => {
    const { phase, activePlayer, tool, zones, resolution } = get();
    if (activePlayer == null || activePlayer === GK_NO) return;
    const B = CONFIG.tileBudget(resolution.rows, resolution.cols);
    const next = new Set(zones[phase][activePlayer] ?? new Set<number>());
    for (const idx of idxs) {
      if (tool === 'eraser') next.delete(idx);
      else {
        if (next.size >= B) break; // 예산 한도까지만 채움
        next.add(idx);
      }
    }
    set({
      zones: {
        ...zones,
        [phase]: { ...zones[phase], [activePlayer]: next },
      },
    });
  },
  undo: () => {
    const { history, zones } = get();
    if (history.length === 0) return;
    const last = history[history.length - 1];
    const phaseZones = { ...zones[last.phase] };
    phaseZones[last.playerNo] = new Set(last.before);
    set({
      zones: { ...zones, [last.phase]: phaseZones },
      history: history.slice(0, -1),
    });
  },
  resetPhase: () => {
    const { phase, zones, players, resolution } = get();
    const cleared: AppState['zones']['defense'] = {};
    // GK는 유지
    const gk = players.find((p) => p.no === GK_NO);
    if (gk) cleared[GK_NO] = buildGkZone(resolution.rows, resolution.cols);
    set({ zones: { ...zones, [phase]: cleared }, history: [] });
  },
  reseedPhase: () => {
    const { phase, zones, resolution, formation } = get();
    set({
      zones: {
        ...zones,
        [phase]: buildDefaultZones(resolution.rows, resolution.cols, formation),
      },
      history: [],
    });
  },
  initAttackFromDefense: () => {
    const { zones } = get();
    const copy: AppState['zones']['attack'] = {};
    for (const [no, s] of Object.entries(zones.defense))
      copy[Number(no)] = new Set(s);
    set({
      zones: { ...zones, attack: copy },
      attackInitialized: true,
    });
  },
}));
