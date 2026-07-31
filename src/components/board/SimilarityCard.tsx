// components/board/SimilarityCard.tsx — 【B】 형태 유사도 카드 (구현 명세서 v1.1 §17·18)
// 게이팅: 수비 국면 + 팀 예산 50%↑. "형태가 유사합니다"까지만 — 우열·승률 예측 금지.
import { useStore } from '../../state/store';
import { useMetrics } from '../../hooks/useMetrics';
import { fillRatio } from '../../lib/budget';
import { similarityView, type RankedTeam } from '../../lib/similarity';

interface Props {
  variant?: 'panel' | 'headline'; // panel: 보드 우측 / headline: 리포트 상단
}

function TeamRow({ t, lead }: { t: RankedTeam; lead: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className={`font-bold text-ink ${lead ? 'text-base' : 'text-sm'}`}>
          {t.name}
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-subtle">
          {t.tag}
        </span>
        {t.basis === 'summary' && (
          <span
            title="요약 근거 기반 근사 프로파일 (측정 커버 분포 아님)"
            className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700"
          >
            요약 근사
          </span>
        )}
      </div>
      <span
        className={`font-extrabold tabular-nums text-brand ${
          lead ? 'text-2xl' : 'text-lg'
        }`}
      >
        {t.sim}%
      </span>
    </div>
  );
}

export function SimilarityCard({ variant = 'panel' }: Props) {
  const phase = useStore((s) => s.phase);
  const { rows, cols } = useStore((s) => s.resolution);
  const zones = useStore((s) => s.zones[phase]);
  const m = useMetrics();

  const view = similarityView(phase, m.coverMass, fillRatio(zones, rows, cols));

  const wrap =
    variant === 'headline'
      ? 'rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5'
      : 'shrink-0 rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-black/5';

  // 미노출(게이팅): 안내 문구만
  if (!view.show) {
    return (
      <div className={wrap}>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          가장 가까운 형태
        </div>
        <p className="mt-1 text-[12px] leading-relaxed text-muted">
          {view.note}
        </p>
      </div>
    );
  }

  const near = view.near!;
  return (
    <div className={wrap}>
      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
        가장 가까운 형태
      </div>
      <div className="space-y-1.5">
        {near.map((t, i) => (
          <TeamRow key={t.key} t={t} lead={i === 0} />
        ))}
      </div>
      <p className="mt-2 border-t border-slate-100 pt-2 text-[10px] leading-relaxed text-muted">
        수비 커버 프로파일 근사와의 <b>형태 유사도</b>이며, 수비 우열·승률과는
        무관합니다.
      </p>
    </div>
  );
}
