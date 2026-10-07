import { profile, roles, skills, career, projects } from './data.js';
import { $, $$, esc, setupRoleTabs, observeReveals, splitLetters } from './common.js';

$$('[data-bind]').forEach((el) => { el.textContent = profile[el.dataset.bind] ?? ''; });
$('#project-count').textContent = projects.length;

if (profile.photo) {
  $('#photo').innerHTML = `<img src="${esc(profile.photo)}" alt="${esc(profile.nameKo)} 프로필 사진">`;
}

const facts = [
  ['NAME', `${profile.nameKo} (${profile.nameEn})`],
  ['BIRTH', profile.birth],
  ['EMAIL', `<a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>`, true],
  ['PHONE', profile.phone],
  ['EDUCATION', profile.education],
  ['LINKS', profile.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join(' · '), true],
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

setupRoleTabs($('#role-tabs'), (role) => {
  const r = roles[role];
  $('#eyebrow').textContent = r.eyebrow;
  const tag = $('#tagline');
  tag.classList.remove('swap');
  void tag.offsetWidth;
  tag.textContent = r.tagline;
  tag.classList.add('swap');
  $$('[data-role-name]').forEach((el) => { el.textContent = role; });

  const s = skills[role];
  $('#abilities').innerHTML = s.abilities.map(([name, desc], i) => `<article class="ability reveal is-in" style="animation-delay:${i * 80}ms">
    <span class="ability__num">0${i + 1}</span>
    <h3 class="ability__name">${esc(name)}</h3>
    <p class="ability__desc">${esc(desc)}</p>
  </article>`).join('');
  $('#tools').innerHTML = s.tools.map((t) => `<span class="tool">${esc(t)}</span>`).join('');
});

observeReveals();
