// screens/Report.tsx — S4 리포트 카드 (구현 명세서 16장)
// 시선 순서: 그림 → 문장 → 수치.
import { useMemo } from 'react';
import { useStore } from '../state/store';
import { useMetrics } from '../hooks/useMetrics';
import { tendencyTag } from '../lib/tendency';
import { buildFindings, buildSuggestions } from '../lib/suggestions';
import { PitchGrid } from '../components/pitch/PitchGrid';
import { TendencyTag } from '../components/report/TendencyTag';
import { MetricRow } from '../components/report/MetricRow';
import { FindingList } from '../components/report/Suggestions';
import { ZONE_EVIDENCE, ZONE_NAMES } from '../constants/zones';
import { COPY } from '../constants/copy';

export function Report() {
  const setStep = useStore((s) => s.setStep);
  const phase = useStore((s) => s.phase);
  const { rows, cols } = useStore((s) => s.resolution);
  const zones = useStore((s) => s.zones[phase]);
  const m = useMetrics();

  const tend = tendencyTag(m, m.overcrowdTiles);
  const findings = useMemo(
    () => buildFindings(m, m.overcrowdTiles),
    [m]
  );
  const suggestions = useMemo(
    () => buildSuggestions(m, zones, rows, cols),
    [m, zones, rows, cols]
  );

  // 근거: 위험 구역에 해당하는 실측 근거 문구 모음
  const evidences = m.riskZones
    .map((z) => ({ zone: z, text: ZONE_EVIDENCE[z] }))
    .filter((e) => e.text);

  return (
    <div className="min-h-screen bg-[#f1f5f2] pb-16">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-lg font-extrabold tracking-tight text-brand">
            {COPY.brand}
          </span>
          <span className="text-sm text-subtle">리포트 카드</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-subtle">
            {phase === 'defense' ? '수비 국면' : '공격 시 전개'}
          </span>
        </div>
        <button
          onClick={() => setStep(3)}
          className="rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90"
        >
          ← 다시 조정하기
        </button>
      </header>

      <div className="mx-auto max-w-5xl px-6 pt-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,300px)_1fr]">
          {/* 왼쪽: 밀집도 지도 + 성향 */}
          <div className="space-y-4">
            <TendencyTag t={tend} />
            <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                밀집도 지도
              </div>
              <div className="flex justify-center">
                <div style={{ height: 360 }} className="relative">
                  <PitchGrid interactive={false} forceView="density" />
                </div>
              </div>
              <p className="mt-2 text-center text-[10px] text-muted">
                붉은칸=공백 · 초록=적정 · 주황=과밀
              </p>
            </div>
          </div>

          {/* 오른쪽: 발견 → 제안 → 지표 */}
          <div className="space-y-4">
            <FindingList
              title="발견"
              icon="🔎"
              items={findings}
              accent="#DC2626"
            />
            <FindingList
              title="제안 — 잉여를 결핍으로"
              icon="💡"
              items={suggestions}
              accent="#B45309"
            />

            {evidences.length > 0 && (
              <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <h3 className="text-sm font-bold text-ink">근거 (검증 가능)</h3>
                </div>
                <ul className="space-y-1.5">
                  {evidences.map((e) => (
                    <li key={e.zone} className="text-[12px] text-subtle">
                      <b className="text-ink">{ZONE_NAMES[e.zone]}</b> — {e.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                지표
              </div>
              <MetricRow m={m} />
            </div>
          </div>
        </div>

        {/* 측정 한계 (상시) */}
        <p className="mt-8 rounded-lg border border-slate-200 bg-white/60 p-4 text-center text-[12px] leading-relaxed text-subtle">
          {COPY.limitation}
        </p>
      </div>
    </div>
  );
}
