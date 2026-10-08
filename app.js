/* ==========================================================================
   Lahore Precision Printworks - App Logic
   ========================================================================== */

(function () {
  'use strict';
  
  const CFG = window.SITE_CONFIG;
  if (!CFG) { console.error('Missing config.js'); return; }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // DOM Helpers
  function el(tag, attr, children) {
    const n = document.createElement(tag);
    if (attr) Object.keys(attr).forEach(k => {
      if (k === 'text') n.textContent = attr[k];
      else if (k === 'html') n.innerHTML = attr[k];
      else n.setAttribute(k, attr[k]);
    });
    if (children) children.forEach(c => c && n.appendChild(c));
    return n;
  }
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.from(document.querySelectorAll(sel)); }

  // --------------------------------------------------------------------------
  // Header Solid on Scroll
  // --------------------------------------------------------------------------
  function initHeader() {
    const header = $('.header');
    const sentinel = $('#header-sentinel');
    if (!header || !sentinel || !window.IntersectionObserver) return;

    new IntersectionObserver(entries => {
      header.classList.toggle('header--solid', !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(sentinel);
  }

  // --------------------------------------------------------------------------
  // Render Hero Stats
  // --------------------------------------------------------------------------
  function renderHeroStats() {
    const wrap = $('#hero-stats');
    if (!wrap) return;
    CFG.STATS.forEach(s => {
      wrap.appendChild(el('div', { class: 'stat-item' }, [
        el('div', { class: 'stat-val', text: s.value }),
        el('div', { class: 'stat-lbl', text: s.label })
      ]));
    });
  }

  // --------------------------------------------------------------------------
  // Hero Animation (Signature Print)
  // --------------------------------------------------------------------------
  function initHeroAnimation() {
    if (!window.gsap || prefersReducedMotion) return;
    
    // Add js-ready to handle hidden start states
    document.documentElement.classList.add('js-ready');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Initial states
    gsap.set('.hero__eyebrow, .hero__line, .hero__sub, .hero__ctas', { opacity: 0, y: 20 });
    gsap.set('.stat-item', { opacity: 0, y: 20 });
    gsap.set('#hero-paper', { height: 0 }); // starts hidden in slot

    // Animation: Sheet prints out
    tl.to('#hero-paper', { height: 'auto', duration: 1.2, ease: 'power2.inOut' }, 0.2)
      // Text appears as if printed
      .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.5 }, 0.6)
      .to('.hero__line', { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 }, 0.8)
      .to('.hero__sub', { opacity: 1, y: 0, duration: 0.5 }, 1.2)
      .to('.hero__ctas', { opacity: 1, y: 0, duration: 0.5 }, 1.4)
      .to('.stat-item', { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 1.6);
  }

  // --------------------------------------------------------------------------
  // Hero Visual Pointer Parallax
  // --------------------------------------------------------------------------
  function initHeroParallax() {
    if (!hasFinePointer) return;
    const sheet = $('.printed-sheet');
    const container = $('.hero__press-machine');
    if (!sheet || !container) return;

    let rafId = null;
    let targetX = 0, targetY = 0;
    
    container.addEventListener('mousemove', e => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = (e.clientX - cx) / (rect.width / 2);
      targetY = (e.clientY - cy) / (rect.height / 2);
      
      if (!rafId) {
        rafId = requestAnimationFrame(updateParallax);
      }
    });

    container.addEventListener('mouseleave', () => {
      targetX = 0; targetY = 0;
      if (!rafId) rafId = requestAnimationFrame(updateParallax);
    });

    function updateParallax() {
      // Gentle tilt max 6 degrees
      const rx = Math.max(-6, Math.min(6, -targetY * 6));
      const ry = Math.max(-6, Math.min(6, targetX * 6));
      sheet.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      rafId = null;
    }
  }

  // --------------------------------------------------------------------------
  // Boot
  // --------------------------------------------------------------------------
  function init() {
    renderHeroStats();
    initHeader();
    initHeroAnimation();
    initHeroParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
