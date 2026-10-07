import { roles, defaultRole } from './data.js';
import { roleFromURL, mountAdminBar } from './admin-bar.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 주소의 ?v=코드 로 직무를 정합니다. 방문자에게는 그 직무만 보이고,
// 직무 전환은 관리자 모드(manage.html)에서만 화면 구석 막대로 할 수 있습니다.
export function initRole(onChange) {
  let current = roleFromURL(roles, defaultRole);

  function apply(role) {
    current = role;
    const r = roles[role];
    const root = document.documentElement;
    root.style.setProperty('--accent', r.accent);
    root.style.setProperty('--soft', r.soft);
    root.dataset.role = role;
    // 다른 페이지로 가는 링크에도 같은 코드를 이어 붙입니다.
    $$('a[data-keep]').forEach((a) => {
      const [path, hash] = a.getAttribute('data-keep').split('#');
      a.href = `${path}?v=${r.code}${hash ? `#${hash}` : ''}`;
    });
    onChange(role);
  }

  apply(current);
  mountAdminBar(roles, () => current, apply);
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
  $$('.ltr', el).forEach((s, i) => { s.style.animationDelay = `${0.1 + i * 0.035}s`; });
}
