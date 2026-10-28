/* =========================================
   포트폴리오 PDF 쪽 만들기 (portfolio-pdf.html)
   - 표지 → 프로필 → 이력 → 대표 프로젝트(표지 1 · 정리 최대 3 · 목업 1장 이상) → 마지막 쪽
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
      ["학력", [...(RS.education || [])].sort((a, b) => (b.end || b.start || "").localeCompare(a.end || a.start || "")).map((x) => r([x.start, x.end].filter(Boolean).join(" – "), x.school, [x.major, x.status].filter(Boolean).join(" · ")))],
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

  /* 6. 프로젝트 정리 쪽 (최대 3장) — 1) 개요  2) 기획  3) 과정 · 비주얼
     프로젝트 한 개 = 표지 1장 → 정리 최대 3장 → 목업 1장 이상 */
  const sectionsOf = (p) => (p.detail && p.detail.sections) || [];
  const BOX = {
    cards: (s) => [s.title || "콘셉트", s.label || "Concept", `<ul class="minis">${(s.items || []).slice(0, 3).map((it) => `<li>${it.kicker ? `<span>${esc(it.kicker)}</span>` : ""}<strong>${esc(it.title)}</strong>${esc(it.desc || "")}</li>`).join("")}</ul>`],
    target: (s) => { const pe = s.persona || {}; return [s.title || "타깃", s.label || "Target", `
      ${pe.name ? `<div class="persona">${pe.kicker ? `<span>${esc(pe.kicker)}</span>` : ""}<strong>${esc(pe.name)}</strong>${pe.desc ? `<p>${esc(pe.desc)}</p>` : ""}</div>` : ""}
      ${(s.decisions || []).length ? `<ul class="decide">${s.decisions.slice(0, 4).map(([a, b]) => `<li><span>${esc(a)}</span><b>→</b><strong>${esc(b)}</strong></li>`).join("")}</ul>` : ""}`]; },
    cast: (s) => [s.title || "캐릭터", s.label || "Characters", `<ul class="cast">${(s.items || []).slice(0, 6).map((it) => `<li><i style="background:${HEX.test(it.color) ? it.color : "#ddd"}"></i><strong>${esc(it.name)}</strong>${it.sound ? `<em>${esc(it.sound)}</em>` : ""}<small>${esc(it.note || "")}</small></li>`).join("")}</ul>`],
    scenario: (s) => [s.title || "시나리오", s.label || "Scenario", `<ol class="did">${(s.scenes || []).filter((sc) => sc.key).slice(0, 6).map((sc, n) => `<li><b>${pad2(n + 1)}</b>${esc(sc.title)}${sc.desc ? ` — ${esc(sc.desc)}` : ""}</li>`).join("")}</ol>`],
    palette: (s) => [s.title || "컬러", s.label || "Visual", `<ul class="sw">${(s.colors || []).filter((c) => HEX.test(c.hex)).slice(0, 8).map((c) => `<li><i style="background:${c.hex}"></i><strong>${esc(c.name)}</strong><code>${esc(c.hex.toUpperCase())}</code></li>`).join("")}</ul>`],
    process: (s) => [s.title || "과정", s.label || "Process", `<ol class="steps">${(s.steps || []).slice(0, 5).map((st, n) => `<li><span>${pad2(n + 1)}</span><strong>${esc(st.title)}</strong><span>${esc(st.desc || "")}</span></li>`).join("")}</ol>`],
    notes: (s) => [s.title || "돌아보며", s.label || "Retrospective", `<ul class="notes">${(s.items || []).slice(0, 2).map((it) => `<li><strong>${esc(it.title)}</strong>${esc(it.desc || "")}</li>`).join("")}</ul>`],
  };
  const boxes = (list) => `<div class="hl" style="grid-template-columns:repeat(${list.length},minmax(0,1fr))">${list.map(([t, en, body]) => `<div class="hl__box"><h4>${esc(t)}<span class="k">${esc(en)}</span></h4>${body}</div>`).join("")}</div>`;
  const page = (p, i, en, body) => `<section class="page">
      <div class="page__in">${head(pad2(i + 1), p.title, en)}${body}</div>${foot(p.title)}
    </section>`;
  /* 정리 쪽은 '블록'을 두 단에 차례로 채워요. 한 단이 차면 오른쪽 단 → 다음 쪽 (내용이 적으면 1~2장, 많아도 최대 3장)
     레퍼런스처럼 쪽마다 빈 곳 없이: 개요 · 문제/한 일/결과 · 작업 범위 · 콘셉트 · 타깃 · 캐릭터 · 컬러 · 과정 · 돌아보며 */
  const MAX_OVERVIEW = 3;
  const lum = (hex) => {
    let h = hex.replace("#", ""); if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const [r, g, b] = [0, 2, 4].map((k) => parseInt(h.slice(k, k + 2), 16) / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const blk = (label, title, body) => `<div class="blk"><p class="blk__k">${esc(label)}</p>${title ? `<h4 class="blk__t">${esc(title)}</h4>` : ""}${body}</div>`;
  function overviewBlocks(p) {
    const secs = sectionsOf(p);
    const out = [];
    const meta = [["구분", window.kindLabel(p)], ["주최 · 발주", p.client], ["역할", p.role]].filter(([, v]) => v);
    const intro = secs.find((s) => s.type === "text");
    if (meta.length || intro) out.push(blk(intro ? intro.label || "Overview" : "Overview", intro && intro.title, `
      ${intro ? (intro.body || []).slice(0, 2).map((b) => `<p class="blk__p">${esc(b)}</p>`).join("") : ""}
      ${meta.length ? `<dl class="pb-meta">${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${k === "역할" ? window.listHTML(v) : esc(v)}</dd></div>`).join("")}</dl>` : ""}`));
    const glance = [["문제", p.problem], ["내가 한 일", p.action], ["결과", [p.result && `${p.result.value} ${p.result.label || ""}`.trim(), p.resultText].filter(Boolean).join(" — ")]].filter(([, v]) => v);
    if (glance.length) out.push(blk("At a glance", "", `<dl class="gl">${glance.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`));
    if ((p.did || []).length) out.push(blk("What I did", "작업 범위", `<ol class="did">${p.did.slice(0, 6).map((d, n) => `<li><b>${pad2(n + 1)}</b>${esc(d)}</li>`).join("")}</ol>`));
    secs.forEach((s) => {
      if (s.type === "palette" && (s.colors || []).length) {
        const cs = s.colors.filter((c) => HEX.test(c.hex)).slice(0, 8);
        out.push(blk(s.label || "Color", s.title, `<ul class="pal pal--${cs.length > 4 ? "2" : "1"}">${cs.map((c) => `<li style="background:${c.hex};color:${lum(c.hex) > 0.6 ? "#252A34" : "#fff"}"><strong>${esc(c.name)}</strong><code>${esc(c.hex.toUpperCase())}</code></li>`).join("")}</ul>
          ${(s.fonts || []).length ? `<ul class="fonts">${s.fonts.map((f) => `<li><strong>${esc(f.sample || "")}</strong><span>${esc(f.note || "")}</span></li>`).join("")}</ul>` : ""}`));
      } else if (BOX[s.type] && s.type !== "palette") {
        const [t, en, body] = BOX[s.type](s);
        out.push(blk(en, t, body));
      }
    });
    return out;
  }
  // 실제 높이를 재면서 쪽에 채워 넣기 (브라우저에서 글꼴을 불러온 뒤 실행)
  function flowOverview(p, i, marker, tight) {
    const blocks = overviewBlocks(p);
    let after = marker, cols = [], made = 0;
    const made_ = [];
    const newPage = () => {
      const sec = document.createElement("section");
      sec.className = `page${tight === true ? " ov-tight" : ""}`;
      made_.push(sec);
      sec.innerHTML = `<div class="page__in">${head(pad2(i + 1), p.title, "Overview")}<div class="ov"><div class="ov__col"></div><div class="ov__col"></div></div></div>${foot(p.title)}`;
      after.after(sec); after = sec; made += 1;
      cols = [...sec.querySelectorAll(".ov__col")];
    };
    const fits = (col, el) => { col.appendChild(el); if (col.scrollHeight <= col.clientHeight + 1) return true; el.remove(); return false; };
    for (const html of blocks) {
      const tmp = document.createElement("div"); tmp.innerHTML = html.trim();
      const el = tmp.firstElementChild;
      // 지금 쪽의 단 중 들어가는 첫 자리에 (왼쪽 단에 남은 공간도 채워요). 없으면 다음 쪽
      if (cols.length && cols.some((c) => fits(c, el))) continue;
      if (made >= MAX_OVERVIEW) break;
      newPage();
      cols[0].appendChild(el);   // 빈 단에는 길어도 넣어요
    }
    // 마지막 쪽에 블록이 1개뿐이면(빈 곳이 많은 쪽) 글자 · 간격을 조금 줄여서 한 번 더 채워 봐요
    const last = made_[made_.length - 1];
    if (tight === undefined && made_.length > 1 && last && last.querySelectorAll(".blk").length <= 1) {
      const before = made_.length;
      made_.forEach((pg) => pg.remove());
      const again = flowOverview(p, i, marker, true);
      if (again.length < before) { marker.remove(); return again; }
      again.forEach((pg) => pg.remove());
      return flowOverview(p, i, marker, "keep");
    }
    if (tight !== true) marker.remove();
    return made_;
  }

  /* 7. 목업 쪽 (1장 이상) — 상세의 mockup · gallery 이미지. 섹션 하나 = 한 쪽 */
  function mockupPages(p, i) {
    const pages = sectionsOf(p).flatMap((s) => {
      const imgs = s.type === "mockup" ? (s.image ? [{ image: s.image, title: s.caption }] : [])
        : s.type === "gallery" ? (s.items || []).filter((it) => it.image) : [];
      if (!imgs.length) return [];
      const n = Math.min(imgs.length, 4);
      return [page(p, i, s.label || "Mockup", `
        ${s.title || s.caption ? `<p class="mk__title">${esc(s.title || s.caption)}</p>` : ""}
        <div class="mk mk--${n}">${imgs.slice(0, 4).map((it) => `<figure><img src="${esc(it.image)}" alt="" />${it.title ? `<figcaption>${esc(it.title)}${it.desc ? ` · ${esc(it.desc)}` : ""}</figcaption>` : ""}</figure>`).join("")}</div>`)];
    });
    // 목업 이미지가 하나도 없으면 '준비 중' 한 장 (DB 상세 mockup · gallery 에 이미지를 넣으면 바뀌어요)
    return pages.length ? pages : [page(p, i, "Mockup", `<div class="mk mk--empty"><p>목업 이미지 준비 중</p></div>`)];
  }

  /* 8. 마지막 쪽 */
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
    // 프로젝트 하나: 표지 → 정리(최대 3장) → 목업(1장 이상)
    pick.forEach((p, i) => { pages.push(projectA(p, i), `<div class="ov-marker" data-i="${i}"></div>`, ...mockupPages(p, i)); });
    pages.push(closing(info));
    const book = document.getElementById("book");
    book.innerHTML = pages.join("");
    // 정리 쪽: 글꼴을 불러온 뒤 실제 높이로 채워요
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
    book.querySelectorAll(".ov-marker").forEach((m) => flowOverview(pick[+m.dataset.i], +m.dataset.i, m));
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
