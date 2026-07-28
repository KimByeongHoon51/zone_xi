// constants/zones.ts — 구역 이름·근거·세부 포지션 (구현 명세서 11장)

export const ZONE_NAMES: Record<string, string> = {
  att_L: '공격 서드 · 왼쪽 측면',
  att_LI: '공격 서드 · 왼쪽 하프스페이스',
  att_C: '공격 서드 · 중앙',
  att_RI: '공격 서드 · 오른쪽 하프스페이스',
  att_R: '공격 서드 · 오른쪽 측면',
  mid_L: '중원 · 왼쪽 측면',
  mid_LI: '중원 · 왼쪽 인사이드',
  mid_C: '중원 · 중앙',
  mid_RI: '중원 · 오른쪽 인사이드',
  mid_R: '중원 · 오른쪽 측면',
  def_L: '수비 서드 · 왼쪽 측면',
  def_LI: '수비 서드 · 왼쪽 하프스페이스',
  def_C: '수비 서드 · 중앙',
  def_RI: '수비 서드 · 오른쪽 하프스페이스',
  def_R: '수비 서드 · 오른쪽 측면',
};

// 실측 근거 (결승 슈팅 채널 분포 기반). 미측정 구역은 가중치 순위로 서술.
export const ZONE_EVIDENCE: Partial<Record<string, string>> = {
  att_C: '두 경기 슈팅의 60%가 이 구역에서 발생',
  att_LI: '두 경기 슈팅의 약 12%가 이 구역에서 발생',
  att_RI: '두 경기 슈팅의 약 12%가 이 구역에서 발생',
  att_L: '두 경기 슈팅의 약 5%만 이 구역에서 발생',
  att_R: '두 경기 슈팅의 약 5%만 이 구역에서 발생',
  mid_L: '측면 중원 — 15구역 중 가장 낮은 위험',
  mid_R: '측면 중원 — 15구역 중 가장 낮은 위험',
  def_C: '수비 서드 중앙 — 최후 저지선, 15구역 중 2번째로 위험',
};

// 세부 포지션 매핑 (공격 서드는 채널별로 세분).
// ⚠ 이 매핑은 '측정값'이 아니라 도메인 정적 역할 매핑이다.
//    바텀시트에서 근거(실측)와 시각적으로 분리 표기할 것 (옅은 보조 라벨).
export const SUBPOS: Record<
  string,
  { role: string; note: string; defend: string }
> = {
  att_C: {
    role: '스트라이커 (ST)',
    note: '문전 마무리·침투 (슈팅 최다 집중)',
    defend: '센터백',
  },
  att_LI: {
    role: '세컨드 스트라이커·공격형 MF',
    note: '라인 사이 연결·2선 침투',
    defend: '수비형 MF·센터백',
  },
  att_RI: {
    role: '세컨드 스트라이커·공격형 MF',
    note: '라인 사이 연결·2선 침투',
    defend: '수비형 MF·센터백',
  },
  att_L: { role: '윙어 (LW)', note: '폭 확보·컷인·크로스', defend: '풀백' },
  att_R: { role: '윙어 (RW)', note: '폭 확보·컷인·크로스', defend: '풀백' },
  mid_C: { role: '중앙 미드필더', note: '전개·연결', defend: '중앙 MF' },
  mid_L: { role: '측면 MF·윙백', note: '폭 확보', defend: '풀백·윙백' },
  mid_R: { role: '측면 MF·윙백', note: '폭 확보', defend: '풀백·윙백' },
  def_C: { role: '센터백', note: '최후 저지선', defend: '센터백' },
  def_L: { role: '풀백', note: '측면 저지', defend: '풀백' },
  def_R: { role: '풀백', note: '측면 저지', defend: '풀백' },
};
