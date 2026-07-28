// screens/Setup.tsx — S2 설정 (해상도·포메이션 선택, 구현 명세서 2·17장)
import { useState } from 'react';
import { useStore } from '../state/store';
import { FORMATIONS, type FormationName } from '../constants/formations';
import { COPY } from '../constants/copy';

const FORMATION_DESC: Record<FormationName, string> = {
  '4-3-3': '측면 폭 + 중앙 스트라이커. 밸런스형 기본 배치.',
  '4-4-2': '두 줄 4-4 블록 + 투톱. 촘촘한 수비 라인.',
  '3-5-2': '스리백 + 윙백 + 투톱. 중원 과부하형.',
};

export function Setup() {
  const setStep = useStore((s) => s.setStep);
  const goBoard = useStore((s) => s.goBoard);
  const [formation, setFormation] = useState<FormationName>('4-3-3');

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f1f5f2] px-6 py-10">
      <div className="w-full max-w-2xl animate-fade-in-up">
        <button
          onClick={() => setStep(1)}
          className="mb-4 text-sm text-subtle hover:text-ink"
        >
          ← 처음으로
        </button>

        <h1 className="text-2xl font-extrabold text-ink">전술 설정</h1>
        <p className="mt-1 text-sm text-subtle">
          해상도와 포메이션을 고르면 기본 배치가 판에 자동으로 칠해집니다. 이후
          자유롭게 수정하세요.
        </p>

        {/* 해상도 */}
        <section className="mt-6">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
            해상도
          </div>
          <div className="flex gap-2">
            <div className="rounded-lg border-2 border-brand bg-brand/5 px-4 py-2.5">
              <div className="text-sm font-bold text-brand">14 × 7 타일</div>
              <div className="text-[11px] text-subtle">세로형 · 98칸 (기본)</div>
            </div>
            <div className="rounded-lg border border-slate-200 px-4 py-2.5 opacity-50">
              <div className="text-sm font-semibold text-subtle">10×5 · 20×10</div>
              <div className="text-[11px] text-muted">확장 예정</div>
            </div>
          </div>
        </section>

        {/* 포메이션 */}
        <section className="mt-6">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
            포메이션
          </div>
          <div className="grid grid-cols-3 gap-3">
            {FORMATIONS.map((f) => (
              <button
                key={f}
                onClick={() => setFormation(f)}
                className={`rounded-xl border-2 p-4 text-left transition ${
                  formation === f
                    ? 'border-brand bg-brand/5 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-xl font-extrabold text-ink">{f}</div>
                <div className="mt-1 text-[11px] leading-relaxed text-subtle">
                  {FORMATION_DESC[f]}
                </div>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={() => goBoard(formation)}
            className="rounded-xl bg-brand px-6 py-3 text-base font-bold text-white shadow-md transition hover:bg-brand/90"
          >
            이 배치로 시작 →
          </button>
          <button
            onClick={() => goBoard('4-3-3')}
            className="rounded-xl px-4 py-3 text-sm font-medium text-subtle hover:text-ink"
          >
            건너뛰기 (4-3-3 기본)
          </button>
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-muted">{COPY.limitation}</p>
      </div>
    </div>
  );
}
