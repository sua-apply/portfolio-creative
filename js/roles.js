/* =========================================
   직무별 보기 (Design · Marketing · PR)
   - 주소 뒤 ?v=코드 로 어떤 직무를 보여줄지 정합니다. 방문자에게는 그 직무만 보여요.
     예) index.html?v=9d35c7  → Design
   - 코드는 다른 직무를 짐작하지 못하게 하는 용도라 아무 글자로 바꿔도 됩니다.
   - 직무를 바꾸는 막대는 manage.html 에서 '관리자 모드'를 켠 브라우저에서만 보여요.
   ========================================= */
(function () {
  "use strict";

  const ROLES = {
    design: {
      label: "Design",
      code: "9d35c7",
      eyebrow: "Brand · UI/UX · Graphic Designer",
      title: "생각을 <em>형태</em>로,<br />형태를 <em>경험</em>으로.",
      desc: "안녕하세요, 사용자의 맥락을 읽고 브랜드의 목소리를 시각 언어로 옮기는<br class=\"pc-only\" />디자이너 <strong>박영희</strong>입니다.",
      marquee: ["Branding", "UI/UX", "Editorial", "Packaging", "Motion"],
      skills: [
        { title: "Design", items: [["Brand Identity", "brand-identity"], ["UI/UX Design", "ui-ux"], ["Editorial Design", "editorial"], ["Design System", "design-system"]] },
        { title: "Tools", items: [["Figma", "figma"], ["Adobe Illustrator", "illustrator"], ["Adobe Photoshop", "photoshop"], ["Adobe InDesign", "indesign"]] },
        { title: "Etc.", items: [["After Effects", "after-effects"], ["Blender (Basic)", "blender"], ["HTML / CSS", "html-css"], ["Notion", "notion"]] }
      ]
    },
    marketing: {
      label: "Marketing",
      code: "7337ec",
      eyebrow: "Performance · Content Marketer",
      title: "데이터를 <em>이야기</em>로,<br />이야기를 <em>성과</em>로.",
      desc: "안녕하세요, 숫자에서 사람의 마음을 읽고 그 마음에 닿는 이야기를 만드는<br class=\"pc-only\" />마케터 <strong>박영희</strong>입니다.",
      marquee: ["Performance", "Content", "Campaign", "CRM", "Analytics"],
      skills: [
        { title: "Marketing", items: [["Performance Marketing"], ["Content Marketing"], ["Campaign Planning"], ["CRM"]] },
        { title: "Tools", items: [["GA4"], ["Meta Ads"], ["Google Ads"], ["Excel"]] },
        { title: "Etc.", items: [["Figma", "figma"], ["Adobe Photoshop", "photoshop"], ["Notion", "notion"], ["Canva"]] }
      ]
    },
    pr: {
      label: "PR",
      code: "bab4f6",
      eyebrow: "Brand PR · Communications",
      title: "브랜드를 <em>메시지</em>로,<br />메시지를 <em>신뢰</em>로.",
      desc: "안녕하세요, 브랜드가 하고 싶은 말을 사람들이 듣고 싶은 이야기로 바꾸는<br class=\"pc-only\" />커뮤니케이터 <strong>박영희</strong>입니다.",
      marquee: ["Media", "Press Release", "Social", "Event", "Storytelling"],
      skills: [
        { title: "PR", items: [["보도자료 작성"], ["미디어 리스트 관리"], ["언론 모니터링"], ["위기 대응"]] },
        { title: "Tools", items: [["Notion", "notion"], ["Excel"], ["Adobe Photoshop", "photoshop"], ["Canva"]] },
        { title: "Etc.", items: [["SNS 운영"], ["행사 기획"], ["영상 편집", "after-effects"], ["사진 촬영"]] }
      ]
    }
  };
  const DEFAULT_ROLE = "design";
  const ADMIN_KEY = "pf-admin-mode";

  const code = new URLSearchParams(location.search).get("v");
  let current = Object.keys(ROLES).find((k) => ROLES[k].code === code) || DEFAULT_ROLE;

  window.ROLES = ROLES;
  window.ROLE = current;

  const $ = (s) => document.querySelector(s);
  const icon = (name, label) => (name
    ? `<img src="img/icons/${name}.svg" alt="" width="20" height="20" />`
    : `<b aria-hidden="true">${label.charAt(0)}</b>`);

  function apply(role) {
    const R = ROLES[role];
    window.ROLE = role;
    document.documentElement.dataset.role = role;
    document.title = `박영희 | ${R.label} Portfolio`;

    const put = (sel, html) => { const el = $(sel); if (el) el.innerHTML = html; };
    put("#heroEyebrow", R.eyebrow);
    put("#heroTitle", R.title);
    put("#heroDesc", R.desc);
    const words = R.marquee.map((w) => `<span>${w}</span><span>✦</span>`).join("");
    put("#marqueeTrack", words + words);
    put("#skillsGrid", R.skills.map((c) => `
      <div class="skill-card reveal is-visible">
        <h3>${c.title}</h3>
        <ul>${c.items.map(([label, ico]) => `<li><span class="skill-icon">${icon(ico, label)}</span>${label}</li>`).join("")}</ul>
      </div>`).join(""));

    // 다른 페이지로 가는 링크에도 같은 코드를 붙입니다.
    document.querySelectorAll("a[data-keep]").forEach((a) => {
      const [path, hash] = a.getAttribute("data-keep").split("#");
      a.href = `${path}?v=${R.code}${hash ? `#${hash}` : ""}`;
    });
  }

  function adminBar() {
    let on = false;
    try { on = localStorage.getItem(ADMIN_KEY) === "1"; } catch (e) { /* 저장소를 못 쓰면 끔 */ }
    if (!on) return;
    const bar = document.createElement("div");
    bar.className = "admin-bar";
    bar.setAttribute("role", "toolbar");
    bar.setAttribute("aria-label", "관리자 직무 전환");
    bar.innerHTML = `<span>admin</span>${Object.keys(ROLES).map((k) =>
      `<button type="button" data-k="${k}" aria-pressed="${k === current}">${ROLES[k].label}</button>`).join("")}<a href="manage.html">관리</a>`;
    bar.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-k]");
      if (!b) return;
      const url = new URL(location.href);
      url.searchParams.set("v", ROLES[b.dataset.k].code);
      location.href = url.toString(); // 프로젝트 목록도 다시 거르기 위해 새로 엽니다
    });
    document.body.appendChild(bar);
  }

  document.addEventListener("DOMContentLoaded", () => { apply(current); adminBar(); });
})();
