import { profile, roles, skills, career, projects } from './data.js';
import { $, $$, esc, initRole, observeReveals, splitLetters } from './common.js';

$$('[data-bind]').forEach((el) => { el.textContent = profile[el.dataset.bind] ?? ''; });

if (profile.photo) {
  $('#photo').innerHTML = `<img src="${esc(profile.photo)}" alt="${esc(profile.nameKo)} 프로필 사진">`;
}

const facts = [
  ['Name', `${profile.nameKo} (${profile.nameEn})`],
  ['Birth', profile.birth],
  ['Email', `<a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>`, true],
  ['Phone', profile.phone],
  ['Education', profile.education],
  ['Links', profile.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join(' · '), true],
];
$('#facts').innerHTML = facts.map(([k, v, html]) => `<div><dt>${k}</dt><dd>${html ? v : esc(v)}</dd></div>`).join('');

const row = (item) => `<div class="tl-row">
  <span class="tl-row__when">${esc(item.period)}</span>
  <div><p class="tl-row__title">${esc(item.title)}</p>${item.desc ? `<p class="tl-row__desc">${esc(item.desc)}</p>` : ''}</div>
</div>`;
$('#experience').innerHTML = career.experience.map(row).join('');
$('#education').innerHTML = career.education.map(row).join('');
$('#certificates').innerHTML = career.certificates.map(row).join('');

splitLetters($('#hero-name'));

initRole((role) => {
  const r = roles[role];
  document.title = `박영희 · ${r.label} Portfolio`;
  $('#eyebrow').textContent = r.eyebrow;
  $('#tagline').textContent = r.tagline;
  $('#ring-text').textContent = `PARK YOUNGHEE · ${r.eyebrow} PORTFOLIO · 2026 · `;
  $('#project-count').textContent = projects.filter((p) => p.roles.includes(role)).length;

  const s = skills[role];
  $('#abilities').innerHTML = s.abilities.map(([name, desc], i) => `<article class="ability">
    <span class="ability__num">0${i + 1}</span>
    <h3 class="ability__name">${esc(name)}</h3>
    <p class="ability__desc">${esc(desc)}</p>
  </article>`).join('');
  $('#tools').innerHTML = s.tools.map((t) => `<span class="tool">${esc(t)}</span>`).join('');

  const words = [...s.abilities.map((a) => a[0]), ...s.tools];
  const strip = words.map((w) => `<span>${esc(w)}</span><span class="marquee__star">✦</span>`).join('');
  $('#marquee').innerHTML = strip + strip;
});

observeReveals();
