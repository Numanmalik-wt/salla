/**
 * Hareer home sections: hero slider, category tabs, offer countdown.
 * Each init is safe to call when the section is not on the page.
 */
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initHeroSliders(root = document) {
  root.querySelectorAll('.hr-hero').forEach(hero => {
    if (hero.dataset.ready) return;
    hero.dataset.ready = '1';

    const slides = [...hero.querySelectorAll('.hr-hero__slide')];
    const dots = [...hero.querySelectorAll('.hr-hero__dot')];
    if (slides.length < 2) return;

    let current = 0;
    let timer = null;
    const delay = 6000;

    const go = index => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === current;
        slide.classList.toggle('is-active', active);
        slide.toggleAttribute('aria-hidden', !active);
        slide.querySelectorAll('a, button').forEach(el => active ? el.removeAttribute('tabindex') : el.setAttribute('tabindex', '-1'));
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === current);
        dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
    };

    const stop = () => { clearInterval(timer); timer = null; hero.classList.remove('is-playing'); };
    const play = () => {
      if (hero.dataset.autoplay !== 'true' || prefersReducedMotion()) return;
      stop();
      hero.classList.add('is-playing');
      hero.style.setProperty('--hr-hero-delay', `${delay}ms`);
      timer = setInterval(() => go(current + 1), delay);
    };

    dots.forEach(dot => dot.addEventListener('click', () => { go(Number(dot.dataset.index)); play(); }));

    // Swipe support
    let startX = null;
    hero.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', e => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) < 40) return;
      const isRtl = document.documentElement.dir === 'rtl';
      go(current + ((dx < 0) !== isRtl ? 1 : -1));
      play();
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', play);
    hero.addEventListener('focusin', stop);
    go(0);
    play();
  });
}

export function initTabs(root = document) {
  root.querySelectorAll('.hr-tabs').forEach(block => {
    const tabs = [...block.querySelectorAll('[role="tab"]')];
    const select = tab => {
      tabs.forEach(t => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.tabIndex = active ? 0 : -1;
        const panel = block.querySelector('#' + t.getAttribute('aria-controls'));
        if (panel) {
          panel.hidden = !active;
          panel.classList.toggle('is-active', active);
        }
      });
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', e => {
        const isRtl = document.documentElement.dir === 'rtl';
        const next = { ArrowRight: isRtl ? -1 : 1, ArrowLeft: isRtl ? 1 : -1 }[e.key];
        if (!next) return;
        e.preventDefault();
        const target = tabs[(i + next + tabs.length) % tabs.length];
        target.focus();
        select(target);
      });
    });
  });
}

export function initCountdowns(root = document) {
  root.querySelectorAll('.hr-countdown[data-end]').forEach(box => {
    const raw = box.dataset.end;
    // Accept "YYYY-MM-DD" (counts to the end of that day) or a full date-time
    const end = /^\d{4}-\d{1,2}-\d{1,2}$/.test(raw)
      ? new Date(...raw.split('-').map((n, i) => (i === 1 ? Number(n) - 1 : Number(n))), 23, 59, 59)
      : new Date(raw);
    if (isNaN(end)) { box.remove(); return; }

    const nums = {};
    box.querySelectorAll('[data-unit]').forEach(el => { nums[el.dataset.unit] = el; });
    const fmt = n => {
      const s = String(n).padStart(2, '0');
      return window.salla?.helpers?.number ? salla.helpers.number(s) : s;
    };

    const tick = () => {
      let diff = Math.max(0, end - Date.now());
      const days = Math.floor(diff / 864e5); diff -= days * 864e5;
      const hours = Math.floor(diff / 36e5); diff -= hours * 36e5;
      const minutes = Math.floor(diff / 6e4); diff -= minutes * 6e4;
      const seconds = Math.floor(diff / 1e3);
      Object.entries({ days, hours, minutes, seconds }).forEach(([k, v]) => nums[k] && (nums[k].textContent = fmt(v)));
      if (end - Date.now() <= 0) {
        clearInterval(timer);
        box.classList.add('is-ended');
      }
    };
    const timer = setInterval(tick, 1000);
    tick();
  });
}
