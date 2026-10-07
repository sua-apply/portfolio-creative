import { roles, defaultRole } from './data.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const roleKeys = Object.keys(roles);

export function readRole() {
  const r = new URLSearchParams(location.search).get('role');
  return roleKeys.includes(r) ? r : defaultRole;
}

// 직무 버튼을 그리고, 바뀔 때마다 onChange(role)를 부릅니다.
export function setupRoleTabs(container, onChange) {
  let current = readRole();
  container.innerHTML = roleKeys.map((k) => `<button type="button" role="tab" data-role="${k}">${esc(roles[k].label)}</button>`).join('');

  function apply(role, push) {
    current = role;
    if (push) {
      const url = new URL(location.href);
      url.searchParams.set('role', role);
      history.replaceState(null, '', url);
    }
    $$('button', container).forEach((b) => {
      const on = b.dataset.role === role;
      b.setAttribute('aria-selected', on);
      b.tabIndex = on ? 0 : -1;
    });
    // 다른 페이지로 가는 링크에도 직무를 이어 붙입니다.
    $$('a[data-keep-role]').forEach((a) => {
      const base = a.getAttribute('data-keep-role');
      const [path, hash] = base.split('#');
      a.href = `${path}?role=${role}${hash ? `#${hash}` : ''}`;
    });
    onChange(role);
  }

  container.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-role]');
    if (b && b.dataset.role !== current) apply(b.dataset.role, true);
  });
  container.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = roleKeys.indexOf(current);
    const next = roleKeys[(i + (e.key === 'ArrowRight' ? 1 : roleKeys.length - 1)) % roleKeys.length];
    apply(next, true);
    $(`button[data-role="${next}"]`, container).focus();
  });
  window.addEventListener('popstate', () => apply(readRole(), false));
  apply(current, false);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); revealObserver.unobserve(en.target); }
  });
}, { threshold: 0.12 });

export function observeReveals(root = document) {
  $$('.reveal:not(.is-in)', root).forEach((el) => revealObserver.observe(el));
}

// 글자가 하나씩 아래에서 올라오는 효과
export function splitLetters(el) {
  if (reduceMotion) return;
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        [...child.textContent].forEach((ch) => {
          const s = document.createElement('span');
          s.className = 'ltr';
          s.textContent = ch === ' ' ? ' ' : ch;
          frag.appendChild(s);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1) {
        walk(child);
      }
    });
  };
  walk(el);
  $$('.ltr', el).forEach((s, i) => { s.style.animationDelay = `${0.15 + i * 0.04}s`; });
}
