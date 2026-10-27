/* =========================================
   포트폴리오 PDF 쪽 만들기 (portfolio-pdf.html)
   - 표지 → 프로필 → 이력 → 대표 프로젝트(프로젝트마다 2쪽) → 마지막 쪽
   - 대표 프로젝트: 메인과 같은 규칙 (DB featured 켠 것, 없으면 최신순) 최대 4개
   - About Me · 연락처는 index.html 에 적힌 내용을, SNS 는 DB(sns_links)에서 가져와요
   - 이력 · 프로젝트 정보는 웹과 같은 규칙으로 보여줘요 (진행 상태·기간·교육 시간, '프로젝트 / 나의 참여' 묶음)
   ========================================= */
(function () {
  "use strict";
  const SITE = "https://sua-apply.github.io/portfolio-creative/";
  const MAX_PROJECTS = 4;
  const esc = (s) => window.esc(s);
  const pad2 = (n) => String(n).padStart(2, "0");
  const HEX = /^#[0-9a-f]{3,8}$/i;
  const NOW_YM = (() => { const d = new Date(); return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`; })();

  // index.html 에서 About Me · 기본 정보 · 연락처 읽기
  async function readIndex() {
    try {
      const html = await fetch("index.html").then((r) => r.text());
      const doc = new DOMParser().parseFromString(html, "text/html");
      const facts = [...doc.querySelectorAll(".facts--profile > div")].map((d) => [d.querySelector("dt")?.textContent.trim(), d.querySelector("dd")?.textContent.trim()]);
      return {
        about: [...doc.querySelectorAll(".profile__text .prose p")].map((p) => p.innerHTML.trim()),
        photo: doc.querySelector(".profile__photo")?.getAttribute("src") || "img/profile.jpg",
        facts, mail: doc.querySelector(".contact__mail")?.textContent.trim() || "", sns: window.SNS || [],
        contactTitle: doc.querySelector(".contact__title")?.textContent.trim() || "",
        contactLead: doc.querySelector(".contact__lead")?.textContent.trim() || "",
      };
    } catch (e) {
      return { about: [], photo: "img/profile.jpg", facts: [], mail: "", sns: window.SNS || [], contactTitle: "", contactLead: "" };
    }
  }

  const foot = (label) => `<div class="foot"><span><b>PARK Younghee</b> · Portfolio · ${esc(label)}</span><span class="pg"></span></div>`;
  const head = (num, title, en) => `<header class="ph"><span class="ph__num">${num}</span><h2 class="ph__title">${esc(title)}</h2>${en ? `<span class="ph__en">${esc(en)}</span>` : ""}</header>`;

  /* 1. 표지: 글자만 (특정 프로젝트 이미지를 쓰지 않아요) */
  function cover(R, first, info) {
    const mail = info.mail;
    return `<section class="page page--navy">
      <div class="cover">
        <div class="cover__text">
          <p class="cover__tag"><i></i>PORTFOLIO ${new Date().getFullYear()}</p>
          <h1 class="cover__title">${R.title || "생각을 <em>형태</em>로,<br />형태를 <em>경험</em>으로."}</h1>
          ${R.eyebrow ? `<p class="cover__eyebrow">${esc(R.eyebrow)}</p>` : ""}
          <div class="cover__name"><strong>박영희</strong><span>PARK Younghee</span></div>
          <p class="cover__meta">${mail ? `<a href="mailto:${esc(mail)}">${esc(mail)}</a>` : ""}<a href="${SITE}">${SITE.replace(/^https:\/\//, "").replace(/\/$/, "")}</a></p>
        </div>
        <p class="cover__big" aria-hidden="true">PORT<br />FOLIO</p>
      </div>
    </section>`;
  }

  /* 2. 프로필 + 스킬 */
  function profile(R, info, num) {
    const skills = (R.skills || []).filter((g) => g.items.length);
    return `<section class="page">
      <div class="page__in">
        ${head(num, "Profile", "About Me · Skills")}
        <div class="profile">
          <aside class="profile__side">
            <img class="profile__photo" src="${esc(info.photo)}" alt="" />
            <div class="profile__name"><strong>박영희</strong><span>PARK Younghee</span></div>
            <dl class="facts">${info.facts.filter(([k]) => k && k !== "이름").map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
          </aside>
          <div class="profile__main">
            <div class="about"><p class="k" style="margin-bottom:3mm">About Me</p>${info.about.map((p) => `<p>${p}</p>`).join("")}</div>
            ${skills.length ? `<div><p class="k" style="margin-bottom:3mm">Skills &amp; Tools</p><div class="skills">${skills.map((g) => `
              <div class="skills__col"><h3>${esc(g.title)} <small>${g.items.length}</small></h3>
                <ul>${g.items.map(([label, icon]) => `<li>${icon ? `<img src="img/icons/${esc(icon)}.svg" alt="" />` : ""}${esc(label)}</li>`).join("")}</ul></div>`).join("")}</div></div>` : ""}
          </div>
        </div>
      </div>${foot("Profile")}
    </section>`;
  }

  /* 3. 이력 (비어 있는 칸은 빼요) — 웹과 같은 순서 · 같은 표시
     날짜 아래: 진행 중(재직 중 · 수강 중 · 활동 중, 핑크 글자) + 기간 · 교육 시간(회색) */
  const ongoing = (x) => (typeof x.ongoing === "boolean" ? x.ongoing : !x.end || x.end >= NOW_YM);
  function duration(s, e) {
    if (!s) return "";
    const [sy, sm] = s.split(".").map(Number);
    const [ey, em] = (e || NOW_YM).split(".").map(Number);
    const total = (ey - sy) * 12 + (em - sm) + 1;
    const y = Math.floor(total / 12), m = total % 12;
    return [y ? `${y}년` : "", m ? `${m}개월` : ""].filter(Boolean).join(" ") || "1개월";
  }
  const hours = (h) => (h == null || h === "" ? "" : /^\d+(\.\d+)?$/.test(String(h).trim()) ? `${Number(h).toLocaleString("ko-KR")}시간` : String(h));
  const latest = (k) => (a, b) => (b[k] || NOW_YM).localeCompare(a[k] || NOW_YM);
  function resume(RS, num) {
    if (!RS) return "";
    const range = (s, e) => (!s ? e || "" : `${s} – ${e && !(e > NOW_YM) ? e : e || "현재"}`);
    const r = (date, title, sub, status, len) => ({ date, title, sub, status, len });
    const sorted = (list, k) => [...(list || [])].sort(latest(k));
    const acts = sorted(RS.activities, "start");
    const act = (x) => r(range(x.start, x.end), x.title, x.org, ongoing(x) ? "활동 중" : "", "");
    const blocks = [
      ["학력", sorted(RS.education, "start").map((x) => r(x.end || x.start, x.school, [x.major, x.status].filter(Boolean).join(" · ")))],
      ["경력", sorted(RS.experience, "start").map((x) => r(range(x.start, x.end), x.company, x.role, ongoing(x) ? "재직 중" : "", duration(x.start, ongoing(x) ? NOW_YM : x.end)))],
      ["교육", sorted(RS.training, "start").map((x) => r(range(x.start, x.end), x.title, x.org, ongoing(x) ? "수강 중" : "", hours(x.hours)))],
      ["대외활동", acts.filter((a) => a.type !== "campus").map(act)],
      ["교내활동", acts.filter((a) => a.type === "campus").map(act)],
      ["수상", sorted(RS.awards, "date").map((x) => r(x.date, x.title, x.org))],
      ["어학", sorted(RS.languages, "date").filter((x) => !(x.expires && x.expires < NOW_YM)).map((x) => r(x.date, `${x.test}${x.score ? ` ${x.score}` : ""}`, x.org))],
      ["자격증", sorted(RS.certificates, "date").filter((x) => !x.expired).map((x) => r(x.date, x.name, x.org))],
    ].filter(([, rows]) => rows.length);
    if (!blocks.length) return "";
    return `<section class="page">
      <div class="page__in">
        ${head(num, "Resume", blocks.map(([t]) => t).join(" · "))}
        <div class="resume resume--${Math.min(blocks.length, 3)}">${blocks.map(([t, rows]) => `
          <div class="rblock"><h3>${t} <small>${rows.length}</small></h3>
            ${rows.map((x) => `<div class="rrow"><div class="rrow__d"><time>${esc(x.date)}</time>${x.status || x.len ? `<span class="rrow__m">${x.status ? `<b>${esc(x.status)}</b>` : ""}${x.status && x.len ? " · " : ""}${x.len ? esc(x.len) : ""}</span>` : ""}</div><div><strong>${esc(x.title)}</strong>${x.sub ? `<span>${esc(x.sub)}</span>` : ""}</div></div>`).join("")}
          </div>`).join("")}</div>
      </div>${foot("Resume")}
    </section>`;
  }

  /* 4. 목차 */
  function toc(list, startPage, num) {
    return `<section class="page">
      <div class="page__in">
        ${head(num, "Selected Work", `${list.length} Projects`)}
        <div class="toc" style="--n:${Math.max(3, list.length)}">${list.map((p, i) => `
          <a href="#pj-${i + 1}">
            <span class="toc__img"><img src="${esc(p.thumb)}" alt="" /></span>
            <span class="toc__no">${pad2(i + 1)}</span>
            <strong class="toc__title">${esc(p.title)}</strong>
            <span class="toc__meta">${esc(p.categoryLabel)}${p.date ? ` · ${esc(p.date.slice(0, 4))}` : ""} · ${esc(window.kindLabel(p))}</span>
            <span class="toc__pg">p. ${pad2(startPage + i * 2)}</span>
          </a>`).join("")}</div>
        <p class="toc-note">전체 프로젝트와 작업 과정은 웹에서 볼 수 있어요 → <a href="${SITE}works.html">${SITE.replace(/^https:\/\//, "")}works.html</a></p>
      </div>${foot("Selected Work")}
    </section>`;
  }

  /* 5. 프로젝트 첫 쪽: 결과물이 주인공 (레퍼런스: 왼쪽 짧은 글 + 오른쪽 큰 이미지, 프로젝트 색 배경)
     - 배경색 · 배치는 모든 프로젝트가 같아요 (통일감). 색은 css/pdf.css 의 --pj-bg 하나로 바꿔요
     - 정보는 기간 · 참여 · 도구 세 가지만. 주최 · 역할은 둘째 쪽 위에 있어요 */
  // 도구 → 작은 아이콘 배지 (Adobe처럼 두 글자). 목록에 없는 도구는 글자 칩으로
  const TOOL_BADGES = {
    photoshop: ["Ps", "#001E36", "#31A8FF"], illustrator: ["Ai", "#330000", "#FF9A00"], indesign: ["Id", "#49021F", "#FF3366"],
    "after effects": ["Ae", "#00005B", "#9999FF"], "premiere pro": ["Pr", "#00005B", "#9999FF"], lightroom: ["Lr", "#001E36", "#31A8FF"],
    figma: ["Fg", "#1E1E1E", "#A259FF"], blender: ["Bl", "#1E1E1E", "#F5792A"],
  };
  const toolBadge = (t) => {
    const key = String(t).toLowerCase().replace(/^adobe\s+/, "").trim();
    const b = TOOL_BADGES[key];
    return b ? `<span class="tb" style="background:${b[1]};color:${b[2]}" title="${esc(t)}">${b[0]}</span><span class="tb__name">${esc(t)}</span>`
      : `<span class="tb tb--text">${esc(t)}</span>`;
  };
  function projectA(p, i) {
    const t = window.teamInfo(p);
    const facts = [
      ["기간", esc(p.period || p.date.replace("-", "."))],
      ["참여", esc(t.label) + (t.pct != null ? ` <span class="pct"><i><b style="width:${t.pct}%"></b></i>기여도 ${t.pct}%</span>` : "")],
      ["도구", (p.tools || []).length && `<span class="tools">${p.tools.map(toolBadge).join("")}</span>`],
    ].filter(([, v]) => v);
    const year = p.date ? p.date.slice(0, 4) : "";
    return `<section class="page pj-page" id="pj-${i + 1}">
      <div class="pj-top"><span>${esc([year, p.categoryLabel].filter(Boolean).join("  |  "))}</span><span>PARK Younghee · PORTFOLIO</span></div>
      <div class="pj">
        <div class="pj__info">
          <p class="pj__no">PROJECT ${pad2(i + 1)}</p>
          <h2 class="pj__title">${esc(p.title)}</h2>
          <p class="pj__kind">${esc([p.categoryLabel, window.kindLabel(p)].filter(Boolean).join(" · "))}</p>
          ${p.summary ? `<p class="pj__sum">${esc(p.summary)}</p>` : ""}
          <dl class="pj__facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
          <p class="pj__link">자세한 과정 → <a href="${SITE}project.html?id=${encodeURIComponent(p.id)}">웹에서 보기</a></p>
        </div>
        <figure class="pj__art"><img src="${esc(p.image || p.thumb)}" alt="" /></figure>
      </div>
      <div class="foot"><span></span><span class="pg"></span></div>
    </section>`;
  }

  /* 6. 프로젝트 둘째 쪽: 한눈에 보기 + 핵심 두 가지 */
  function highlights(p) {
    const secs = (p.detail && p.detail.sections) || [];
    const find = (t) => secs.find((s) => s.type === t);
    const boxes = [];
    if ((p.did || []).length) boxes.push(["작업 범위", "What I did", `<ol class="did">${p.did.slice(0, 6).map((d, i) => `<li><b>${pad2(i + 1)}</b>${esc(d)}</li>`).join("")}</ol>`]);
    const pal = find("palette");
    if (pal && (pal.colors || []).length) boxes.push([pal.title || "컬러", "Visual", `<ul class="sw">${pal.colors.filter((c) => HEX.test(c.hex)).slice(0, 8).map((c) => `<li><i style="background:${c.hex}"></i><strong>${esc(c.name)}</strong><code>${esc(c.hex.toUpperCase())}</code></li>`).join("")}</ul>`]);
    const cards = find("cards");
    if (cards && (cards.items || []).length) boxes.push([cards.title || "콘셉트", "Concept", `<ul class="minis">${cards.items.slice(0, 3).map((it) => `<li>${it.kicker ? `<span>${esc(it.kicker)}</span>` : ""}<strong>${esc(it.title)}</strong>${esc(it.desc || "")}</li>`).join("")}</ul>`]);
    const proc = find("process");
    if (proc && (proc.steps || []).length) boxes.push([proc.title || "과정", "Process", `<ol class="steps">${proc.steps.slice(0, 5).map((st, i) => `<li><span>${pad2(i + 1)}</span><strong>${esc(st.title)}</strong><span>${esc(st.desc || "")}</span></li>`).join("")}</ol>`]);
    const cast = find("cast");
    if (cast && (cast.items || []).length) boxes.push([cast.title || "캐릭터", "Characters", `<ul class="cast">${cast.items.slice(0, 5).map((it) => `<li><i style="background:${HEX.test(it.color) ? it.color : "#ddd"}"></i><strong>${esc(it.name)}</strong>${it.sound ? `<em>${esc(it.sound)}</em>` : ""}<small>${esc(it.note || "")}</small></li>`).join("")}</ul>`]);
    const notes = find("notes");
    if (notes && (notes.items || []).length) boxes.push([notes.title || "돌아보며", "Retrospective", `<ul class="notes">${notes.items.slice(0, 2).map((it) => `<li><strong>${esc(it.title)}</strong>${esc(it.desc || "")}</li>`).join("")}</ul>`]);
    return boxes.slice(0, 2);
  }
  function projectB(p, i) {
    const did = (p.did || []).slice(0, 3);
    const glance = [
      ["문제", p.problem ? `<p>${esc(p.problem)}</p>` : ""],
      ["내가 한 일", p.action ? `<p>${esc(p.action)}</p>` : did.length ? `<ul>${did.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>` : ""],
      ["결과", `${p.result ? `<p><strong>${esc(p.result.value)}</strong> ${esc(p.result.label)}</p>` : ""}${p.resultText ? `<p>${esc(p.resultText)}</p>` : ""}`],
    ].filter(([, v]) => v);
    const boxes = highlights(p);
    if (!glance.length && !boxes.length) return "";
    return `<section class="page">
      <div class="page__in">
        ${head(pad2(i + 1), p.title, "At a glance")}
        ${(() => { const m = [["구분", window.kindLabel(p)], ["주최 · 발주", p.client], ["역할", p.role]].filter(([, v]) => v);
          return m.length ? `<dl class="pb-meta">${m.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""; })()}
        ${glance.length ? `<ol class="glance" style="grid-template-columns:repeat(${glance.length},minmax(0,1fr))">${glance.map(([k, v], n) => `<li><span class="glance__no">${pad2(n + 1)}</span><h3>${k}</h3>${v}</li>`).join("")}</ol>` : ""}
        ${boxes.length ? `<div class="hl">${boxes.map(([t, en, body]) => `<div class="hl__box"><h4>${esc(t)}<span class="k">${en}</span></h4>${body}</div>`).join("")}</div>` : ""}
      </div>${foot(p.title)}
    </section>`;
  }

  /* 7. 마지막 쪽 */
  function closing(info) {
    const groups = info.sns.map((g) => ({ title: g.title, items: g.items.filter((s) => s.url) })).filter((g) => g.items.length);
    // 웹 Contact 제목을 그대로: "끝까지 봐 주셔서 감사합니다." → 마지막 단어만 핑크로 한 줄 내려요
    const t = info.contactTitle || "끝까지 봐 주셔서 감사합니다.";
    const m = /^(.*\S)\s+(\S+)$/.exec(t);
    const title = m ? `${esc(m[1])}<br /><em>${esc(m[2])}</em>` : esc(t);
    return `<section class="page page--navy">
      <div class="end">
        <div class="end__l">
          <p class="end__k">CONTACT</p>
          <h2 class="end__title">${title}</h2>
          ${info.contactLead ? `<p class="end__lead">${esc(info.contactLead)}</p>` : ""}
          ${info.mail ? `<a class="end__mail" href="mailto:${esc(info.mail)}">${esc(info.mail)}</a>` : ""}
        </div>
        <div class="end__r">
          <a class="end__web" href="${SITE}"><span>전체 프로젝트와 작업 과정은 웹 포트폴리오에서</span><strong>${SITE.replace(/^https:\/\//, "")}</strong></a>
          ${groups.map((g) => `<div class="end__sns"><h3>${esc(g.title || "SNS")}</h3>${g.items.map((s) => `<a href="${esc(s.url)}"><span>${esc(s.platform)}</span>${esc(s.name)}</a>`).join("")}</div>`).join("")}
        </div>
      </div>
    </section>`;
  }

  async function build() {
    await window.PROJECTS_READY;
    const info = await readIndex();
    const R = window.ROLE_DATA || {};
    const sorted = [...(window.PROJECTS || [])].sort((a, b) => b.date.localeCompare(a.date));
    let pick = sorted.filter((p) => p.featured);
    if (!pick.length) pick = sorted;
    pick = pick.slice(0, MAX_PROJECTS);

    let n = 0;
    const num = () => pad2(++n);
    const pages = [cover(R, pick[0], info), profile(R, info, num())];
    const rs = resume(window.RESUME, pad2(n + 1)); if (rs) { n += 1; pages.push(rs); }
    // 목차(Selected Work) 쪽 없이 이력 다음에 바로 프로젝트로 넘어가요. 다시 넣으려면: pages.push(toc(pick, pages.length + 2, num()))
    pick.forEach((p, i) => { pages.push(projectA(p, i)); const b = projectB(p, i); if (b) pages.push(b); });
    pages.push(closing(info));
    const book = document.getElementById("book");
    book.innerHTML = pages.join("");
    // 쪽 번호
    const all = [...book.querySelectorAll(".page")];
    all.forEach((pg, i) => { const el = pg.querySelector(".pg"); if (el) el.textContent = `${pad2(i + 1)} / ${pad2(all.length)}`; });
    // 목차의 쪽 번호를 실제 위치로 다시 맞추기 (둘째 쪽이 없는 프로젝트가 있을 때)
    book.querySelectorAll(".toc a").forEach((a) => {
      const target = book.querySelector(a.getAttribute("href"));
      const pg = a.querySelector(".toc__pg");
      if (target && pg) pg.textContent = `p. ${pad2(all.indexOf(target) + 1)}`;
    });
    // 이미지를 다 불러온 뒤 '준비 완료' 표시 (PDF 만드는 스크립트가 기다려요)
    await Promise.all([...book.querySelectorAll("img")].map((im) => (im.complete ? 0 : new Promise((ok) => { im.onload = im.onerror = ok; }))));
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    document.documentElement.dataset.pdfReady = "1";
  }
  build();
})();
