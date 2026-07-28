// App.tsx — 단일 페이지, step에 따라 화면 전환 (구현 명세서 2장)
import { useEffect, useState } from 'react';
import { useStore } from './state/store';
import { Landing } from './screens/Landing';
import { Setup } from './screens/Setup';
import { Board } from './screens/Board';
import { Report } from './screens/Report';
import { COPY } from './constants/copy';

// 데스크톱 전용: 좁은 화면은 안내 (구현 명세서 1·17·19장)
function useIsNarrow(threshold = 1024) {
  const [narrow, setNarrow] = useState(
    typeof window !== 'undefined' ? window.innerWidth < threshold : false
  );
  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < threshold);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [threshold]);
  return narrow;
}

function MobileNotice() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand px-8 text-center text-white">
      <div className="text-4xl font-black tracking-tight">{COPY.brand}</div>
      <div className="mt-3 text-3xl">🖥️</div>
      <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/85">
        {COPY.mobileNotice}
      </p>
    </div>
  );
}

export default function App() {
  const step = useStore((s) => s.step);
  const narrow = useIsNarrow();

  // 랜딩·설정은 좁은 화면에서도 보이게. 보드/리포트는 데스크톱 필요.
  if (narrow && (step === 3 || step === 4)) return <MobileNotice />;

  switch (step) {
    case 1:
      return <Landing />;
    case 2:
      return <Setup />;
    case 3:
      return <Board />;
    case 4:
      return <Report />;
    default:
      return <Landing />;
  }
}
