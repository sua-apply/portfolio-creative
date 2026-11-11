/* =========================================
   프로젝트 상세(project.html?id=프로젝트id)
   - 위: 분야 · 제목 · 한 줄 요약 · 역할/기간/구분/도구 · 대표 이미지
   - 가운데: DB projects.detail.sections 를 순서대로 (번호는 자동)
       type: text · target · cards · cast · scenario · mockup · gallery · palette · process · notes · video
     detail 이 비어 있으면 description · problem · action · did 로 대신 채워요
   - 아래: 결과 · 태그 · 작품 링크 · 이전/다음 프로젝트
   ========================================= */
(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const esc = window.esc;
  const pad2 = (n) => String(n).padStart(2, "0");
  const fmtDate = (d) => (d || "").replace("-", ".");
  const HEX = /^#[0-9a-f]{3,8}$/i;
  const kindLabel = (p) => window.kindLabel(p);

  // Vision · Mission · Essence 가 있는 카드 묶음 → 브랜드 전략 모양 (없으면 null → 보통 카드)
  function strategy(s) {
    const items = s.items || [];
    const find = (k) => items.find((it) => new RegExp(`^${k}$`, "i").test((it.kicker || "").trim()));
    const vis = find("vision"), mis = find("mission"), ess = find("essence");
    if (!vis || !mis) return null;
    // "Elegant 우아하게 · Magical 신비롭게" → [["Elegant","우아하게"], …] (영문이 없으면 그대로)
    const vals = ess ? String(ess.title || "").split(/\s*[·,|]\s*/).filter(Boolean).map((v) => {
      const m = /^([A-Za-z][A-Za-z\s-]*?)\s+(.+)$/.exec(v.trim());
      return m ? [m[2], m[1]] : [v.trim(), ""];
    }) : [];
    return `${paras(s.body)}
      <div class="strat">
        <div class="strat__head"><p class="strat__k">Vision<span>비전</span></p><p class="strat__vision">“${esc(vis.title)}”</p></div>
        <div class="strat__cards">
          <div class="strat__card"><p class="strat__k">Mission<span>미션</span></p><p class="strat__mission">${esc(mis.title)}</p></div>
          ${vals.length ? `<div class="strat__card"><p class="strat__k">Essence<span>핵심 가치</span></p><ul class="strat__ess">${vals.map(([ko, en]) => `<li${en ? ` title="${esc(en)}"` : ""}><b>${esc(ko)}</b></li>`).join("")}</ul></div>` : ""}
        </div>
      </div>`;
  }
  const paras = (b) => (Array.isArray(b) ? b : b ? [b] : []).filter(Boolean).map((t) => `<p>${esc(t)}</p>`).join("");
  const minis = (items) => `<ul class="minis">${(items || []).map((it) => `
      <li>${it.kicker ? `<span class="minis__k">${esc(it.kicker)}</span>` : ""}<strong>${esc(it.title)}</strong>${it.desc ? `<p>${esc(it.desc)}</p>` : ""}</li>`).join("")}</ul>`;
  const ytId = (u) => {
    const s = String(u).trim();
    const m = /(?:youtu\.be\/|[?&]v=|\/(?:embed|shorts|live)\/)([\w-]{11})(?![\w-])/.exec(s) || /^([\w-]{11})$/.exec(s);
    return m ? m[1] : "";
  };
  const img = (src, alt) =>(src ? `<img src="${esc(src)}" alt="${esc(alt || "")}" loading="lazy" />` : "");

  /* 섹션 종류별 모양 */
  const SECTION = {
    text: (s) => paras(s.body),
    target: (s) => {
      const pc = s.persona || {};
      const persona = pc.name ? `<div class="persona">
          ${pc.kicker ? `<span class="persona__k">${esc(pc.kicker)}</span>` : ""}
          <strong>${esc(pc.name)}</strong>
          ${pc.desc ? `<p>${esc(pc.desc)}</p>` : ""}
          ${(pc.chips || []).length ? `<ul class="chips">${pc.chips.map((c) => `<li class="chip">${esc(c)}</li>`).join("")}</ul>` : ""}
          ${pc.note ? `<span class="persona__note">${esc(pc.note)}</span>` : ""}
        </div>` : "";
      const dec = (s.decisions || []).length ? `<table class="dtable">
          <thead><tr><th scope="col">발견한 특성</th><th scope="col">그래서 이렇게 설계</th></tr></thead>
          <tbody>${s.decisions.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join("")}</tbody>
        </table>` : "";
      return paras(s.body) + persona + dec;
    },
    // 브랜드 전략(Vision · Mission · Essence 카드)은 위계를 나눠서: 비전은 크게, 미션은 소제목처럼, 핵심 가치는 동그라미 한 줄
    // sub: { title, items } 를 주면 카드 아래에 작은 제목과 함께 두 번째 묶음(예: 연출 원칙)이, note 를 주면 맺음 상자(예: 리서치 결과)가 붙어요
    cards: (s) => strategy(s) || `${paras(s.body)}${minis(s.items)}${s.sub && (s.sub.items || []).length
      ? `<h3 class="psub">${esc(s.sub.title || "")}</h3>${minis(s.sub.items)}` : ""}${s.note
      ? `<p class="note-box">${s.noteTitle ? `<strong>${esc(s.noteTitle)}</strong> ` : ""}${esc(s.note)}</p>` : ""}`,
    // 돌아보며: 아쉬운 점 · 배운 점 · 개선 방향 … desc 가 목록(배열)이면 짧은 항목으로 나열
    notes: (s) => `${paras(s.body)}<ul class="minis minis--notes${(s.items || []).length >= 3 ? " minis--3" : " minis--2"}">${(s.items || []).map((it) => `
      <li><strong>${esc(it.title)}</strong>${Array.isArray(it.desc)
        ? `<ul class="pts">${it.desc.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>`
        : it.desc ? `<p>${esc(it.desc)}</p>` : ""}</li>`).join("")}</ul>`,
    cast: (s) => `${paras(s.body)}<ul class="cast">${(s.items || []).map((it) => `
      <li><i style="background:${HEX.test(it.color) ? it.color : "var(--line)"}" aria-hidden="true"></i>
        <span><strong>${esc(it.name)}</strong>${it.sound ? ` <em>${esc(it.sound)}</em>` : ""}
        <small>${esc([it.note, it.color].filter(Boolean).join(" · "))}</small></span></li>`).join("")}</ul>`,
    scenario: (s) => {
      const arc = s.arc || [];
      const scenes = s.scenes || [];
      return `${paras(s.body)}
        ${arc.length ? `<div class="arc" style="grid-template-columns:${arc.map((a) => `${Number(a.span) || 1}fr`).join(" ")}">${arc.map((a) => `<span${a.key ? ' class="is-key"' : ""}>${esc(a.label)}</span>`).join("")}</div>` : ""}
        <ol class="scenes">${scenes.map((sc, i) => `<li${sc.key ? ' class="is-key"' : ""}>
          ${sc.image ? img(sc.image, sc.title) : ""}<span class="scenes__no">${pad2(i + 1)}</span><strong>${esc(sc.title)}</strong>${sc.desc ? `<span>${esc(sc.desc)}</span>` : ""}</li>`).join("")}</ol>
        ${scenes.some((x) => x.key) ? `<p class="hint">색 테두리 = 연출 포인트 장면</p>` : ""}`;
    },
    // 목업: 전용 이미지가 없으면 표지를 또 보여주지 않고 '준비 중' 자리만
    mockup: (s, p) => (s.image
      ? `<figure class="fig fig--mockup">${img(s.image, s.caption || p.title)}</figure>`
      : `<figure class="fig is-empty"><span class="fig__ph fig__ph--wide"><span>목업 이미지 준비 중</span></span></figure>`),
    // 이미지 묶음: 장 수에 맞춰 배치 (1장 크게 · 2장 나란히 · 3장 위 1 + 아래 2 · 4장 벤토 · 5장 이상 2열 바둑판)
    gallery: (s) => `${paras(s.body)}<div class="gallery gallery--${Math.min((s.items || []).length, 5)}">${(s.items || []).map((it) => `
      <figure class="fig${it.image ? "" : " is-empty"}">${it.image ? img(it.image, it.title) : `<span class="fig__ph"><span>이미지 준비 중</span></span>`}
        <figcaption><strong>${esc(it.title)}</strong>${it.desc ? ` ${esc(it.desc)}` : ""}</figcaption></figure>`).join("")}</div>`,
    palette: (s) => `${paras(s.body)}
      ${(s.fonts || []).length ? `<h3 class="psub">컬러</h3>` : ""}
      <ul class="swatches">${(s.colors || []).filter((c) => HEX.test(c.hex)).map((c) => `
        <li><i style="background:${c.hex}" aria-hidden="true"></i><strong>${esc(c.name)}</strong><code>${esc(c.hex.toUpperCase())}</code>${c.desc ? `<small>${esc(c.desc)}</small>` : ""}</li>`).join("")}</ul>
      ${(s.fonts || []).length ? `<h3 class="psub">서체</h3><ul class="fonts">${s.fonts.map((f) => `
        <li><span class="fonts__sample${f.style === "display" ? " is-display" : ""}">${esc(f.sample).replace(/\n/g, "<br />")}</span><small>${esc(f.note || "")}</small></li>`).join("")}</ul>` : ""}`,
    // 영상: 유튜브 주소(youtu.be/… · watch?v=… · shorts/…)나 영상 ID 만 받아요. 다른 주소는 링크로만 보여요
    video: (s, p) => {
      const id = ytId(s.youtube || s.url || "");
      const box = id
        ? `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0" title="${esc(s.caption || p.title)} 영상" loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
          <p class="video__link"><a href="https://youtu.be/${id}" target="_blank" rel="noopener">YouTube에서 보기 ↗</a></p>`
        : `<figure class="fig is-empty"><span class="fig__ph fig__ph--wide"><span>영상 준비 중</span></span></figure>`;
      return `${paras(s.body)}${box}${s.caption ? `<p class="hint">${esc(s.caption)}</p>` : ""}`;
    },
    process: (s) => `${paras(s.body)}
      <ol class="steps">${(s.steps || []).map((st, i) => `<li><span class="steps__no">${pad2(i + 1)}</span><strong>${esc(st.title)}</strong>${st.desc ? `<span>${esc(st.desc)}</span>` : ""}</li>`).join("")}</ol>
      ${s.note ? `<p class="note-box">${s.noteTitle ? `<strong>${esc(s.noteTitle)}</strong> ` : ""}${esc(s.note)}</p>` : ""}`,
  };

  function sectionsOf(p) {
    // draft: true 인 섹션은 준비만 해 두고 화면에는 안 보여요 (예: 아직 비공개인 영상)
    let secs = ((p.detail && p.detail.sections) || []).filter((s) => SECTION[s.type] && !s.draft);
    if (!secs.length) {
      secs = [
        { type: "text", label: "Overview", title: "개요", body: [p.desc] },
        { type: "text", label: "Problem", title: "풀어야 했던 문제", body: [p.problem] },
        { type: "text", label: "Approach", title: "해결 방법", body: [p.action] },
        { type: "process", label: "What I did", title: "맡은 일", steps: (p.did || []).map((d) => ({ title: d })) },
      ].filter((s) => (s.body || []).some(Boolean) || (s.steps || []).length);
    }
    if (p.resultText || p.result) secs.push({ type: "_result", label: "Result", title: "결과" });
    return secs;
  }

  // 참여: "팀 3인 · 기여도 50%" (기여도는 막대와 함께)
  const team = (p) => window.teamInfo(p);

  function render(p, prev, next, seq) {
    document.title = `${p.title} | 박수아 Portfolio`;
    // 위쪽 정보: 비슷한 것끼리 두 줄로 — 프로젝트 정보 / 나의 참여
    const has = ([, v]) => (typeof v === "object" ? v.label || v.pct != null : v);
    const factGroups = [
      ["프로젝트", [["기간", p.period || fmtDate(p.date)], ["구분", kindLabel(p)], ["주최 · 발주", p.client]].filter(has)],
      ["나의 참여", [["참여", team(p)], ["역할", p.role], ["도구", (p.tools || []).join(", ")]].filter(has)],
    ].filter(([, list]) => list.length);
    let n = 0;
    const secs = sectionsOf(p).map((s) => {
      n += 1;
      const body = s.type === "_result"
        ? `${p.result ? `<p class="result"><strong>${esc(p.result.value)}</strong>${esc(p.result.label)}</p>` : ""}${paras(p.resultText)}`
        : SECTION[s.type](s, p);
      return `<section class="psec" id="ps-${n}" aria-labelledby="pt-${n}">
          <header class="psec__head"><span class="psec__num">${pad2(n)}</span><span class="psec__label">${esc(s.label || "")}</span></header>
          <div class="psec__body">
            ${(s.title || s.caption) ? `<h2 class="psec__title" id="pt-${n}">${esc(s.title || s.caption)}</h2>` : `<h2 class="sr-only" id="pt-${n}">${esc(s.label || "")}</h2>`}
            ${body}
          </div>
        </section>`;
    }).join("");
    const link = (q, label, cls) => (q ? `<a class="pnav__a ${cls}" href="${esc(window.keepLink(`project.html?id=${encodeURIComponent(q.id)}`))}">
        <span class="pnav__img"><img src="${esc(q.thumb)}" alt="" loading="lazy" /></span>
        <span class="pnav__txt"><span>${label}</span><strong>${esc(q.title)}</strong><em>${esc(q.categoryLabel)}</em></span></a>` : `<span class="pnav__a pnav__a--none"></span>`);

    // 한눈에 보기: 문제 → 내가 한 일 → 결과 (인사담당자가 여기까지만 봐도 되게)
    const did = (p.did || []).slice(0, 3);
    const glance = [
      ["문제", p.problem ? `<p>${esc(p.problem)}</p>` : ""],
      ["내가 한 일", p.action ? `<p>${esc(p.action)}</p>` : did.length ? `<ul>${did.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>` : ""],
      ["결과", p.result ? `<p class="glance__num"><strong>${esc(p.result.value)}</strong>${esc(p.result.label)}</p>${p.resultText ? `<p>${esc(p.resultText)}</p>` : ""}` : p.resultText ? `<p>${esc(p.resultText)}</p>` : ""],
    ].filter(([, v]) => v);
    const tocItems = sectionsOf(p).map((sec, i) => `<li><a href="#ps-${i + 1}"><span>${pad2(i + 1)}</span>${esc(sec.label || "")}</a></li>`).join("");

    $("#project").innerHTML = `
      <section class="phero">
        <div class="wrap">
          <a class="back back--light js-back" href="${esc(window.keepLink("works.html"))}">← 프로젝트 목록</a>
          <p class="phero__meta">${esc(p.categoryLabel)}${p.date ? ` · ${esc(fmtDate(p.date))}` : ""}</p>
          <h1 class="phero__title">${esc(p.title)}</h1>
          ${p.summary ? `<p class="phero__lead">${esc(p.summary)}</p>` : ""}
          <div class="phero__facts">${factGroups.map(([g, list]) => `
            <div class="phero__group"><p class="phero__gk">${g}</p>
              <dl>${list.map(([k, v]) => `<div><dt>${k}</dt><dd>${typeof v === "object"
                ? `${esc(v.label)}${v.pct != null ? `<span class="phero__pct" aria-label="기여도 ${v.pct}%"><i><b style="width:${v.pct}%"></b></i>기여도 ${v.pct}%</span>` : ""}`
                : k === "역할" ? window.listHTML(v) : k === "도구" ? (p.tools || []).map((t) => window.toolHTML(t, 18)).join("") : esc(v)}</dd></div>`).join("")}</dl></div>`).join("")}</div>
          ${p.link && !p.youtube ? `<a class="btn" href="${esc(p.link)}" target="_blank" rel="noopener">작품 보러 가기 ↗</a>` : ""}
        </div>
      </section>
      <div class="wrap">
        ${p.image ? `<figure class="pcover${p.youtube ? " pcover--video" : ""}">${img(p.image, p.title)}${p.youtube
          ? `<button type="button" class="pcover__play" data-yt="${esc(p.youtube)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 6.5v11l9-5.5z" fill="currentColor"/></svg><span class="sr-only">영상 재생</span></button>` : ""}</figure>` : ""}
        ${glance.length ? `<section class="glance" aria-labelledby="glanceTitle">
          <h2 class="glance__title" id="glanceTitle">한눈에 보기</h2>
          <ol class="glance__list">${glance.map(([k, v], i) => `<li><span class="glance__no">${pad2(i + 1)}</span><h3>${k}</h3>${v}</li>`).join("")}</ol>
        </section>` : ""}
        <div class="pbody">
          <nav class="ptoc" aria-label="이 프로젝트의 구성"><p>Contents</p><ol>${tocItems}</ol></nav>
          <div class="pbody__main">${secs}</div>
        </div>
        <nav class="pnav" id="pnav" aria-label="다른 프로젝트">${link(prev, "← 이전 프로젝트", "pnav__a--prev")}${link(next, "다음 프로젝트 →", "pnav__a--next")}</nav>
      </div>
      <div class="ptop" id="ptop">
        <button type="button" class="ptop__btn" id="qtocBtn" aria-expanded="false" aria-controls="qtoc">
          <span class="ptop__num" id="ptopNum"></span><span class="ptop__name" id="ptopName">Contents</span>
          <span class="ptop__caret" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>
        </button>
        <div class="qtoc" id="qtoc" role="dialog" aria-label="이 프로젝트의 구성" hidden><p class="qtoc__title">Contents</p><ol>${tocItems}</ol></div>
      </div>
      <nav class="qbar" id="qbar" aria-label="빠른 이동">
        <a class="qbar__back js-back" href="${esc(window.keepLink("works.html"))}"><span aria-hidden="true">←</span> 목록</a>
        <span class="qbar__sep" aria-hidden="true"></span>
        ${prev ? `<a class="qbar__btn" href="${esc(window.keepLink(`project.html?id=${encodeURIComponent(prev.id)}`))}" aria-label="이전 프로젝트: ${esc(prev.title)}" title="이전 (←)"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></a>` : `<span class="qbar__btn is-off" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></span>`}
        <span class="qbar__pos" title="${esc(seq.label)} 프로젝트 중 ${seq.i + 1}번째" aria-label="${esc(seq.label)} ${seq.n}개 중 ${seq.i + 1}번째"><b>${pad2(seq.i + 1)}</b> / ${pad2(seq.n)}</span>
        ${next ? `<a class="qbar__btn" href="${esc(window.keepLink(`project.html?id=${encodeURIComponent(next.id)}`))}" aria-label="다음 프로젝트: ${esc(next.title)}" title="다음 (→)"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></a>` : `<span class="qbar__btn is-off" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></span>`}
      </nav>`;
    tocSpy();
    quickNav(prev, next);
    // 영상 보기: 누르면 대표 이미지 자리에서 유튜브 영상이 바로 재생돼요 (페이지를 떠나지 않아요)
    // 영상이 있는 대표 이미지는 '크게 보기' 대신 어디를 눌러도 영상 재생 (Enter · Space 도)
    const play = document.querySelector(".pcover__play");
    const vfig = play && play.closest(".pcover");
    if (vfig) vfig.addEventListener("click", (e) => { if (e.target !== play && !play.contains(e.target)) play.click(); });
    if (play) play.addEventListener("click", () => {
      const fig = play.closest(".pcover");
      fig.classList.add("is-playing");
      fig.innerHTML = `<div class="pcover__video"><iframe src="https://www.youtube-nocookie.com/embed/${play.dataset.yt}?autoplay=1&rel=0&playsinline=1" title="${esc(p.title)} 영상" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>`;
    });
    viewer();
  }

  /* 빠른 이동
     - 아래 떠 있는 막대: 머리 영역을 지나면 나타나고, 맨 아래 이전 · 다음 카드가 보이면 숨어요
     - 키보드: ← 이전 · → 다음 · Esc 목록
     - '목록': 목록에서 왔으면 뒤로 가기(보던 자리 그대로), 아니면 목록 페이지로 */
  function quickNav(prev, next) {
    const bar = $("#qbar"), hero = $(".phero"), pnav = $("#pnav");
    let pastHero = false, atEnd = false;
    // 휴대폰 · 태블릿: 위쪽 '지금 섹션' 줄 → 누르면 목차가 아래로 펼쳐져요
    const ptop = $("#ptop"), qtoc = $("#qtoc"), qBtn = $("#qtocBtn"), head = $(".head");
    const place = () => { ptop.style.top = `${head ? Math.max(0, head.getBoundingClientRect().bottom) : 0}px`; };
    const openToc = (open) => {
      qtoc.hidden = !open; qBtn.setAttribute("aria-expanded", String(open)); ptop.classList.toggle("is-open", open);
      if (open) { ptop.classList.remove("is-hide"); (qtoc.querySelector("a.is-on") || qtoc.querySelector("a"))?.focus(); }
    };
    // 아래로 읽을 때는 숨고, 위로 올리면 다시 나타나요
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      if (qtoc.hidden) { if (y > lastY + 6) ptop.classList.add("is-hide"); else if (y < lastY - 6) ptop.classList.remove("is-hide"); }
      if (Math.abs(y - lastY) > 6) lastY = y;
      place();
    }, { passive: true });
    window.addEventListener("resize", place);
    place();
    qBtn.addEventListener("click", () => openToc(qtoc.hidden));
    qtoc.addEventListener("click", (e) => { if (e.target.closest("a")) openToc(false); });
    document.addEventListener("click", (e) => { if (!qtoc.hidden && !qtoc.contains(e.target) && !qBtn.contains(e.target)) openToc(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !qtoc.hidden) { e.stopImmediatePropagation(); openToc(false); qBtn.focus(); } }, true);
    const show = () => {
      bar.classList.toggle("is-on", pastHero && !atEnd);
      ptop.classList.toggle("is-on", pastHero);
      if (!pastHero && !qtoc.hidden) openToc(false);
    };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; show(); }).observe(hero);
      new IntersectionObserver(([e]) => { atEnd = e.isIntersecting; show(); }).observe(pnav);
    }
    const toList = (e) => {
      try { sessionStorage.setItem("pf.back", "1"); } catch (err) { /* 무시 */ }
      let fromList = false;
      try { fromList = !!document.referrer && new URL(document.referrer).pathname.endsWith("works.html"); } catch (err) { fromList = false; }
      if (fromList && history.length > 1) { e && e.preventDefault(); history.back(); }
    };
    document.querySelectorAll(".js-back").forEach((a) => a.addEventListener("click", toList));
    const go = (q) => { if (q) location.href = window.keepLink(`project.html?id=${encodeURIComponent(q.id)}`); };
    document.addEventListener("keydown", (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || /input|textarea|select/i.test(e.target.tagName)) return;
      if (document.body.classList.contains("is-viewing")) return;   // 크게 보기 중에는 사진 넘기기로 써요
      if (e.key === "ArrowLeft") go(prev);
      else if (e.key === "ArrowRight") go(next);
      else if (e.key === "Escape") { const a = $(".qbar__back"); toList(null); location.href = a.href; }
    });
    if (next && next.thumb) { const im = new Image(); im.src = next.thumb; }   // 다음 이미지를 미리 받아 둬요
  }

  /* 이미지 크게 보기 (대표 이미지 · 목업 · 펼침면 · 장면)
     - 이미지를 누르면 화면 가득 보여요. 여러 장이면 ‹ › (또는 키보드 ← →, 휴대폰은 옆으로 밀기)로 넘겨요
     - 닫기: ✕, 바깥 누르기, Esc */
  function viewer() {
    const imgs = [...document.querySelectorAll(".pcover:not(.pcover--video) img, .psec .fig img, .psec .scenes img")];
    if (!imgs.length) return;
    const box = document.createElement("div");
    box.className = "lbox"; box.hidden = true;
    box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "이미지 크게 보기");
    box.innerHTML = `
      <button type="button" class="lbox__close" aria-label="닫기"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <button type="button" class="lbox__nav lbox__nav--prev" aria-label="이전 이미지"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>
      <figure class="lbox__fig"><img class="lbox__img" alt="" /><figcaption class="lbox__cap"></figcaption></figure>
      <button type="button" class="lbox__nav lbox__nav--next" aria-label="다음 이미지"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></button>`;
    document.body.appendChild(box);
    const im = box.querySelector(".lbox__img"), cap = box.querySelector(".lbox__cap");
    let cur = 0, opener = null;
    const capOf = (img) => {
      const fig = img.closest("figure");
      const t = fig && fig.querySelector("figcaption") ? fig.querySelector("figcaption").textContent.trim() : "";
      const sec = img.closest(".psec");
      const head = sec ? (sec.querySelector(".psec__title") || {}).textContent || "" : document.querySelector(".phero__title")?.textContent || "";
      return [head.trim(), t].filter(Boolean).join(" · ");
    };
    const showAt = (i) => {
      cur = (i + imgs.length) % imgs.length;
      im.src = imgs[cur].currentSrc || imgs[cur].src; im.alt = imgs[cur].alt || "";
      cap.textContent = `${capOf(imgs[cur])}${imgs.length > 1 ? `  ${cur + 1} / ${imgs.length}` : ""}`;
    };
    const open = (i) => {
      opener = document.activeElement; showAt(i); box.hidden = false;
      document.body.classList.add("is-viewing"); box.classList.toggle("is-single", imgs.length < 2);
      box.querySelector(".lbox__close").focus();
    };
    const close = () => { box.hidden = true; document.body.classList.remove("is-viewing"); if (opener && opener.focus) opener.focus(); };
    imgs.forEach((img, i) => {
      img.classList.add("is-zoomable"); img.tabIndex = 0; img.setAttribute("role", "button");
      img.setAttribute("aria-label", `${img.alt || "이미지"} 크게 보기`);
      img.addEventListener("click", () => open(i));
      img.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); } });
    });
    box.querySelector(".lbox__close").addEventListener("click", close);
    box.querySelector(".lbox__nav--prev").addEventListener("click", () => showAt(cur - 1));
    box.querySelector(".lbox__nav--next").addEventListener("click", () => showAt(cur + 1));
    box.addEventListener("click", (e) => { if (e.target === box || e.target.classList.contains("lbox__fig")) close(); });
    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape") { e.preventDefault(); e.stopImmediatePropagation(); close(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); showAt(cur - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); showAt(cur + 1); }
    }, true);
    let sx = null;
    box.addEventListener("touchstart", (e) => { sx = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
    box.addEventListener("touchend", (e) => {
      if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 50 && imgs.length > 1) showAt(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  /* 왼쪽 목차: 지금 읽는 섹션 표시
     - 화면 위쪽 30% 선을 지난 마지막 섹션이 '지금 섹션'이에요
     - 목차를 눌러 이동하면 누른 섹션을 바로 표시해요
       (페이지 끝 근처라 그 섹션이 위까지 못 올라와도 누른 걸로 유지, 직접 스크롤하면 다시 자동) */
  function tocSpy() {
    const links = [...document.querySelectorAll(".ptoc a")];
    const panel = [...document.querySelectorAll(".qtoc a")];      // 휴대폰 · 태블릿용 목차 (위쪽 '지금 섹션' 줄)
    const tNum = document.getElementById("ptopNum"), tName = document.getElementById("ptopName");
    const secs = links.map((a) => document.querySelector(a.getAttribute("href")));
    if (!secs.length || secs.some((x) => !x)) return;
    const head = document.querySelector(".head");
    let pinned = -1, ticking = false;
    const mark = (k) => {
      [links, panel].forEach((list) => list.forEach((a, i) => {
        a.classList.toggle("is-on", i === k);
        if (i === k) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      }));
      const a = links[Math.max(0, k)];
      if (tNum && a) { tNum.textContent = a.querySelector("span")?.textContent || ""; tName.textContent = a.textContent.replace(/^\s*\d+/, "").trim(); }
    };
    function update() {
      ticking = false;
      if (pinned >= 0) { mark(pinned); return; }
      const line = (head ? head.offsetHeight : 64) + window.innerHeight * 0.3;
      let k = -1;
      secs.forEach((sec, i) => { if (sec.getBoundingClientRect().top <= line) k = i; });
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) k = secs.length - 1;
      mark(k);
    }
    const on = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    [links, panel].forEach((list) => list.forEach((a, i) => a.addEventListener("click", () => { pinned = i; mark(i); })));
    // 사용자가 직접 스크롤하기 시작하면 다시 자동 표시
    const unpin = () => { if (pinned >= 0) { pinned = -1; on(); } };
    ["wheel", "touchstart", "keydown"].forEach((ev) => window.addEventListener(ev, unpin, { passive: true }));
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    update();
  }

  function notFound() {
    document.title = "프로젝트를 찾을 수 없어요 | 박수아 Portfolio";
    $("#project").innerHTML = `<div class="wrap page">
      <a class="back" href="${esc(window.keepLink("works.html"))}">← 프로젝트 목록</a>
      <div class="phead"><h1 class="phead__title">프로젝트를 찾을 수 없어요</h1>
      <p class="phead__lead">주소가 바뀌었거나 아직 공개되지 않은 프로젝트예요. 목록에서 다시 찾아주세요.</p></div></div>`;
  }

  (window.PROJECTS_READY || Promise.resolve()).then(() => {
    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
    const id = new URLSearchParams(location.search).get("id") || "";
    const all = [...(window.PROJECTS || [])].sort((a, b) => b.date.localeCompare(a.date));
    // 목록에서 보던 순서(종류별 · 그 연도)를 따라가요. 없으면 최신순 전체
    let list = all, label = "전체";
    try {
      const s = JSON.parse(sessionStorage.getItem("pf.works") || "null");
      if (s && Array.isArray(s.ids) && s.ids.includes(id)) {
        const byId = new Map(all.map((p) => [p.id, p]));
        const seq = s.ids.map((k) => byId.get(k)).filter(Boolean);
        if (seq.length) { list = seq; label = s.label || label; }
      }
    } catch (err) { /* 기본 순서 사용 */ }
    const i = list.findIndex((p) => p.id === id);
    if (i < 0) { notFound(); return; }
    render(list[i], list[i - 1] || null, list[i + 1] || null, { i, n: list.length, label });
  });
})();
