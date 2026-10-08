/* ==========================================================================
   Lahore Precision Printworks - App Logic
   ========================================================================== */

(function () {
  'use strict';
  
  const CFG = typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG : window.SITE_CONFIG;
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
  // Portfolio Segment & Cards
  // --------------------------------------------------------------------------
  function renderPortfolio() {
    const grid = $('#portfolio-grid');
    if (!grid) return;

    CFG.PORTFOLIO.forEach(item => {
      const effectClass = item.id ? `effect--${item.id}` : '';
      const effectText = item.id === 'spotuv' ? 'UV' : 
                         item.id === 'foil' ? 'FOIL' :
                         item.id === 'emboss' ? '3D' :
                         item.id === 'dripoff' ? 'DRIP' :
                         item.id === 'holographic' ? 'HOLO' : 'LUX';

      const card = el('div', { class: 'port-card', 'data-id': item.id }, [
        el('div', { class: 'port-card__visual' }, [
          el('div', { class: 'mock-carton' }, [
            el('div', { class: `effect-layer ${effectClass}`, text: effectText })
          ])
        ]),
        el('div', { class: 'port-card__content' }, [
          el('div', { class: 'port-tags' }, item.tags.map(t => el('span', { text: t }))),
          el('h3', { class: 'port-title', text: item.title }),
          el('p', { class: 'port-desc', text: item.desc }),
          el('div', { class: 'port-specs' }, [
            el('span', { text: `Packaging: ${item.tags[1] || 'Carton'}` }),
            el('span', { text: `Registration: +/-0.08mm` })
          ])
        ])
      ]);
      grid.appendChild(card);
    });
  }

  function initPortfolio() {
    renderPortfolio();

    const filters = $$('.chip');
    const cards = $$('.port-card');
    
    // Filter Logic
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('chip--active'));
        btn.classList.add('chip--active');
        const filter = btn.dataset.filter;
        
        cards.forEach(card => {
          if (filter === 'all' || card.dataset.id === filter) {
            card.classList.remove('hidden');
            // small animation kick
            requestAnimationFrame(() => {
              card.style.opacity = 1;
              card.style.transform = 'scale(1)';
            });
          } else {
            card.style.opacity = 0;
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              // Ensure we are still filtering this out (in case of fast clicks)
              if (btn.classList.contains('chip--active')) {
                card.classList.add('hidden');
              }
            }, 400); // match transition
          }
        });
      });
    });

    // Segmented Control Logic
    const lightBtns = $$('.seg-btn');
    lightBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        lightBtns.forEach(b => {
          b.classList.remove('seg-btn--active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('seg-btn--active');
        btn.setAttribute('aria-checked', 'true');
        document.body.dataset.light = btn.dataset.light;
      });
    });

    // Pointer Highlight
    if (hasFinePointer) {
      const visuals = $$('.port-card__visual');
      let rafId = null;

      visuals.forEach(visual => {
        visual.addEventListener('mousemove', e => {
          const rect = visual.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          
          if (!rafId) {
            rafId = requestAnimationFrame(() => {
              visual.style.setProperty('--mx', `${x.toFixed(1)}%`);
              visual.style.setProperty('--my', `${y.toFixed(1)}%`);
              rafId = null;
            });
          }
        });
      });
    }
  }

  // --------------------------------------------------------------------------
  // Fleet Segment
  // --------------------------------------------------------------------------
  function initFleet() {
    const cardsWrap = $('#press-cards');
    const tbody = $('#specs-table tbody');
    if (!cardsWrap || !tbody || !CFG.PRESSES) return;

    // We take top 3 for cards
    const topPresses = CFG.PRESSES.slice(0, 3);
    
    topPresses.forEach(press => {
      const cls = `press-card ${press.flagship ? 'press-card--flagship' : ''}`;
      
      const card = el('div', { class: cls }, [
        el('h3', { class: 'press-model', text: press.model }),
        el('div', { class: 'press-config', text: press.config }),
        el('div', { class: 'press-stats' }, [
          el('div', {}, [
            el('div', { class: 'press-stat-val spec-counter', 'data-val': parseInt(press.maxSpeed.replace(/\D/g, '')) || 0 }, [el('span', {text: '0'})]),
            el('div', { class: 'press-stat-lbl', text: 'SPH Speed' })
          ]),
          el('div', {}, [
            el('div', { class: 'press-stat-val', text: press.sheetFormat.split(' ')[0] }),
            el('div', { class: 'press-stat-lbl', text: 'Max Format' })
          ])
        ]),
        el('ul', { class: 'press-highlights' }, 
          press.highlights.map(h => el('li', { text: h }))
        )
      ]);
      
      cardsWrap.appendChild(card);
    });

    // Populate full specs table
    CFG.PRESSES.forEach(press => {
      const tr = el('tr', {}, [
        el('td', { html: `<strong>${press.model}</strong>` }),
        el('td', { text: press.config }),
        el('td', { html: `${press.sheetFormat}<br><small style="color:var(--text-muted)">${press.substrateRange}</small>` }),
        el('td', { text: press.maxSpeed }),
        el('td', {}, [
          el('span', { class: `status-badge ${press.status.toLowerCase().includes('standby') ? 'standby' : ''}`, text: press.status })
        ])
      ]);
      tbody.appendChild(tr);
    });

    // Animate counters when card comes into view
    if (window.IntersectionObserver) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counter = entry.target.querySelector('.spec-counter');
            if (counter) {
              const target = parseInt(counter.dataset.val, 10);
              const span = counter.querySelector('span');
              let current = 0;
              const step = Math.ceil(target / 45); // ~1s at 60fps
              const update = () => {
                current += step;
                if (current > target) current = target;
                span.textContent = current.toLocaleString() + '+';
                if (current < target) requestAnimationFrame(update);
              };
              update();
            }
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      $$('.press-card').forEach(card => observer.observe(card));
    }
  }

  // --------------------------------------------------------------------------
  // Quote Segment (Configurator)
  // --------------------------------------------------------------------------
  function initQuote() {
    const form = $('#quote-form');
    if (!form || !window.RFQ) return;

    // Populate dropdowns and checkboxes
    const stockSel = $('#rfq-stock');
    RFQ.SUBSTRATES.forEach(s => stockSel.appendChild(el('option', { value: s.id, text: s.label })));

    const colorSel = $('#rfq-colors');
    RFQ.COLORS.forEach(c => colorSel.appendChild(el('option', { value: c.id, text: c.label })));
    colorSel.value = '44'; // default 4/4

    const turnSel = $('#rfq-turnaround');
    RFQ.TIMELINES.forEach(t => turnSel.appendChild(el('option', { value: t.id, text: t.label })));

    const finishesWrap = $('#rfq-finishes');
    RFQ.FINISHES.forEach(f => {
      const lbl = el('label', { class: 'checkbox-item' }, [
        el('input', { type: 'checkbox', value: f.id, id: `chk-${f.id}` }),
        document.createTextNode(` ${f.label}`)
      ]);
      finishesWrap.appendChild(lbl);
    });
    // Default checked
    ['spotuv', 'foil', 'softtouch', 'diecut'].forEach(id => {
      const c = $(`#chk-${id}`);
      if(c) c.checked = true;
    });

    // Populate GSM ticks
    const gsmTicks = $('#gsm-ticks');
    RFQ.GSM.ticks.forEach(t => {
      gsmTicks.appendChild(el('span', { text: t }));
    });

    // Qty logic
    const qtySlider = $('#rfq-qty-slider');
    const qtyInput = $('#rfq-qty-input');
    
    qtySlider.addEventListener('input', () => {
      const q = RFQ.QUANTITIES[qtySlider.value];
      qtyInput.value = q ? q.id : 1000;
      updateQuote();
    });

    qtyInput.addEventListener('change', () => {
      let val = parseInt(qtyInput.value, 10);
      if (isNaN(val) || val < 1) val = 1000;
      qtyInput.value = val;
      updateQuote();
    });

    // GSM logic
    const gsmSlider = $('#rfq-gsm');
    const gsmValDisplay = $('#gsm-val-display');
    gsmSlider.addEventListener('input', () => {
      const nearest = RFQ.nearestTick(gsmSlider.value, 10);
      if (nearest) gsmSlider.value = nearest;
      gsmValDisplay.textContent = `${gsmSlider.value} GSM`;
      updateQuote();
    });

    // Attach listener to all relevant inputs
    const inputs = $$('#quote-form input, #quote-form select');
    inputs.forEach(inp => inp.addEventListener('change', () => updateQuote(false)));

    // Initial setup
    $('#ticket-id').textContent = RFQ.rfqNumber();
    updateQuote(true);

    // WhatsApp Action
    $('#btn-send-wa').addEventListener('click', handleWaSubmit);
  }

  let lastEst = {};
  
  function updateQuote(initial = false) {
    if (!window.RFQ) return;
    const gsm = $('#rfq-gsm').value;
    const sub = $('#rfq-stock').value || 'art';
    const col = $('#rfq-colors').value || '44';
    const qty = $('#rfq-qty-input').value;
    const tl = $('#rfq-turnaround').value || 'standard';
    
    const fins = $$('#rfq-finishes input:checked').map(cb => cb.value);

    const est = RFQ.estimate({
      gsm, substrate: sub, color: col, quantity: qty, timeline: tl, finishes: fins
    });

    // Update DOM
    updateTicketRow('#sum-band', est.band.title, initial);
    updateTicketRow('#sum-product', $('#rfq-product').value, initial);
    updateTicketRow('#sum-dims', `${$('#rfq-length').value}x${$('#rfq-width').value}x${$('#rfq-height').value} mm`, initial);
    updateTicketRow('#sum-stock', `${est.gsm} GSM ${est.substrate.label}`, initial);
    updateTicketRow('#sum-colors', est.color.label, initial);
    updateTicketRow('#sum-finishes', est.finishes.length ? est.finishes.map(f => f.label.split(' ')[0]).join(', ') : 'None', initial);
    updateTicketRow('#sum-qty', Number(qty).toLocaleString('en-US'), initial);
    updateTicketRow('#sum-timeline', est.timeline.label, initial);

    $('#qty-val-display').textContent = `${Number(qty).toLocaleString('en-US')} units`;

    // Counter animation for range
    animateEstimate(est.range.low, est.range.high, est.perUnit);
    lastEst = est;
  }

  function updateTicketRow(selector, newVal, initial) {
    const el = $(selector);
    if (!el) return;
    if (el.textContent !== newVal && !initial) {
      el.textContent = newVal;
      const row = el.closest('.ticket-row');
      if (row) {
        row.classList.remove('flash');
        void row.offsetWidth; // trigger reflow
        row.classList.add('flash');
        setTimeout(() => row.classList.remove('flash'), 500);
      }
    } else {
      el.textContent = newVal;
    }
  }

  let estAnimId = null;
  function animateEstimate(low, high, perUnit) {
    const rangeEl = $('#sum-range');
    const unitEl = $('#sum-unit');
    if (!rangeEl || !window.gsap) return;

    if (estAnimId) {
      gsap.killTweensOf(rangeEl);
    }

    const startLow = parseFloat((rangeEl.dataset.low || "0").replace(/,/g, ''));
    const startHigh = parseFloat((rangeEl.dataset.high || "0").replace(/,/g, ''));

    const obj = { l: startLow, h: startHigh };
    gsap.to(obj, {
      l: low, h: high, duration: 0.6, ease: 'power2.out',
      onUpdate: () => {
        rangeEl.textContent = `${RFQ.fmtPKR(obj.l)} - ${RFQ.fmtPKR(obj.h)}`;
      },
      onComplete: () => {
        rangeEl.dataset.low = low;
        rangeEl.dataset.high = high;
      }
    });

    unitEl.textContent = `PKR ${perUnit.toFixed(2)} / unit`;
  }

  function handleWaSubmit() {
    const comp = $('#rfq-company').value.trim();
    const phone = $('#rfq-phone').value.trim();
    const err = $('#rfq-company-error');
    
    if (!comp || !phone) {
      err.classList.add('form-error--visible');
      return;
    }
    err.classList.remove('form-error--visible');

    const contact = {
      company: comp,
      name: $('#rfq-name').value.trim(),
      phone: phone
    };

    const notes = $('#rfq-notes').value.trim();
    const rfqNo = $('#ticket-id').textContent;
    const msg = RFQ.buildMessage(lastEst, contact, rfqNo, notes);
    const url = RFQ.whatsappUrl(CFG.CONTACT.whatsapp, msg);

    // Print animation
    if (!window.gsap || prefersReducedMotion) {
      window.open(url, '_blank');
      return;
    }

    const ticket = $('#job-ticket');
    gsap.timeline()
      .set(ticket, { clipPath: 'inset(100% 0 0 0)' })
      .to(ticket, { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power1.inOut' })
      .to({}, { duration: 0.5 }) // hold
      .call(() => {
        window.open(url, '_blank');
        gsap.set(ticket, { clearProps: 'clipPath' });
      });
  }

  // --------------------------------------------------------------------------
  // Boot
  // --------------------------------------------------------------------------
  function init() {
    renderHeroStats();
    initHeader();
    initHeroAnimation();
    initHeroParallax();
    initPortfolio();
    initFleet();
    initQuote();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
