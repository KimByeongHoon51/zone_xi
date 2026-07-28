// components/pitch/PitchMarkings.tsx — 페널티 박스·센터서클·골 오버레이 (구현 명세서 1·17장)
// 세로형: 상단 = 상대 골문(공격), 하단 = 자기 골문. viewBox 100×200 (2:1).
import { memo } from 'react';

interface Props {
  onPaint: boolean; // 색칠 위에 그릴 때 흰색 마킹
}

function PitchMarkingsBase({ onPaint }: Props) {
  const stroke = onPaint ? '#FFFFFF' : '#64748B';
  const op = onPaint ? 0.55 : 0.5;
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 200"
      preserveAspectRatio="none"
      aria-hidden
    >
      <g fill="none" stroke={stroke} strokeWidth={0.7} opacity={op}>
        {/* 외곽 */}
        <rect x={1} y={1} width={98} height={198} />
        {/* 하프라인 */}
        <line x1={1} y1={100} x2={99} y2={100} />
        {/* 센터서클 + 킥오프 점 */}
        <circle cx={50} cy={100} r={13} />
        <circle cx={50} cy={100} r={0.8} fill={stroke} stroke="none" />
        {/* 상단 골문(상대) */}
        <rect x={35} y={1} width={30} height={16} />
        <rect x={42} y={1} width={16} height={6} />
        <path d="M 38 17 A 12 12 0 0 0 62 17" />
        <rect x={44} y={-1} width={12} height={2} fill={stroke} stroke="none" opacity={0.9} />
        {/* 하단 골문(자기) */}
        <rect x={35} y={183} width={30} height={16} />
        <rect x={42} y={193} width={16} height={6} />
        <path d="M 38 183 A 12 12 0 0 1 62 183" />
        <rect x={44} y={199} width={12} height={2} fill={stroke} stroke="none" opacity={0.9} />
      </g>
    </svg>
  );
}

export const PitchMarkings = memo(PitchMarkingsBase);
