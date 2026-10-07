import { roles, projects } from './data.js';
import { $, esc, setupRoleTabs, observeReveals, splitLetters, reduceMotion } from './common.js';

const SORT_NOTE = {
  design: '?role=design · 디자인 작업 우선',
  marketing: '?role=marketing · 마케팅 성과 우선',
  pr: '?role=pr · 홍보 성과 우선',
};

function ordered(role) {
  const match = projects.filter((p) => p.roles.includes(role)).sort((a, b) => a.roles.indexOf(role) - b.roles.indexOf(role));
  const rest = projects.filter((p) => !p.roles.includes(role));
  return [...match, ...rest];
}

const ph = (label, cls = '') => `<div class="ph ${cls}">${esc(label)}</div>`;

function designDetail(p) {
  const d = p.design;
  return `<div class="detail wrap detail--design">
    <div class="detail__media reveal">
      ${ph('[메인 비주얼 / 목업]', 'ph--main')}
      <div class="detail__thumbs">${ph('[디테일 1]')}${ph('[디테일 2]')}${ph('[디테일 3]')}</div>
    </div>
    <div class="detail__text reveal">
      <h3 class="detail__title">${esc(p.title)}</h3>
      <dl class="meta"><div><dt>Role</dt><dd>${esc(d.role)}</dd></div><div><dt>Year</dt><dd>${esc(d.year)}</dd></div><div><dt>Tools</dt><dd>${esc(d.tools)}</dd></div></dl>
      <p class="body">${esc(d.concept)}</p>
      <div class="palette">${d.palette.map((c) => `<span style="background:${esc(c)}" title="${esc(c)}"></span>`).join('')}</div>
      <p class="small">[사용한 컬러 팔레트]</p>
    </div>
  </div>`;
}

function marketingDetail(p) {
  const m = p.marketing;
  return `<div class="detail wrap detail--marketing">
    <div class="metrics reveal">${m.metrics.map(([n, l], i) => `<div class="metric"><span class="metric__num${i === 0 ? ' metric__num--accent' : ''}">${esc(n)}</span><span class="metric__label">${esc(l)}</span></div>`).join('')}</div>
    <div class="detail__row">
      ${ph('[캠페인 소재 / 성과 그래프]', 'ph--wide reveal')}
      <dl class="gsr reveal">
        <div><dt>GOAL</dt><dd>${esc(m.goal)}</dd></div>
        <div><dt>STRATEGY</dt><dd>${esc(m.strategy)}</dd></div>
        <div><dt>RESULT</dt><dd>${esc(m.result)}</dd></div>
      </dl>
    </div>
  </div>`;
}

function prDetail(p) {
  const r = p.pr;
  return `<div class="detail wrap detail--pr">
    <div class="clips reveal">${r.clips.map(([meta, title], i) => `<article class="clip">${ph(i === 2 ? '[보도자료 원문]' : '[기사 · 게시물 캡처]', 'ph--clip')}<p class="small">${esc(meta)}</p><p class="clip__title">${esc(title)}</p></article>`).join('')}</div>
    <div class="detail__text reveal">
      <h3 class="detail__title">${esc(p.title)}</h3>
      <p class="body">${esc(r.story)}</p>
      <dl class="numbers">${r.numbers.map(([l, n], i) => `<div><dt>${esc(l)}</dt><dd class="${i === 0 ? 'accent' : ''}">${esc(n)}</dd></div>`).join('')}</dl>
    </div>
  </div>`;
}

const DETAIL = { design: designDetail, marketing: marketingDetail, pr: prDetail };

function render(role) {
  $('#sort-note').textContent = SORT_NOTE[role];
  const list = ordered(role);

  $('#index').innerHTML = list.map((p, i) => `<li class="reveal is-in"><a href="#${p.id}">
    <span class="index__num">0${i + 1}</span>
    <span class="index__title">${esc(p.title)}</span>
    <span class="index__cat">${esc(p.category[role])}</span>
    <span class="index__arrow" aria-hidden="true">↓</span>
  </a></li>`).join('');

  $('#projects').innerHTML = list.map((p, i) => `<section class="project" id="${p.id}">
    <div class="project__intro dark">
      <div class="wrap">
        <p class="label label--light reveal">PROJECT 0${i + 1}${p.roles.includes(role) ? '' : ' · 관련 경험'}</p>
        <h2 class="project__title reveal">${esc(p.title)}</h2>
        <p class="project__cat reveal">${esc(p.category[role])}</p>
        <p class="project__summary reveal">${esc(p.summary)}</p>
      </div>
    </div>
    ${DETAIL[role](p)}
  </section>`).join('');

  observeReveals($('#projects'));
}

splitLetters($('#work-title'));
setupRoleTabs($('#role-tabs'), render);

// 스크롤 진행 막대
const bar = $('#progress');
const onScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();
if (reduceMotion) bar.style.transition = 'none';
