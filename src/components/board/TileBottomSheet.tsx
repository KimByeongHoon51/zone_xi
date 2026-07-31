// components/board/TileBottomSheet.tsx — 타일 정보 카드 (구현 명세서 15장)
// 전술판을 가리지 않도록 우측 패널 하단에 정적 카드로 표시한다.
import { useStore } from '../../state/store';
import { tileToZone } from '../../lib/mapping';
import { ZONE_NAMES, ZONE_EVIDENCE, SUBPOS } from '../../constants/zones';
import { ZONE_WEIGHTS, riskGrade } from '../../constants/weights';
import { CONFIG } from '../../constants/config';

interface Props {
  idx: number | null;
}

export function TileBottomSheet({ idx }: Props) {
  const { rows, cols } = useStore((s) => s.resolution);
  const phase = useStore((s) => s.phase);
  const zones = useStore((s) => s.zones[phase]);

  // 아무것도 hover하지 않은 상태: 안내 플레이스홀더 (레이아웃 고정)
  if (idx == null) {
    return (
      <div className="shrink-0 rounded-xl border border-dashed border-slate-200 bg-white/60 p-3.5">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          타일 정보
        </div>
        <p className="mt-1 text-[12px] leading-relaxed text-muted">
          전술판의 타일에 마우스를 올리면 구역 이름·위험 가중치·근거·현재 커버
          상태가 여기에 표시됩니다.
        </p>
      </div>
    );
  }

  const zone = tileToZone(idx, rows, cols);
  const weight = ZONE_WEIGHTS[zone];
  const grade = riskGrade(weight);
  const evidence =
    ZONE_EVIDENCE[zone] ??
    `가중치 ${weight.toFixed(2)} — 15구역 위험 순위 기준 서술`;
  const sub = SUBPOS[zone];

  // 현재 커버 상태
  let count = 0;
  for (const set of Object.values(zones)) if (set.has(idx)) count++;
  const coverText =
    count === 0
      ? '0명 (공백)'
      : count >= CONFIG.OVERCROWD
        ? `${count}명 (과밀)`
        : `${count}명`;

  // 서술형 코멘트 (규칙 기반, 명령형 금지)
  const highRisk = weight >= CONFIG.HIGH_RISK_WEIGHT;
  let comment: string;
  if (count === 0 && highRisk)
    comment = '이 구역이 비면 상대 슈팅이 집중되는 자리입니다.';
  else if (count === 0)
    comment =
      '비어 있지만 위험도는 낮습니다. 여기를 포기하고 다른 곳을 두껍게 한 선택일 수 있습니다.';
  else if (count >= CONFIG.OVERCROWD)
    comment = '겹친 칸은 다른 곳에 쓸 수 있는 여유입니다.';
  else comment = '현재 커버되고 있는 구역입니다.';

  const gradeColor =
    weight >= 0.7 ? 'text-warn' : weight >= 0.3 ? 'text-overcrowd' : 'text-subtle';

  return (
    <div className="shrink-0 rounded-xl bg-white px-3.5 py-2.5 shadow-sm ring-1 ring-black/5">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
        타일 정보
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-ink">{ZONE_NAMES[zone]}</div>
          <div className="mt-0.5 text-[11px]">
            위험 가중치{' '}
            <span className={`font-semibold ${gradeColor}`}>
              {weight.toFixed(2)} · {grade}
            </span>
          </div>
        </div>
        <div className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-center">
          <div className="text-[10px] text-muted">현재 커버</div>
          <div
            className={`text-sm font-bold ${
              count === 0 && highRisk
                ? 'text-warn'
                : count >= CONFIG.OVERCROWD
                  ? 'text-overcrowd'
                  : 'text-ink'
            }`}
          >
            {coverText}
          </div>
        </div>
      </div>

      <div className="mt-1.5 rounded-md bg-brand/5 px-2.5 py-1 text-[11px] leading-snug text-brand">
        📊 근거 · {evidence}
      </div>

      {sub && (
        <div className="mt-1 text-[10.5px] leading-snug text-muted">
          <span className="opacity-70">역할(정적 매핑, 측정값 아님):</span>{' '}
          <span className="text-subtle">
            {sub.role} — {sub.note} · 수비 대응: {sub.defend}
          </span>
        </div>
      )}

      <div className="mt-1 text-[12px] leading-snug text-ink">{comment}</div>
    </div>
  );
}
