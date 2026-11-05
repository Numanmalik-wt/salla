/**
 * SARAB motion engine
 * GSAP + ScrollTrigger choreography, Lenis as the single smooth-scroll engine.
 * Every feature checks for its markup, so this file is safe on every page.
 * prefers-reduced-motion: no smoothing, no scrubs, no pins — final states render immediately.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const cfg = window.sarab || {};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

class Sarab {
  constructor() {
    this.rtl = document.documentElement.dir === 'rtl' || !!cfg.rtl;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    this.saveData = !!(navigator.connection && navigator.connection.saveData);
    this.off = [];        // cleanup callbacks
    this.mm = gsap.matchMedia();
  }

  on(el, ev, fn, opt) { el.addEventListener(ev, fn, opt); this.off.push(() => el.removeEventListener(ev, fn, opt)); }

  init() {
    document.documentElement.classList.toggle('sx-motion', !this.reduced);
    if (!this.reduced) {
      this.split();
      if (cfg.smooth !== false) this.smooth();
      if (this.fine && cfg.cursor !== false) this.cursor();
      this.magnets();
    }
    this.videos();
    this.hero();
    this.statement();
    this.runway();
    this.index();
    this.reveal();
    this.marquee();
    this.fades();
    this.preloader();

    const refresh = () => ScrollTrigger.refresh();
    this.on(window, 'load', refresh);
    document.fonts && document.fonts.ready.then(refresh);
    $$('img[loading="lazy"]').forEach(img => img.complete || this.on(img, 'load', () => ScrollTrigger.refresh(), { once: true }));
    this.on(window, 'pagehide', () => this.destroy(), { once: true });
  }

  /* ---------- Smooth scroll (Lenis) ---------- */
  smooth() {
    this.lenis = new Lenis({
      lerp: 0.095,
      smoothWheel: true,
      anchors: true,
      prevent: node => !!node.closest('salla-modal, .s-modal-wrapper, .mm-ocd, salla-search, [data-lenis-prevent]'),
    });
    this.lenis.on('scroll', ScrollTrigger.update);
    this.raf = t => this.lenis && this.lenis.raf(t * 1000);
    gsap.ticker.add(this.raf);
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Split headings into words (accessible) ---------- */
  split() {
    $$('[data-sx-split]').forEach(el => {
      if (el.children.length || el.dataset.sxDone) return; // never split links/markup
      const text = el.textContent.trim().replace(/\s+/g, ' ');
      el.dataset.sxDone = '1';
      el.innerHTML = `<span class="sr-only">${esc(text)}</span>` +
        text.split(' ').map(w => `<span class="sx-w" aria-hidden="true"><span class="sx-w__i">${esc(w)}</span></span>`).join(' ');
    });
  }

  words(el) { return $$('.sx-w__i', el); }

  /* ---------- Generic reveals ---------- */
  fades() {
    if (this.reduced) return;
    $$('[data-sx-split]').forEach(el => {
      if (el.closest('[data-sx-hero], [data-sx-reveal]')) return;
      gsap.from(this.words(el), {
        yPercent: 115, rotate: this.rtl ? -3 : 3, duration: 1.1, ease: 'expo.out', stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
    $$('[data-sx-fade]').forEach(el => {
      if (el.closest('[data-sx-hero], [data-sx-reveal]')) return;
      gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
  }

  /* ---------- Preloader (once per session) ---------- */
  preloader() {
    const pre = $('.sx-preloader');
    let seen = false;
    try { seen = sessionStorage.getItem('sx-seen') === '1'; sessionStorage.setItem('sx-seen', '1'); } catch (e) { /* storage blocked */ }
    if (!pre || this.reduced || seen || !cfg.preloader) { pre && pre.remove(); this.heroIntro(); return; }
    this.lenis && this.lenis.stop();
    const tl = gsap.timeline({ onComplete: () => { pre.remove(); this.lenis && this.lenis.start(); } });
    tl.from('.sx-preloader__iris', { scale: 0.2, opacity: 0, duration: 1.1, ease: 'expo.out' })
      .from('.sx-preloader__name', { opacity: 0, letterSpacing: '0.6em', duration: 1, ease: 'expo.out' }, '<0.15')
      .to('.sx-preloader__iris', { scale: 14, duration: 1.2, ease: 'expo.inOut' }, '+=0.15')
      .to(pre, { clipPath: 'circle(0% at 50% 50%)', duration: 0.9, ease: 'expo.inOut' }, '-=0.75')
      .add(() => this.heroIntro(), '-=0.6');
    // safety: never trap the visitor
    setTimeout(() => { if (document.body.contains(pre)) tl.progress(1); }, 4500);
  }

  /* ---------- Video: lazy, autoplay when visible, pause offscreen ---------- */
  videos() {
    const vids = $$('video[data-src]');
    if (!vids.length) return;
    const allowPlay = !this.reduced && !this.saveData;
    const io = new IntersectionObserver(entries => entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        if (!allowPlay) return;
        if (!v.src) { v.src = v.dataset.src; v.addEventListener('playing', () => v.classList.add('is-ready'), { once: true }); v.addEventListener('error', () => v.remove(), { once: true }); }
        v.play().catch(() => {});
      } else if (v.src) v.pause();
    }), { rootMargin: '200px 0px' });
    vids.forEach(v => io.observe(v));
    this.on(document, 'visibilitychange', () => vids.forEach(v => { if (document.hidden) v.pause(); }));
    this.off.push(() => io.disconnect());
  }

  /* ---------- HERO: polarized lens ---------- */
  hero() {
    const hero = $('[data-sx-hero]');
    if (!hero) return;
    this.heroEl = hero;
    if (this.reduced || !hero.hasAttribute('data-lens')) return;

    const s = { x: 0, y: 0, tx: 0, ty: 0, r: 0, rTarget: 0, auto: true, t: 0, visible: true };
    const measure = () => {
      const b = hero.getBoundingClientRect();
      s.w = b.width; s.h = b.height;
      s.R = clamp(Math.min(s.w, s.h) * 0.19, 86, 240);
      if (!s.x) { s.x = s.tx = s.w * 0.62; s.y = s.ty = s.h * 0.48; }
    };
    measure();
    this.lensState = s;

    let pending = null;
    this.on(hero, 'pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      pending = e;
    });
    this.on(hero, 'pointerenter', e => { if (e.pointerType === 'mouse') s.auto = false; });
    this.on(hero, 'pointerleave', () => { s.auto = true; });
    this.on(window, 'blur', () => { s.auto = true; });
    this.on(window, 'resize', measure);

    const io = new IntersectionObserver(([en]) => { s.visible = en.isIntersecting; }, { threshold: 0 });
    io.observe(hero); this.off.push(() => io.disconnect());

    this.lensTick = (time, dt) => {
      if (!s.visible || document.hidden) return;
      if (pending) { const b = hero.getBoundingClientRect(); s.tx = pending.clientX - b.left; s.ty = pending.clientY - b.top; pending = null; }
      if (s.auto) {
        s.t += dt / 1000;
        s.tx = s.w * (0.58 + 0.2 * Math.sin(s.t * 0.33));
        s.ty = s.h * (0.46 + 0.12 * Math.sin(s.t * 0.47 + 1));
      }
      const k = s.auto ? 0.03 : 0.14;
      s.x += (s.tx - s.x) * k; s.y += (s.ty - s.y) * k;
      s.r += (s.rTarget - s.r) * 0.08;
      hero.style.setProperty('--lx', s.x.toFixed(1) + 'px');
      hero.style.setProperty('--ly', s.y.toFixed(1) + 'px');
      hero.style.setProperty('--lr', s.r.toFixed(1) + 'px');
    };
    gsap.ticker.add(this.lensTick);
    this.off.push(() => gsap.ticker.remove(this.lensTick));

    // scroll: media drifts, content lifts
    gsap.to($('.sx-hero__media', hero), { scale: 1.12, yPercent: 8, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to($('.sx-hero__content', hero), { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }

  heroIntro() {
    const hero = this.heroEl;
    if (!hero || this.reduced || hero.dataset.intro) return;
    hero.dataset.intro = '1';
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from($('.sx-hero__media', hero), { scale: 1.18, duration: 2.2 }, 0)
      .from(this.words($('.sx-hero__title', hero)), { yPercent: 118, rotate: this.rtl ? -4 : 4, duration: 1.4, stagger: 0.08 }, 0.15)
      .to($$('[data-sx-fade]', hero), { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, 0.6)
      .from('.store-header', { yPercent: -40, opacity: 0, duration: 1.1 }, 0.3);
    if (this.lensState) tl.add(() => { this.lensState.rTarget = this.lensState.R; }, 0.5);
  }

  /* ---------- Statement: words light up as you read ---------- */
  statement() {
    $$('[data-sx-statement]').forEach(sec => {
      const words = $$('.sx-word', sec);
      if (this.reduced) { words.forEach(w => (w.style.opacity = 1)); return; }
      gsap.to(words, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: $('.sx-statement__text', sec), start: 'top 78%', end: 'bottom 55%', scrub: 0.6 } });
      $$('.sx-pill', sec).forEach(p => gsap.from(p, { width: 0, marginInline: 0, ease: 'none', scrollTrigger: { trigger: p, start: 'top 85%', end: 'top 55%', scrub: 0.6 } }));
    });
  }

  /* ---------- Runway: pinned horizontal travel on desktop ---------- */
  runway() {
    $$('[data-sx-runway]').forEach(sec => {
      const track = $('[data-sx-track]', sec);
      const vp = $('.sx-runway__viewport', sec);
      const bar = $('[data-sx-progress]', sec);
      const count = $('[data-sx-count]', sec);
      const cards = $$('[data-sx-card]', sec);
      if (!track || this.reduced) return;
      this.mm.add('(min-width: 900px)', () => {
        sec.classList.add('sx-pinned');
        const dist = () => Math.max(0, track.scrollWidth - vp.clientWidth);
        const tween = gsap.to(track, {
          x: () => (this.rtl ? 1 : -1) * dist(), ease: 'none',
          scrollTrigger: {
            trigger: $('.sx-runway__pin', sec), pin: true, start: 'top top', end: () => '+=' + dist(), scrub: 0.8, invalidateOnRefresh: true,
            onUpdate: self => {
              bar && gsap.set(bar, { scaleX: self.progress });
              if (count && cards.length) count.textContent = String(Math.min(cards.length, 1 + Math.floor(self.progress * cards.length))).padStart(2, '0');
            },
          },
        });
        cards.forEach(c => {
          const img = $('img', c);
          img && gsap.fromTo(img, { xPercent: this.rtl ? -8 : 8 }, { xPercent: this.rtl ? 8 : -8, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
        });
        return () => sec.classList.remove('sx-pinned');
      });
    });
  }

  /* ---------- Category index: image follows the cursor ---------- */
  index() {
    $$('[data-sx-index]').forEach(sec => {
      const float = $('.sx-index__float', sec);
      const img = $('img', float);
      if (!float || !this.fine || this.reduced) return;
      const xTo = gsap.quickTo(float, 'x', { duration: 0.6, ease: 'expo.out' });
      const yTo = gsap.quickTo(float, 'y', { duration: 0.6, ease: 'expo.out' });
      const rTo = gsap.quickTo(float, 'rotation', { duration: 0.8, ease: 'expo.out' });
      let lastX = 0;
      this.on(sec, 'pointermove', e => {
        const w = float.offsetWidth, h = float.offsetHeight;
        xTo(e.clientX - w / 2); yTo(e.clientY - h / 2);
        rTo(clamp((e.clientX - lastX) * 0.4, -12, 12)); lastX = e.clientX;
      });
      $$('[data-sx-index-row]', sec).forEach(row => {
        const show = () => { if (img.src !== row.dataset.img) img.src = row.dataset.img; gsap.to(float, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' }); };
        this.on(row, 'pointerenter', show);
      });
      this.on($('.sx-index__list', sec), 'pointerleave', () => gsap.to(float, { opacity: 0, scale: 0.6, duration: 0.4, ease: 'expo.out' }));
    });
  }

  /* ---------- Reveal: window expands to full-bleed ---------- */
  reveal() {
    $$('[data-sx-reveal]').forEach(sec => {
      const win = $('[data-sx-window]', sec);
      const title = $('h2', sec);
      if (this.reduced) return;
      this.mm.add({ desk: '(min-width: 768px)', mob: '(max-width: 767px)' }, ctx => {
        const from = ctx.conditions.desk ? 'inset(22% 31% 22% 31% round 28px)' : 'inset(24% 10% 24% 10% round 20px)';
        const tl = gsap.timeline({ scrollTrigger: { trigger: $('.sx-reveal__stage', sec), pin: true, start: 'top top', end: '+=120%', scrub: 0.8 } });
        tl.fromTo(win, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', duration: 1 })
          .fromTo($('img, video', win), { scale: 1.25 }, { scale: 1, ease: 'none', duration: 1 }, 0)
          .from(this.words(title), { yPercent: 115, stagger: 0.05, duration: 0.4, ease: 'power3.out' }, 0.55)
          .to($$('[data-sx-fade]', sec), { opacity: 1, y: 0, stagger: 0.08, duration: 0.3 }, 0.75);
      });
    });
  }

  /* ---------- Marquee: speed reacts to scroll velocity ---------- */
  marquee() {
    $$('[data-sx-marquee]').forEach(sec => {
      const rows = $$('.sx-marquee__row', sec).map(r => ({ el: $('.sx-marquee__inner', r), dir: +r.dataset.dir, x: 0 }));
      if (this.reduced) return;
      let boost = 0, visible = false;
      ScrollTrigger.create({ trigger: sec, start: 'top bottom', end: 'bottom top', onToggle: s => (visible = s.isActive), onUpdate: s => (boost = clamp(Math.abs(s.getVelocity()) / 400, 0, 8)) });
      const tick = (t, dt) => {
        if (!visible || document.hidden) return;
        boost *= 0.94;
        rows.forEach(r => {
          const third = r.el.scrollWidth / 3;
          r.x -= r.dir * (0.6 + boost) * (dt / 16);
          if (r.x <= -third) r.x += third; if (r.x > 0) r.x -= third;
          r.el.style.transform = `translate3d(${r.x}px,0,0)`;
        });
      };
      gsap.ticker.add(tick);
      this.off.push(() => gsap.ticker.remove(tick));
    });
  }

  /* ---------- Cursor + magnets ---------- */
  cursor() {
    const c = $('.sx-cursor');
    if (!c) return;
    const xTo = gsap.quickTo(c, 'x', { duration: 0.25, ease: 'power3' });
    const yTo = gsap.quickTo(c, 'y', { duration: 0.25, ease: 'power3' });
    this.on(window, 'pointermove', e => { if (e.pointerType !== 'mouse') return; c.classList.add('is-on'); xTo(e.clientX); yTo(e.clientY); }, { passive: true });
    this.on(document, 'pointerover', e => c.classList.toggle('is-hover', !!e.target.closest('a, button, [role="button"], salla-add-product-button')));
    this.on(document, 'mouseleave', () => c.classList.remove('is-on'));
    this.on(window, 'blur', () => c.classList.remove('is-on'));
  }

  magnets() {
    if (!this.fine) return;
    $$('[data-sx-magnet]').forEach(el => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      this.on(el, 'pointermove', e => { const b = el.getBoundingClientRect(); xTo((e.clientX - b.left - b.width / 2) * 0.28); yTo((e.clientY - b.top - b.height / 2) * 0.35); });
      this.on(el, 'pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  destroy() {
    this.off.forEach(fn => fn()); this.off = [];
    this.mm.revert();
    ScrollTrigger.getAll().forEach(t => t.kill());
    if (this.raf) gsap.ticker.remove(this.raf);
    if (this.lenis) { this.lenis.destroy(); this.lenis = null; }
  }
}

const boot = () => { if (window.__sarab) return; window.__sarab = new Sarab(); window.__sarab.init(); };
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', boot, { once: true }) : boot();

export default Sarab;
