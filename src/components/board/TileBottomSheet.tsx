// components/board/TileBottomSheet.tsx — 타일 hover 정보 시트 (구현 명세서 15장)
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

  if (idx == null) return null;

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
    count === 0 ? '0명 (공백)' : count >= CONFIG.OVERCROWD ? `${count}명 (과밀)` : `${count}명`;

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
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-3">
      <div className="animate-slide-up w-full max-w-[560px] rounded-xl bg-white/95 p-3.5 shadow-2xl ring-1 ring-black/10 backdrop-blur">
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
          <div className="shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-center">
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

        <div className="mt-2 rounded-md bg-brand/5 px-2.5 py-1.5 text-[11px] text-brand">
          📊 근거 · {evidence}
        </div>

        {sub && (
          <div className="mt-1.5 text-[10.5px] text-muted">
            <span className="opacity-70">역할(정적 매핑, 측정값 아님):</span>{' '}
            <span className="text-subtle">
              {sub.role} — {sub.note} · 수비 대응: {sub.defend}
            </span>
          </div>
        )}

        <div className="mt-1.5 text-[12px] leading-relaxed text-ink">{comment}</div>
      </div>
    </div>
  );
}
