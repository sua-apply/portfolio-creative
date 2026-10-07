/* =========================================
   프로젝트 데이터
   - 여기에 프로젝트를 한 덩어리씩 추가하면 됩니다.
   - roles: 이 프로젝트가 보일 직무 ("design" | "marketing" | "pr"). 링크로 연 직무의 프로젝트만 보여요.
   - date: "YYYY-MM" → 작업물 페이지의 연도 → 월별 보기가 자동으로 생성
   - featured: true → 메인 '작업물 보러가기' 배너 썸네일 후보 (최신 3개)
   - thumb / image: "img/projects/파일명.jpg" 처럼 사이트 기준 경로
   - 나중에 Supabase로 옮기면 이 배열 대신 DB에서 같은 모양으로 불러오면 됩니다.
   ========================================= */
(function () {
  "use strict";

  const ALL = [
    {
      id: "aurora-coffee", roles: ["design"],
      title: "[Aurora Coffee 브랜드 아이덴티티]", category: "branding", categoryLabel: "Branding",
      date: "2025-08", featured: true, client: "[클라이언트]", role: "[담당 역할]",
      thumb: "img/projects/project-01.svg", image: "img/projects/project-01.svg",
      desc: "[프로젝트 설명. 어떤 문제가 있었고, 어떻게 풀었고, 어떤 결과가 나왔는지 두세 문장으로 적어주세요.]",
      tags: ["Branding", "Logo", "Packaging"], link: ""
    },
    {
      id: "app-redesign", roles: ["design"],
      title: "[B2C 앱 리디자인]", category: "uiux", categoryLabel: "UI/UX",
      date: "2025-03", featured: true, client: "[클라이언트]", role: "[담당 역할]",
      thumb: "img/projects/project-02.svg", image: "img/projects/project-02.svg",
      desc: "[프로젝트 설명]", tags: ["UI/UX", "Design System"], link: ""
    },
    {
      id: "poster-series", roles: ["design", "pr"],
      title: "[전시 포스터 시리즈]", category: "graphic", categoryLabel: "Graphic",
      date: "2024-11", featured: true, client: "[클라이언트]", role: "[담당 역할]",
      thumb: "img/projects/project-03.svg", image: "img/projects/project-03.svg",
      desc: "[프로젝트 설명]", tags: ["Poster", "Typography"], link: ""
    },
    {
      id: "package", roles: ["design", "marketing"],
      title: "[패키지 디자인]", category: "branding", categoryLabel: "Packaging",
      date: "2024-06", featured: false, client: "[클라이언트]", role: "[담당 역할]",
      thumb: "img/projects/project-04.svg", image: "img/projects/project-04.svg",
      desc: "[프로젝트 설명]", tags: ["Packaging"], link: ""
    },
    {
      id: "sns-campaign", roles: ["marketing", "pr"],
      title: "[SNS 캠페인]", category: "marketing", categoryLabel: "Campaign",
      date: "2025-05", featured: true, client: "[클라이언트]", role: "[담당 역할]",
      thumb: "img/projects/project-05.svg", image: "img/projects/project-05.svg",
      desc: "[목표, 전략, 성과 수치를 두세 문장으로 적어주세요.]", tags: ["Performance", "Content"], link: ""
    },
    {
      id: "press", roles: ["pr"],
      title: "[브랜드 런칭 언론 홍보]", category: "pr", categoryLabel: "PR",
      date: "2024-09", featured: true, client: "[클라이언트]", role: "[담당 역할]",
      thumb: "img/projects/project-06.svg", image: "img/projects/project-06.svg",
      desc: "[보도자료 배포, 보도 건수, 노출 수치를 적어주세요.]", tags: ["Press", "Media"], link: ""
    },
    {
      id: "brand-campaign", roles: ["marketing"],
      title: "[브랜드 캠페인]", category: "marketing", categoryLabel: "Campaign",
      date: "2024-03", featured: true, client: "[클라이언트]", role: "[담당 역할]",
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
