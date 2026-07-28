// components/board/LiveFeedback.tsx — 우측 실시간 피드백 (구현 명세서 1·9·17장)
import { useStore } from '../../state/store';
import { useMetrics } from '../../hooks/useMetrics';
import { ZONE_NAMES } from '../../constants/zones';
import { ZONE_WEIGHTS } from '../../constants/weights';
import { DENSITY_SCALE } from '../../constants/palette';
import { tendencyTag } from '../../lib/tendency';

function Stat({
  label,
  value,
  tone,
  hint,
}: {
  label: string;
  value: string;
  tone?: 'ok' | 'warn' | 'over';
  hint?: string;
}) {
  const color =
    tone === 'warn'
      ? 'text-warn'
      : tone === 'over'
        ? 'text-overcrowd'
        : 'text-ink';
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <div className="text-[11px] font-medium text-subtle">{label}</div>
      <div className={`mt-0.5 text-2xl font-bold tabular-nums ${color}`}>
        {value}
      </div>
      {hint && <div className="mt-0.5 text-[10px] text-muted">{hint}</div>}
    </div>
  );
}

const LEGEND = [
  { c: DENSITY_SCALE[0], t: '0명 · 공백' },
  { c: DENSITY_SCALE[1], t: '1명 · 적정' },
  { c: DENSITY_SCALE[2], t: '2명 · 두꺼움' },
  { c: DENSITY_SCALE[3], t: '3명↑ · 과밀' },
];

export function LiveFeedback() {
  const m = useMetrics();
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  const tend = tendencyTag(m, m.overcrowdTiles);

  const worstRisk =
    m.riskZones.length > 0
      ? [...m.riskZones].sort(
          (a, b) =>
            ZONE_WEIGHTS[b as keyof typeof ZONE_WEIGHTS] -
            ZONE_WEIGHTS[a as keyof typeof ZONE_WEIGHTS]
        )[0]
      : null;

  return (
    <aside className="flex w-[300px] shrink-0 flex-col gap-3 overflow-y-auto rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          실시간 반응
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="rounded-full bg-brand px-2.5 py-1 text-sm font-bold text-white">
            {tend.tag}
          </span>
          <span className="text-[11px] text-muted">{tend.ref}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Stat label="커버리지" value={`${m.coveragePct}%`} hint="칠한 타일 비율" />
        <Stat
          label="위험 구역"
          value={`${m.riskZoneCount}곳`}
          tone={m.riskZoneCount > 0 ? 'warn' : 'ok'}
          hint="고위험 + 공백"
        />
        <Stat
          label="과밀 칸"
          value={`${m.overcrowdTiles}칸`}
          tone={m.overcrowdTiles > 0 ? 'over' : 'ok'}
          hint="3명 이상 겹침"
        />
        <Stat
          label="좌우"
          value={m.tilt === '균형' ? '균형' : m.tilt.slice(0, 2)}
          hint={`좌 ${m.leftMass} · 우 ${m.rightMass}`}
        />
      </div>

      {worstRisk && (
        <div className="rounded-lg border border-warn/30 bg-warn/5 p-3">
          <div className="text-[11px] font-semibold text-warn">
            ⚠ 가장 위험한 공백
          </div>
          <div className="mt-0.5 text-sm font-semibold text-ink">
            {ZONE_NAMES[worstRisk]}
          </div>
          <div className="mt-0.5 text-[11px] text-subtle">
            이 구역이 비면 상대 슈팅이 집중되는 자리입니다.
          </div>
        </div>
      )}

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            밀집도 범례
          </span>
          <button
            onClick={() => setView(view === 'density' ? 'edit' : 'density')}
            className="text-[11px] font-medium text-brand hover:underline"
          >
            {view === 'density' ? '편집으로' : '밀집도 보기'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {LEGEND.map((l) => (
            <div key={l.t} className="flex items-center gap-1.5">
              <span
                className="h-3.5 w-3.5 rounded-sm ring-1 ring-black/10"
                style={{ background: l.c }}
              />
              <span className="text-[11px] text-subtle">{l.t}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-auto border-t border-slate-100 pt-2.5 text-[10px] leading-relaxed text-muted">
        커버리지·위험 구역·과밀은 <b>공간 배분의 일관성</b>만 나타냅니다. 압박
        강도·전환 속도·개인 기량은 측정 범위 밖입니다.
      </p>
    </aside>
  );
}
