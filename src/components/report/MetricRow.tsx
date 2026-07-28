// components/report/MetricRow.tsx — 지표 4개 카드 (구현 명세서 16장)
import type { Metrics } from '../../lib/metrics';

function Card({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: 'warn' | 'over';
}) {
  const color =
    tone === 'warn' ? 'text-warn' : tone === 'over' ? 'text-overcrowd' : 'text-ink';
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="text-[11px] font-medium text-subtle">{label}</div>
      <div className={`mt-1 text-3xl font-bold tabular-nums ${color}`}>{value}</div>
      <div className="mt-0.5 text-[11px] text-muted">{sub}</div>
    </div>
  );
}

export function MetricRow({ m }: { m: Metrics }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Card label="커버리지" value={`${m.coveragePct}%`} sub="칠한 타일 비율" />
      <Card
        label="위험 구역"
        value={`${m.riskZoneCount}곳`}
        sub="고위험 + 공백"
        tone={m.riskZoneCount > 0 ? 'warn' : undefined}
      />
      <Card
        label="과밀 칸"
        value={`${m.overcrowdTiles}칸`}
        sub="3명 이상 겹침"
        tone={m.overcrowdTiles > 0 ? 'over' : undefined}
      />
      <Card
        label="좌우 균형"
        value={m.tilt === '균형' ? '균형' : m.tilt}
        sub={`좌측 ${m.leftMass} · 우측 ${m.rightMass}`}
      />
    </div>
  );
}
