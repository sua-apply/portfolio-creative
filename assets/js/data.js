// 포트폴리오 내용은 이 파일에서만 고치면 됩니다.
// 나중에 Supabase를 연결하면 이 파일 대신 DB에서 같은 모양의 데이터를 불러옵니다.
// [ ] 로 표시된 곳이 채워야 할 부분입니다.

export const profile = {
  nameKo: '박영희',
  nameEn: 'PARK Younghee',
  birth: '1999.01.01',
  email: '[your@email.com]',
  phone: '[010-0000-0000]',
  education: '[학교 · 전공]',
  links: [
    { label: 'Instagram', url: '#' },
    { label: 'Behance', url: '#' },
  ],
  resume: '#',
  photo: '', // 프로필 사진 경로. 예: 'assets/img/profile.jpg'
  intro: '[나를 소개하는 두 줄. 어떤 문제를 어떤 감각으로 풀어내는 사람인지 적어주세요.]',
  lead: '[나는 어떤 사람인가를 보여주는 한 문장. 예: 보기 좋은 것과 잘 전달되는 것 사이의 균형을 찾는 사람입니다.]',
};

export const defaultRole = 'design';

// 직무별 표시 이름, 색, 비밀 코드
// 지원할 때는 주소 뒤에 ?v=코드 를 붙여서 보냅니다. 예: /portfolio-creative/?v=9d35c7
// 코드는 다른 직무를 짐작하지 못하게 하는 용도입니다. 바꾸고 싶으면 아무 글자로 바꿔도 됩니다.
export const roles = {
  design: { label: 'Design', eyebrow: 'DESIGN', tagline: '[브랜드 · 비주얼 디자이너]', accent: '#ff5b2e', soft: '#fff1ea', code: '9d35c7' },
  marketing: { label: 'Marketing', eyebrow: 'MARKETING', tagline: '[퍼포먼스 · 콘텐츠 마케터]', accent: '#2b59ff', soft: '#eef2ff', code: '7337ec' },
  pr: { label: 'PR', eyebrow: 'PR', tagline: '[브랜드 PR · 커뮤니케이터]', accent: '#e2378c', soft: '#fdeef5', code: 'bab4f6' },
};

// 직무별로 할 수 있는 일 3가지와 툴
export const skills = {
  design: {
    abilities: [
      ['Branding', '[로고, 컬러, 타이포 등 브랜드 아이덴티티를 만드는 일]'],
      ['Visual', '[포스터, SNS, 광고 소재 등 시각 콘텐츠 제작]'],
      ['Editorial', '[패키지, 책자, 리플렛 등 편집 디자인]'],
    ],
    tools: ['Figma', 'Illustrator', 'Photoshop', 'InDesign', 'After Effects', 'Blender'],
  },
  marketing: {
    abilities: [
      ['Performance', '[광고 집행과 전환율 개선]'],
      ['Content', '[SNS 콘텐츠 기획과 운영]'],
      ['Analytics', '[데이터로 성과를 측정하고 개선]'],
    ],
    tools: ['GA4', 'Meta Ads', 'Google Ads', 'Notion', 'Excel', 'Canva'],
  },
  pr: {
    abilities: [
      ['Media', '[보도자료 작성과 언론 관계 관리]'],
      ['Social', '[SNS 커뮤니케이션과 이슈 대응]'],
      ['Event', '[행사와 캠페인 기획·운영]'],
    ],
    tools: ['보도자료 작성', '미디어 리스트', '언론 모니터링', 'SNS 운영', 'Excel', 'Canva'],
  },
};

export const career = {
  experience: [
    { period: '[2024.00 — 현재]', title: '[회사명]', desc: '[직무 · 주요 업무 한 줄]' },
    { period: '[2023.00 — 2023.00]', title: '[회사명 / 인턴]', desc: '[직무 · 주요 업무 한 줄]' },
  ],
  education: [
    { period: '[20XX — 20XX]', title: '[학교 · 전공]' },
    { period: '[20XX]', title: '[교육 과정 / 부트캠프]' },
  ],
  certificates: [
    { period: '[20XX.00]', title: '[자격증명]' },
    { period: '[20XX.00]', title: '[수상 내역]' },
  ],
};

// roles: 이 프로젝트가 해당하는 직무. 앞에 올수록 그 직무에서 우선 표시됩니다.
// category: 직무마다 다르게 보이는 프로젝트 분류
// design / marketing / pr: 직무별 상세 화면에 들어가는 내용
export const projects = [
  {
    id: 'brand-renewal',
    title: '[브랜드 리뉴얼]',
    roles: ['design', 'marketing'],
    category: { design: '[브랜드 아이덴티티 · 2025]', marketing: '[브랜드 캠페인 · 2025]', pr: '[브랜드 런칭 · 2025]' },
    summary: '[한 줄로 프로젝트를 소개하는 문장. 어떤 문제를 어떻게 풀었는지 요약합니다.]',
    design: { role: '[담당 역할]', year: '[20XX]', tools: '[Figma, Illustrator]', concept: '[디자인 콘셉트와 결정 이유. 컬러, 타이포, 그리드를 왜 그렇게 정했는지 두세 문장.]', palette: ['#1c1a17', '#c1502e', '#e2ddd0', '#f6f3ec'] },
    marketing: { metrics: [['[+XX%]', '[전환율 변화]'], ['[XX만]', '[도달 수]'], ['[X.X배]', '[ROAS]']], goal: '[캠페인 목표와 타깃]', strategy: '[채널, 메시지, 예산을 어떻게 짰는지]', result: '[결과와 배운 점]' },
    pr: { story: '[어떤 메시지를 누구에게 알리려 했는지, 어떤 매체를 어떻게 공략했는지.]', clips: [['[매체명] · [2025.00.00]', '[기사 제목]'], ['[매체명] · [2025.00.00]', '[기사 제목]'], ['[배포일]', '[보도자료 제목]'], ['[채널명]', '[SNS 게시물 요약]']], numbers: [['[언론 보도]', '[XX건]'], ['[SNS 노출]', '[XX만 회]'], ['[주요 매체]', '[매체 A · 매체 B]']] },
  },
  {
    id: 'sns-campaign',
    title: '[SNS 캠페인]',
    roles: ['marketing', 'pr'],
    category: { design: '[콘텐츠 디자인 · 2025]', marketing: '[퍼포먼스 마케팅 · 2025]', pr: '[SNS 커뮤니케이션 · 2025]' },
    summary: '[한 줄로 프로젝트를 소개하는 문장. 어떤 문제를 어떻게 풀었는지 요약합니다.]',
    design: { role: '[담당 역할]', year: '[20XX]', tools: '[Figma, Photoshop]', concept: '[디자인 콘셉트와 결정 이유.]', palette: ['#1c1a17', '#c1502e', '#e2ddd0', '#f6f3ec'] },
    marketing: { metrics: [['[+XX%]', '[참여율 변화]'], ['[XX만]', '[도달 수]'], ['[XX%]', '[팔로워 증가]']], goal: '[캠페인 목표와 타깃]', strategy: '[채널, 메시지, 예산을 어떻게 짰는지]', result: '[결과와 배운 점]' },
    pr: { story: '[어떤 메시지를 누구에게 알리려 했는지.]', clips: [['[채널명]', '[게시물 요약]'], ['[채널명]', '[게시물 요약]'], ['[매체명]', '[기사 제목]'], ['[채널명]', '[댓글 반응 요약]']], numbers: [['[SNS 노출]', '[XX만 회]'], ['[공유 수]', '[XX회]'], ['[주요 채널]', '[채널 A · 채널 B]']] },
  },
  {
    id: 'press',
    title: '[언론 홍보]',
    roles: ['pr'],
    category: { design: '[보도 비주얼 · 2024]', marketing: '[PR 마케팅 · 2024]', pr: '[보도자료 · 미디어 · 2024]' },
    summary: '[한 줄로 프로젝트를 소개하는 문장. 어떤 문제를 어떻게 풀었는지 요약합니다.]',
    design: { role: '[담당 역할]', year: '[20XX]', tools: '[Illustrator]', concept: '[보도용 이미지와 자료 디자인 설명.]', palette: ['#1c1a17', '#c1502e', '#e2ddd0', '#f6f3ec'] },
    marketing: { metrics: [['[XX건]', '[보도 수]'], ['[XX만]', '[노출 수]'], ['[+XX%]', '[검색량 변화]']], goal: '[홍보 목표]', strategy: '[어떤 매체를 어떻게 공략했는지]', result: '[결과와 배운 점]' },
    pr: { story: '[어떤 메시지를 누구에게 알리려 했는지, 어떤 매체를 어떻게 공략했는지.]', clips: [['[매체명] · [2024.00.00]', '[기사 제목]'], ['[매체명] · [2024.00.00]', '[기사 제목]'], ['[배포일]', '[보도자료 제목]'], ['[매체명] · [2024.00.00]', '[인터뷰 기사 제목]']], numbers: [['[언론 보도]', '[XX건]'], ['[온라인 노출]', '[XX만 회]'], ['[주요 매체]', '[매체 A · 매체 B]']] },
  },
  {
    id: 'package',
    title: '[패키지 디자인]',
    roles: ['design'],
    category: { design: '[패키지 · 편집 · 2024]', marketing: '[제품 마케팅 · 2024]', pr: '[제품 홍보 · 2024]' },
    summary: '[한 줄로 프로젝트를 소개하는 문장. 어떤 문제를 어떻게 풀었는지 요약합니다.]',
    design: { role: '[담당 역할]', year: '[20XX]', tools: '[Illustrator, InDesign]', concept: '[디자인 콘셉트와 결정 이유. 컬러, 타이포, 그리드를 왜 그렇게 정했는지 두세 문장.]', palette: ['#2b2a26', '#8a6f4e', '#d9cbb5', '#f6f3ec'] },
    marketing: { metrics: [['[+XX%]', '[판매량 변화]'], ['[XX개]', '[입점 매장]'], ['[XX%]', '[재구매율]']], goal: '[제품 목표와 타깃]', strategy: '[판매 채널과 프로모션]', result: '[결과와 배운 점]' },
    pr: { story: '[제품을 어떻게 알렸는지.]', clips: [['[매체명]', '[기사 제목]'], ['[채널명]', '[리뷰 요약]'], ['[배포일]', '[보도자료 제목]'], ['[채널명]', '[SNS 게시물 요약]']], numbers: [['[언론 보도]', '[XX건]'], ['[리뷰 수]', '[XX개]'], ['[주요 매체]', '[매체 A · 매체 B]']] },
  },
];
