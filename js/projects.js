/* =========================================
   프로젝트 데이터
   - 여기에 프로젝트를 한 덩어리씩 추가하면 됩니다.
   - roles: 이 프로젝트가 보일 직무 ("design" | "marketing" | "pr"). 링크로 연 직무의 프로젝트만 보여요.
   - date: "YYYY-MM" → 작업물 페이지의 연도 → 월별 보기가 자동으로 생성
   - featured: true → 메인 '작업물 보러가기' 배너 썸네일 후보 (최신 3개)
   - thumb / image: "img/projects/파일명.jpg" 처럼 사이트 기준 경로
   - summary: 카드에 보이는 한 줄 요약
   - did: 내가 한 일 (2~4줄). 작업물 페이지에서 '한 일'로 보여요
   - tools: 사용한 도구. 페이지 맨 위 '이 사람이 쓰는 도구'가 이걸로 자동 계산돼요
   - type: 프로젝트 구분 "personal"(개인) | "team"(팀) | "contest"(공모전) | "school"(학교 과제) | "client"(외주)
   - client: 외주일 때만 적어요. 비우면 화면에 안 보여요
   - result: 결과 숫자 하나 { value: "+32%", label: "재구매율" } (없으면 null)
   - 나중에 Supabase로 옮기면 이 배열 대신 DB에서 같은 모양으로 불러오면 됩니다.
   ========================================= */
(function () {
  "use strict";

  const ALL = [
    {
      id: "aurora-coffee",
      summary: "[로컬 카페의 첫 브랜드를 로고부터 패키지까지 한 번에 정리]",
      did: ["[브랜드 키워드 도출과 무드보드]", "[로고 · 컬러 · 타이포 시스템 설계]", "[컵 · 봉투 · 메뉴판 적용]"],
      tools: ["Illustrator", "Photoshop", "Figma"],
      result: { value: "[+32%]", label: "[재방문율]" },
      roles: ["design"],
      title: "[Aurora Coffee 브랜드 아이덴티티]", category: "branding", categoryLabel: "Branding",
      date: "2025-08", featured: true, type: "personal", client: "", role: "[담당 역할]",
      thumb: "img/projects/project-01.svg", image: "img/projects/project-01.svg",
      desc: "[프로젝트 설명. 어떤 문제가 있었고, 어떻게 풀었고, 어떤 결과가 나왔는지 두세 문장으로 적어주세요.]",
      tags: ["Branding", "Logo", "Packaging"], link: ""
    },
    {
      id: "app-redesign",
      summary: "[복잡한 예약 흐름을 3단계로 줄인 앱 리디자인]",
      did: ["[사용자 인터뷰 8명 · 문제 정의]", "[와이어프레임과 프로토타입]", "[디자인 시스템 컴포넌트 40개]"],
      tools: ["Figma", "Notion"],
      result: { value: "[-40%]", label: "[예약 이탈률]" },
      roles: ["design"],
      title: "[B2C 앱 리디자인]", category: "uiux", categoryLabel: "UI/UX",
      date: "2025-03", featured: true, type: "personal", client: "", role: "[담당 역할]",
      thumb: "img/projects/project-02.svg", image: "img/projects/project-02.svg",
      desc: "[프로젝트 설명]", tags: ["UI/UX", "Design System"], link: ""
    },
    {
      id: "poster-series",
      summary: "[전시 메시지를 타이포그래피로 푼 포스터 4종]",
      did: ["[전시 콘셉트 해석]", "[타이포 중심 레이아웃 4종]", "[인쇄 감리]"],
      tools: ["Illustrator", "InDesign"],
      result: null,
      roles: ["design", "pr"],
      title: "[전시 포스터 시리즈]", category: "graphic", categoryLabel: "Graphic",
      date: "2024-11", featured: true, type: "team", client: "", role: "[담당 역할]",
      thumb: "img/projects/project-03.svg", image: "img/projects/project-03.svg",
      desc: "[프로젝트 설명]", tags: ["Poster", "Typography"], link: ""
    },
    {
      id: "package",
      summary: "[제품의 원료를 색으로 구분한 패키지 시리즈]",
      did: ["[라인업별 컬러 체계]", "[패키지 전개도와 목업]", "[인쇄소 커뮤니케이션]"],
      tools: ["Illustrator", "Photoshop", "Blender"],
      result: { value: "[3종]", label: "[라인업 출시]" },
      roles: ["design", "marketing"],
      title: "[패키지 디자인]", category: "branding", categoryLabel: "Packaging",
      date: "2024-06", featured: false, type: "contest", client: "", role: "[담당 역할]",
      thumb: "img/projects/project-04.svg", image: "img/projects/project-04.svg",
      desc: "[프로젝트 설명]", tags: ["Packaging"], link: ""
    },
    {
      id: "sns-campaign",
      summary: "[신제품 출시 SNS 캠페인 기획과 운영]",
      did: ["[타깃 정의와 메시지 설계]", "[콘텐츠 12편 제작 · 운영]", "[광고 집행과 성과 분석]"],
      tools: ["Meta Ads", "GA4", "Canva"],
      result: { value: "[+XX%]", label: "[전환율]" },
      roles: ["marketing", "pr"],
      title: "[SNS 캠페인]", category: "marketing", categoryLabel: "Campaign",
      date: "2025-05", featured: true, type: "personal", client: "", role: "[담당 역할]",
      thumb: "img/projects/project-05.svg", image: "img/projects/project-05.svg",
      desc: "[목표, 전략, 성과 수치를 두세 문장으로 적어주세요.]", tags: ["Performance", "Content"], link: ""
    },
    {
      id: "press",
      summary: "[브랜드 런칭 보도자료와 미디어 대응]",
      did: ["[보도자료 작성 · 배포]", "[미디어 리스트 관리]", "[보도 모니터링 리포트]"],
      tools: ["Notion", "Excel"],
      result: { value: "[XX건]", label: "[언론 보도]" },
      roles: ["pr"],
      title: "[브랜드 런칭 언론 홍보]", category: "pr", categoryLabel: "PR",
      date: "2024-09", featured: true, type: "school", client: "", role: "[담당 역할]",
      thumb: "img/projects/project-06.svg", image: "img/projects/project-06.svg",
      desc: "[보도자료 배포, 보도 건수, 노출 수치를 적어주세요.]", tags: ["Press", "Media"], link: ""
    },
    {
      id: "brand-campaign",
      summary: "[브랜드 인지도를 높이기 위한 통합 캠페인]",
      did: ["[캠페인 콘셉트 기획]", "[채널별 예산 배분]", "[CRM 메시지 설계]"],
      tools: ["GA4", "Google Ads", "Excel"],
      result: { value: "[X.X배]", label: "[ROAS]" },
      roles: ["marketing"],
      title: "[브랜드 캠페인]", category: "marketing", categoryLabel: "Campaign",
      date: "2024-03", featured: true, type: "team", client: "", role: "[담당 역할]",
      thumb: "img/projects/project-01.svg", image: "img/projects/project-01.svg",
      desc: "[목표, 전략, 성과 수치를 두세 문장으로 적어주세요.]", tags: ["Campaign", "CRM"], link: ""
    }
  ];

  const role = window.ROLE || "design";
  window.PROJECTS = ALL
    .filter((p) => p.roles.includes(role))
    .sort((a, b) => b.date.localeCompare(a.date));
  window.PROJECTS_READY = Promise.resolve();
  window.addEventListener("DOMContentLoaded", () => window.dispatchEvent(new Event("projects:ready")));
})();
