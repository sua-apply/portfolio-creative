/* =========================================
   works.html 전용 스크립트
   - Archive(연도→월별) 목록 / 상세 모달
   ========================================= */
(function () {
  "use strict";

  if (typeof PROJECTS === "undefined") return;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- 날짜 유틸 ---------- */
  const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const pad = (n) => String(n).padStart(2, "0");
  const fmtDate = (d) => d.replace("-", ".");            // "2025-08" → "2025.08"
  const byDateDesc = (a, b) => b.date.localeCompare(a.date);

  /* ---------- 3. 상세 모달 ---------- */
  const modal = $("#modal");
  let lastFocused = null;

  function openModal(id) {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p || !modal) return;

    $("#modalImg").src = p.image;
    $("#modalImg").alt = p.title;
    $("#modalMeta").textContent = `${p.categoryLabel} · ${fmtDate(p.date)} · ${p.client}`;
    $("#modalTitle").textContent = p.title;
    $("#modalDesc").textContent = p.desc;
    $("#modalTags").innerHTML = p.tags.map((t) => `<li>${t}</li>`).join("");

    const link = $("#modalLink");
    if (p.link) { link.href = p.link; link.hidden = false; }
    else { link.hidden = true; }

    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    $(".modal__close", modal).focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    if (lastFocused) lastFocused.focus();
  }

  function initModal() {
    if (!modal) return;
    $$("[data-close]", modal).forEach((el) => el.addEventListener("click", closeModal));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }

  /* ---------- 4. Archive : 연도 → 월별 보기 ---------- */
  function initArchive() {
    const yearsEl = $("#archiveYears");
    const monthsEl = $("#archiveMonths");
    const listEl = $("#archiveList");
    const summaryEl = $("#archiveSummary");
    const resetBtn = $("#archiveReset");
    if (!yearsEl) return;

    const items = PROJECTS
      .filter((p) => /^\d{4}-\d{2}$/.test(p.date || ""))
      .map((p) => ({ ...p, y: +p.date.slice(0, 4), m: +p.date.slice(5, 7) }))
      .sort(byDateDesc);
    const years = [...new Set(items.map((i) => i.y))];
    if (!years.length) return;

    const state = { year: years[0], month: null };

    function renderYears() {
      yearsEl.innerHTML = years.map((y) => {
        const count = items.filter((i) => i.y === y).length;
        const active = y === state.year;
        return `<button type="button" role="tab" class="archive__year${active ? " is-active" : ""}"
                  data-year="${y}" aria-selected="${active}">${y}<sup>${count}</sup></button>`;
      }).join("");
    }

    function renderMonths() {
      const inYear = items.filter((i) => i.y === state.year);
      monthsEl.innerHTML = MONTHS.map((name, idx) => {
        const m = idx + 1;
        const count = inYear.filter((i) => i.m === m).length;
        const active = state.month === m;
        const dots = Array.from({ length: Math.min(count, 4) }, () => "<i></i>").join("");
        return `<button type="button" class="archive__mbtn${active ? " is-active" : ""}"
                  data-month="${m}" ${count ? "" : "disabled"} aria-pressed="${active}"
                  aria-label="${state.year}년 ${m}월, ${count}개 프로젝트">
                  <strong>${pad(m)}</strong><span>${name.slice(0, 3)}</span>
                  <span class="archive__dots">${dots}</span>
                </button>`;
      }).join("");
    }

    function renderList() {
      const list = items.filter((i) => i.y === state.year && (!state.month || i.m === state.month));

      summaryEl.innerHTML = state.month
        ? `<strong>${state.year}년 ${state.month}월</strong> · ${list.length}개 프로젝트`
        : `<strong>${state.year}년</strong> 전체 · ${list.length}개 프로젝트`;
      resetBtn.hidden = !state.month;

      const groups = [];
      list.forEach((p) => {
        const last = groups[groups.length - 1];
        if (last && last.m === p.m) last.items.push(p);
        else groups.push({ m: p.m, items: [p] });
      });

      listEl.innerHTML = groups.map((g) => `
        <div class="archive__group">
          <h3 class="archive__month"><em>${pad(g.m)}</em>${MONTHS[g.m - 1]}</h3>
          <ul class="archive__rows">
            ${g.items.map((p) => `
              <li>
                <button type="button" class="archive__row" data-id="${p.id}">
                  <img src="${p.thumb}" alt="" loading="lazy" />
                  <span class="archive__info">
                    <span class="archive__title">${p.title}</span>
                    <span class="archive__sub">${p.categoryLabel} · ${p.client}</span>
                  </span>
                  <span class="archive__arrow" aria-hidden="true">↗</span>
                </button>
              </li>`).join("")}
          </ul>
        </div>`).join("");
    }

    function renderAll() { renderYears(); renderMonths(); renderList(); }

    yearsEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-year]");
      if (!btn) return;
      state.year = +btn.dataset.year;
      state.month = null;
      renderAll();
    });

    monthsEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-month]");
      if (!btn || btn.disabled) return;
      const m = +btn.dataset.month;
      state.month = state.month === m ? null : m;   // 같은 월 다시 누르면 해제
      renderMonths();
      renderList();
    });

    resetBtn.addEventListener("click", () => { state.month = null; renderMonths(); renderList(); });

    listEl.addEventListener("click", (e) => {
      const row = e.target.closest(".archive__row");
      if (row) openModal(row.dataset.id);
    });

    renderAll();
  }

  /* ---------- Init (main.js보다 먼저 실행되어야 스크롤 효과가 적용됨) ---------- */
  initModal();
  // PROJECTS는 이제 Supabase에서 비동기로 불러오므로, 데이터가 준비된 뒤에 그려요.
  (window.PROJECTS_READY || Promise.resolve()).then(initArchive);
})();
