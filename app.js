/* Lahore Precision Printworks — App · Premium Redesign */
(function () {
  'use strict';
  var CFG = window.SITE_CONFIG;
  if (!CFG) { console.error('config.js must load before app.js'); return; }

  /* ── Utilities ─────────────────────────────────────────── */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function el(tag, a, ch) {
    var n = document.createElement(tag);
    if (a) Object.keys(a).forEach(function (k) {
      if (k === 'text') n.textContent = a[k];
      else if (k === 'html') n.innerHTML = a[k];
      else n.setAttribute(k, a[k]);
    });
    if (ch) ch.forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function fmt(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    return n >= 1e3 ? n.toLocaleString('en-PK') : String(n);
  }
  function waUrl(ph, txt) {
    return 'https://wa.me/' + ph.replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent(txt);
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var STORAGE_KEY = 'lpp_rfq_draft';
  function saveDraft(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch (e) {} }
  function loadDraft() { try { var d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; } catch (e) { return null; } }

  function genRfqNumber() {
    var n = new Date();
    return 'RFQ-' + String(n.getFullYear()).slice(-2) +
      String(n.getMonth() + 1).padStart(2, '0') +
      String(n.getDate()).padStart(2, '0') + '-' +
      String(Math.floor(Math.random() * 9000) + 1000);
  }

  var ICONS = {
    pill: '<svg viewBox="0 0 20 20" fill="none"><rect x="3" y="7" width="14" height="6" rx="3" stroke="currentColor" stroke-width="1.5"/><line x1="10" y1="7" x2="10" y2="13" stroke="currentColor" stroke-width="1.5"/></svg>',
    box: '<svg viewBox="0 0 20 20" fill="none"><path d="M3 7l7-4 7 4v6l-7 4-7-4V7z" stroke="currentColor" stroke-width="1.5"/><path d="M3 7l7 4m0 0l7-4m-7 4v7" stroke="currentColor" stroke-width="1.5"/></svg>',
    sparkle: '<svg viewBox="0 0 20 20" fill="none"><path d="M10 2l1.5 5.5L17 10l-5.5 1.5L10 17l-1.5-5.5L3 10l5.5-1.5L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    candy: '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M6.5 6.5L3 3m7.5 11l3 3.5M14 6l3-3m-10.5 11L3 17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    building: '<svg viewBox="0 0 20 20" fill="none"><rect x="4" y="3" width="12" height="14" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="7" y="6" width="2" height="2" rx=".5" fill="currentColor"/><rect x="11" y="6" width="2" height="2" rx=".5" fill="currentColor"/><rect x="7" y="10" width="2" height="2" rx=".5" fill="currentColor"/><rect x="11" y="10" width="2" height="2" rx=".5" fill="currentColor"/><rect x="8.5" y="14" width="3" height="3" fill="currentColor"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/></svg>'
  };

  /* ── Render Functions (same data-binding as original) ──── */
  function renderHeroStats() {
    var w = $('#hero-stats'); if (!w) return;
    CFG.STATS.forEach(function (s) {
      var c = el('div', {});
      c.appendChild(el('div', { class: 'hero__stat-value', text: s.value }));
      c.appendChild(el('div', { class: 'hero__stat-label', text: s.label }));
      w.appendChild(c);
    });
  }

  function renderHeroWA() {
    var b = $('#hero-wa-btn');
    if (b) b.href = waUrl(CFG.CONTACT.whatsapp, "Hi, I'd like to inquire about printing services.");
  }

  function renderIndustries() {
    var list = $('#industries-list'); if (!list) return;
    CFG.INDUSTRIES.forEach(function (ind) {
      var item = el('div', { class: 'industries__item' });
      item.appendChild(el('span', { class: 'industries__icon', html: ICONS[ind.icon] || '' }));
      item.appendChild(el('span', { text: ind.name }));
      list.appendChild(item);
    });
  }

  function renderCapabilities() {
    var grid = $('#capabilities-grid'); if (!grid) return;
    CFG.PRESSES.forEach(function (p, idx) {
      var card = el('div', { class: 'cap-card' + (idx === 0 ? ' cap-card--flagship' : '') });
      card.appendChild(el('div', { class: 'cap-card__type', text: p.type }));
      card.appendChild(el('div', { class: 'cap-card__name', text: p.name }));
      var meta = el('div', { class: 'cap-card__meta' });
      [['Colors', p.colors], ['Max Speed', p.maxSpeed]].forEach(function (pair) {
        var g = el('div', {});
        g.appendChild(el('div', { class: 'cap-card__meta-label', text: pair[0] }));
        g.appendChild(el('div', { class: 'cap-card__meta-value', text: pair[1] }));
        meta.appendChild(g);
      });
      card.appendChild(meta);
      card.appendChild(el('div', { class: 'cap-card__best', html: '<strong>Best for:</strong> ' + p.bestFor }));
      if (p.specs && p.specs.length) {
        var det = el('details', {});
        det.appendChild(el('summary', { text: 'Full specifications' }));
        var sl = el('div', { class: 'spec-list' });
        p.specs.forEach(function (row) {
          var r = el('div', { class: 'spec-list__row' });
          r.appendChild(el('span', { class: 'spec-list__label', text: row[0] }));
          r.appendChild(el('span', { class: 'spec-list__value', text: row[1] }));
          sl.appendChild(r);
        });
        det.appendChild(sl);
        card.appendChild(det);
      }
      grid.appendChild(card);
    });
  }

  function renderTrust() {
    var sec = $('#trust'), cw = $('#trust-certs'), clw = $('#trust-clients');
    if (!sec) return;
    var anyOn = CFG.CLAIMS.some(function (c) { return c.enabled; });
    var hasCl = CFG.CLIENTS && CFG.CLIENTS.length > 0;
    if (!anyOn && !hasCl) return;
    sec.classList.add('trust--visible');
    if (anyOn && cw) CFG.CLAIMS.forEach(function (c) {
      if (!c.enabled) return;
      var b = el('div', { class: 'cert-badge' });
      b.appendChild(el('span', { class: 'cert-badge__icon', html: ICONS.check }));
      b.appendChild(el('span', { text: c.name }));
      if (c.verifyUrl) b.appendChild(el('a', { href: c.verifyUrl, target: '_blank', rel: 'noopener', text: 'Verify' }));
      cw.appendChild(b);
    });
    if (hasCl && clw) CFG.CLIENTS.forEach(function (c) {
      clw.appendChild(el('img', { src: c.logo, alt: c.name, class: 'trust__client-logo', loading: 'lazy', width: '120', height: '40' }));
    });
  }

  function renderPlant() {
    var grid = $('#plant-grid'); if (!grid) return;
    var C = CFG.CONTACT;
    C.addresses.forEach(function (a) {
      var card = el('div', { class: 'plant-card' });
      card.appendChild(el('div', { class: 'plant-card__label', text: a.label }));
      card.appendChild(el('div', { class: 'plant-card__text', html:
        a.lines + '<br>' + a.city + ' ' + a.zip +
        (a.mapUrl ? '<br><a href="' + a.mapUrl + '" target="_blank" rel="noopener">View on Google Maps →</a>' : '')
      }));
      grid.appendChild(card);
    });
    var cc = el('div', { class: 'plant-card' });
    cc.appendChild(el('div', { class: 'plant-card__label', text: 'Get in Touch' }));
    cc.appendChild(el('div', { class: 'plant-card__text', html:
      '<div class="contact-row"><strong>Phone:</strong> <a href="tel:' + C.phone.replace(/\s/g, '') + '">' + C.phone + '</a></div>' +
      '<div class="contact-row"><strong>WhatsApp:</strong> <a href="' + waUrl(C.whatsapp, "Hi, I'd like to inquire about your printing services.") + '" target="_blank" rel="noopener">' + C.whatsapp + '</a></div>' +
      '<div class="contact-row"><strong>Email:</strong> <a href="mailto:' + C.email + '">' + C.email + '</a></div>'
    }));
    grid.appendChild(cc);
    var hc = el('div', { class: 'plant-card' });
    hc.appendChild(el('div', { class: 'plant-card__label', text: 'Business Hours' }));
    hc.appendChild(el('div', { class: 'plant-card__text', text: C.hours }));
    grid.appendChild(hc);
  }

  function renderFooter() {
    var y = $('#footer-year'); if (y) y.textContent = new Date().getFullYear();
  }

  function renderWAFloat() {
    var b = $('#wa-float');
    if (b) b.href = waUrl(CFG.CONTACT.whatsapp, "Hi, I'd like to get a quote for printing.");
  }

  function setupWAFloatObserver() {
    var btn = $('#wa-float'), qs = $('#quote');
    if (!btn || !qs || !window.IntersectionObserver) return;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        btn.classList.toggle('wa-float--hidden', e.isIntersecting);
      });
    }, { threshold: 0.1 }).observe(qs);
  }

  /* ── RFQ Configurator (UNCHANGED LOGIC) ────────────────── */
  var rfqNumber = genRfqNumber();
  var rafPending = false;
  var prevSummaryValues = {};

  function populateRFQForm() {
    var prodSel = $('#rfq-product');
    CFG.PRODUCT_TYPES.forEach(function (p) { prodSel.appendChild(el('option', { value: p, text: p })); });
    var stockSel = $('#rfq-stock');
    CFG.PAPER_STOCKS.forEach(function (s) { stockSel.appendChild(el('option', { value: s.value, text: s.label })); });
    var colorSel = $('#rfq-colors');
    CFG.COLOR_OPTIONS.forEach(function (c) { colorSel.appendChild(el('option', { value: c.value, text: c.label })); });
    var finishWrap = $('#rfq-finishes');
    CFG.FINISHES.forEach(function (f) {
      var lbl = el('label', { class: 'checkbox-label' });
      lbl.appendChild(el('input', { type: 'checkbox', value: f.value, 'data-label': f.label }));
      lbl.appendChild(el('span', { text: f.label }));
      finishWrap.appendChild(lbl);
    });
    var presetWrap = $('#rfq-qty-presets');
    CFG.QUANTITY_PRESETS.forEach(function (q) {
      presetWrap.appendChild(el('button', { type: 'button', class: 'qty-preset', text: fmt(q), 'data-qty': q }));
    });
    var turnSel = $('#rfq-turnaround');
    CFG.TURNAROUND.forEach(function (t) { turnSel.appendChild(el('option', { value: t.value, text: t.label })); });
    var numEl = $('#rfq-number');
    if (numEl) numEl.textContent = rfqNumber;
  }

  function getFormData() {
    var fins = [], finLbls = [];
    $$('#rfq-finishes input[type="checkbox"]:checked').forEach(function (cb) {
      fins.push(cb.value); finLbls.push(cb.getAttribute('data-label'));
    });
    var ss = $('#rfq-stock'), cs = $('#rfq-colors'), ts = $('#rfq-turnaround');
    return {
      product: $('#rfq-product').value,
      length: $('#rfq-length').value, width: $('#rfq-width').value, height: $('#rfq-height').value,
      stock: ss.value, stockLabel: ss.selectedIndex > 0 ? ss.options[ss.selectedIndex].text : '',
      colors: cs.value, colorLabel: cs.selectedIndex > 0 ? cs.options[cs.selectedIndex].text : '',
      finishes: fins, finishLabels: finLbls,
      qty: parseInt($('#rfq-qty').value, 10) || 0,
      turnaround: ts.value, turnaroundLabel: ts.selectedIndex > 0 ? ts.options[ts.selectedIndex].text : '',
      company: $('#rfq-company').value.trim(),
      name: $('#rfq-name').value.trim(),
      phone: $('#rfq-phone').value.trim(),
      notes: $('#rfq-notes').value.trim()
    };
  }

  function computeEstimate(d) {
    var P = CFG.PRICING;
    if (!d.product || !d.stock || !d.colors || !d.qty || d.qty < 1) return null;
    var base = P.baseCost[d.product] || P.baseCost['Other'];
    var gsm = P.gsmFactor[d.stock] || 1;
    var color = P.colorFactor[d.colors] || 1;
    var finTotal = 0;
    d.finishes.forEach(function (f) { finTotal += (P.finishAdder[f] || 0); });
    var unit = (base * gsm * color) + finTotal;
    var tiers = P.quantityDiscount.slice().sort(function (a, b) { return b.min - a.min; });
    for (var i = 0; i < tiers.length; i++) {
      if (d.qty >= tiers[i].min) { unit *= tiers[i].factor; break; }
    }
    if (d.turnaround === 'express') unit *= P.expressMultiplier;
    var total = unit * d.qty, r = P.rangePct;
    return {
      totalLow: Math.round(total * (1 - r)), totalHigh: Math.round(total * (1 + r)),
      unitLow: (unit * (1 - r)).toFixed(2), unitHigh: (unit * (1 + r)).toFixed(2)
    };
  }

  function isPhoneValid(p) { var d = p.replace(/[^0-9]/g, ''); return d.length >= 7 && d.length <= 15; }

  var REQUIRED = [
    { id: 'rfq-product', err: 'rfq-product-error', type: 'select' },
    { id: 'rfq-stock', err: 'rfq-stock-error', type: 'select' },
    { id: 'rfq-colors', err: 'rfq-colors-error', type: 'select' },
    { id: 'rfq-qty', err: 'rfq-qty-error', type: 'number', min: 100 },
    { id: 'rfq-turnaround', err: 'rfq-turnaround-error', type: 'select' },
    { id: 'rfq-company', err: 'rfq-company-error', type: 'text' },
    { id: 'rfq-name', err: 'rfq-name-error', type: 'text' },
    { id: 'rfq-phone', err: 'rfq-phone-error', type: 'phone' }
  ];

  function validateSilent(d) {
    if (!d) d = getFormData();
    return d.product && d.stock && d.colors && d.qty >= 100 && d.turnaround && d.company && d.name && isPhoneValid(d.phone);
  }

  function validateAndShow() {
    var ok = true;
    REQUIRED.forEach(function (f) {
      var inp = $('#' + f.id), errEl = $('#' + f.err), v = true;
      if (f.type === 'select') v = inp.value !== '';
      else if (f.type === 'number') v = parseInt(inp.value, 10) >= (f.min || 1);
      else if (f.type === 'phone') v = isPhoneValid(inp.value);
      else v = inp.value.trim() !== '';
      var cls = inp.tagName === 'SELECT' ? 'form-select--error' : 'form-input--error';
      if (!v) { inp.classList.add(cls); if (errEl) errEl.classList.add('form-error--visible'); ok = false; }
      else { inp.classList.remove(cls, 'form-select--error', 'form-input--error'); if (errEl) errEl.classList.remove('form-error--visible'); }
    });
    return ok;
  }

  /* Flash changed rows */
  function flashRow(field) {
    var row = $('.summary-list__row[data-field="' + field + '"]');
    if (!row) return;
    row.classList.remove('flash');
    void row.offsetWidth; // force reflow for re-triggering
    row.classList.add('flash');
    setTimeout(function() { row.classList.remove('flash'); }, 400);
  }

  function updateSummary() {
    var d = getFormData();
    var fields = {
      product: d.product || '\u2014',
      size: (function() {
        var sz = '\u2014';
        if (d.length && d.width) { sz = d.length + ' \u00d7 ' + d.width; if (d.height) sz += ' \u00d7 ' + d.height; sz += ' mm'; }
        return sz;
      })(),
      stock: d.stockLabel || '\u2014',
      colors: d.colorLabel || '\u2014',
      finishes: d.finishLabels.length ? d.finishLabels.join(', ') : '\u2014',
      qty: d.qty > 0 ? fmt(d.qty) : '\u2014',
      turnaround: d.turnaroundLabel || '\u2014'
    };

    // Set values and flash changed ones
    Object.keys(fields).forEach(function(key) {
      var elId = 'sum-' + key;
      var target = $('#' + elId);
      if (!target) return;
      var newVal = fields[key];
      if (prevSummaryValues[key] !== newVal) {
        target.textContent = newVal;
        if (prevSummaryValues[key] !== undefined) {
          flashRow(key);
        }
        prevSummaryValues[key] = newVal;
      }
    });

    var est = computeEstimate(d), rEl = $('#sum-range'), uEl = $('#sum-unit'), mp = $('#mob-est-price'), mu = $('#mob-est-unit');
    if (est) {
      var rs = 'PKR ' + fmt(est.totalLow) + ' \u2013 ' + fmt(est.totalHigh);
      var us = 'PKR ' + est.unitLow + ' \u2013 ' + est.unitHigh + ' per unit';
      rEl.textContent = rs; uEl.textContent = us;
      if (mp) mp.textContent = rs; if (mu) mu.textContent = us;
    } else {
      rEl.textContent = 'Fill in specs above'; uEl.textContent = '';
      if (mp) mp.textContent = '\u2014'; if (mu) mu.textContent = '';
    }
    var valid = validateSilent(d);
    $('#btn-send-wa').disabled = !valid;
    $('#btn-copy-spec').disabled = !valid;
    $('#btn-email').disabled = !valid;
    saveDraft(d);
  }

  function buildSpecText(d) {
    var est = computeEstimate(d), sz = '';
    if (d.length && d.width) { sz = d.length + ' \u00d7 ' + d.width; if (d.height) sz += ' \u00d7 ' + d.height; sz += ' mm'; }
    var lines = [
      '\u2550\u2550\u2550 RFQ: ' + rfqNumber + ' \u2550\u2550\u2550', '',
      'Product: ' + (d.product || 'N/A'), 'Size: ' + (sz || 'N/A'),
      'Stock: ' + (d.stockLabel || 'N/A'), 'Colors: ' + (d.colorLabel || 'N/A'),
      'Finishes: ' + (d.finishLabels.length ? d.finishLabels.join(', ') : 'None'),
      'Quantity: ' + (d.qty > 0 ? fmt(d.qty) : 'N/A'),
      'Turnaround: ' + (d.turnaroundLabel || 'N/A'), '',
      'Company: ' + (d.company || 'N/A'), 'Name: ' + (d.name || 'N/A'),
      'Phone: ' + (d.phone || 'N/A')
    ];
    if (d.notes) lines.push('Notes: ' + d.notes);
    if (est) {
      lines.push('', 'Estimate: PKR ' + fmt(est.totalLow) + ' \u2013 ' + fmt(est.totalHigh),
        'Per unit: PKR ' + est.unitLow + ' \u2013 ' + est.unitHigh,
        '(Indicative only. Final quote after artwork and stock review.)');
    }
    return lines.join('\n');
  }

  /* ── Printer Animation ─────────────────────────────────── */
  var printerBusy = false;

  function runPrinterAnimation(specText, callback) {
    if (printerBusy || prefersReducedMotion) { callback(); return; }
    printerBusy = true;

    var overlay = $('#printer-anim');
    var paper = $('#printer-paper');
    if (!overlay || !paper) { callback(); printerBusy = false; return; }

    paper.textContent = specText;
    overlay.classList.add('printer-anim--active');

    // Animate paper emerging
    var targetHeight = Math.min(paper.scrollHeight, 360);
    paper.style.maxHeight = '0px';

    // Use GSAP if available, otherwise simple
    if (window.gsap) {
      gsap.to(paper, {
        maxHeight: targetHeight,
        duration: 1.2,
        ease: 'power2.out',
        onComplete: function() {
          setTimeout(function() {
            gsap.to(overlay, {
              opacity: 0,
              duration: 0.3,
              onComplete: function() {
                overlay.classList.remove('printer-anim--active');
                overlay.style.opacity = '';
                paper.style.maxHeight = '';
                printerBusy = false;
                callback();
              }
            });
          }, 800);
        }
      });
    } else {
      paper.style.transition = 'max-height 1.2s ease-out';
      paper.style.maxHeight = targetHeight + 'px';
      setTimeout(function() {
        overlay.classList.remove('printer-anim--active');
        paper.style.maxHeight = '';
        paper.style.transition = '';
        printerBusy = false;
        callback();
      }, 2200);
    }
  }

  function sendWhatsApp() {
    if (!validateAndShow()) return;
    var d = getFormData();
    var specText = buildSpecText(d);
    var url = waUrl(CFG.CONTACT.whatsapp, specText);

    runPrinterAnimation(specText, function() {
      window.open(url, '_blank', 'noopener');
    });
  }

  function copySpec() {
    if (!validateAndShow()) return;
    var txt = buildSpecText(getFormData());
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () { copyFb(true); }).catch(function () { fbCopy(txt); });
    } else { fbCopy(txt); }
  }

  function fbCopy(txt) {
    var ta = document.createElement('textarea');
    ta.value = txt; ta.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); copyFb(true); } catch (e) { copyFb(false); }
    document.body.removeChild(ta);
  }

  function copyFb(ok) {
    var b = $('#btn-copy-spec'), orig = b.textContent;
    b.textContent = ok ? 'Copied \u2713' : 'Failed';
    setTimeout(function () { b.textContent = orig; }, 2000);
  }

  function emailSpec() {
    if (!validateAndShow()) return;
    var d = getFormData(), subj = 'RFQ ' + rfqNumber + ' \u2014 ' + (d.product || 'Print Job');
    window.location.href = 'mailto:' + CFG.CONTACT.email + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(buildSpecText(d));
  }

  function restoreDraft() {
    var dr = loadDraft(); if (!dr) return;
    if (dr.product) $('#rfq-product').value = dr.product;
    if (dr.length) $('#rfq-length').value = dr.length;
    if (dr.width) $('#rfq-width').value = dr.width;
    if (dr.height) $('#rfq-height').value = dr.height;
    if (dr.stock) $('#rfq-stock').value = dr.stock;
    if (dr.colors) $('#rfq-colors').value = dr.colors;
    if (dr.qty) $('#rfq-qty').value = dr.qty;
    if (dr.turnaround) $('#rfq-turnaround').value = dr.turnaround;
    if (dr.company) $('#rfq-company').value = dr.company;
    if (dr.name) $('#rfq-name').value = dr.name;
    if (dr.phone) $('#rfq-phone').value = dr.phone;
    if (dr.notes) $('#rfq-notes').value = dr.notes;
    if (dr.finishes && dr.finishes.length) dr.finishes.forEach(function (v) {
      var cb = $('#rfq-finishes input[value="' + v + '"]'); if (cb) cb.checked = true;
    });
    updateSummary();
  }

  function scheduleUpdate() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () { rafPending = false; updateSummary(); });
  }

  function bindEvents() {
    var formEl = $('#rfq-form'); if (!formEl) return;
    formEl.addEventListener('input', scheduleUpdate, { passive: true });
    formEl.addEventListener('change', scheduleUpdate, { passive: true });
    var pw = $('#rfq-qty-presets');
    if (pw) pw.addEventListener('click', function (e) {
      var btn = e.target.closest('.qty-preset'); if (!btn) return;
      $('#rfq-qty').value = btn.getAttribute('data-qty');
      $$('.qty-preset').forEach(function (b) { b.classList.remove('qty-preset--active'); });
      btn.classList.add('qty-preset--active');
      scheduleUpdate();
    }, { passive: true });
    $('#btn-send-wa').addEventListener('click', sendWhatsApp);
    $('#btn-copy-spec').addEventListener('click', copySpec);
    $('#btn-email').addEventListener('click', emailSpec);
    REQUIRED.forEach(function (f) {
      var inp = $('#' + f.id); if (!inp) return;
      inp.addEventListener('input', function () {
        inp.classList.remove('form-select--error', 'form-input--error');
        var er = $('#' + f.err); if (er) er.classList.remove('form-error--visible');
      }, { passive: true });
    });
  }

  function setupMobileEstimateBar() {
    var bar = $('#mobile-estimate-bar'), qs = $('#quote');
    if (!bar || !qs || !window.IntersectionObserver) return;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { bar.classList.toggle('mobile-estimate-bar--visible', e.isIntersecting); });
    }, { threshold: 0.05 }).observe(qs);
  }

  /* ══════════════════════════════════════════════════════════
     DYNAMIC EFFECTS
     ══════════════════════════════════════════════════════════ */

  /* ── Header solid on scroll ─────────────────────────────── */
  function setupHeader() {
    var header = $('.header');
    var sentinel = $('#header-sentinel');
    if (!header || !sentinel || !window.IntersectionObserver) return;

    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        header.classList.toggle('header--solid', !e.isIntersecting);
      });
    }, { threshold: 0 }).observe(sentinel);
  }

  /* ── Pointer tracking (single rAF loop) ─────────────────── */
  var pointerX = 0, pointerY = 0, pointerActive = false;
  var pointerTargets = []; // { el, handler }

  function setupPointerTracking() {
    if (!hasFinePointer) return;

    document.addEventListener('mousemove', function(e) {
      pointerX = e.clientX;
      pointerY = e.clientY;
      if (!pointerActive) {
        pointerActive = true;
        requestAnimationFrame(updatePointerEffects);
      }
    }, { passive: true });
  }

  function updatePointerEffects() {
    pointerTargets.forEach(function(t) {
      t.handler(pointerX, pointerY);
    });
    pointerActive = false;
  }

  /* ── Hero spotlight ─────────────────────────────────────── */
  function setupHeroSpotlight() {
    if (!hasFinePointer) return;
    var spot = $('.hero__spotlight');
    var hero = $('.hero');
    if (!spot || !hero) return;

    pointerTargets.push({
      el: spot,
      handler: function(x, y) {
        var rect = hero.getBoundingClientRect();
        if (y >= rect.top && y <= rect.bottom) {
          spot.classList.add('hero__spotlight--active');
          spot.style.setProperty('--mx', x + 'px');
          spot.style.setProperty('--my', (y - rect.top) + 'px');
        } else {
          spot.classList.remove('hero__spotlight--active');
        }
      }
    });
  }

  /* ── Press sheet tilt ───────────────────────────────────── */
  function setupPressSheetTilt() {
    if (!hasFinePointer) return;
    var sheet = $('.press-sheet');
    var container = $('.hero__press-sheet');
    if (!sheet || !container) return;

    pointerTargets.push({
      el: sheet,
      handler: function(x, y) {
        var rect = container.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (x - cx) / (rect.width / 2);
        var dy = (y - cy) / (rect.height / 2);
        // Clamp to ±6 degrees
        var rx = Math.max(-6, Math.min(6, -dy * 6));
        var ry = Math.max(-6, Math.min(6, dx * 6));
        sheet.style.setProperty('--rx', rx + 'deg');
        sheet.style.setProperty('--ry', ry + 'deg');
      }
    });
  }

  /* ── Finish tile highlight tracking ─────────────────────── */
  function setupFinishTileHighlights() {
    var tiles = $$('.finish-tile');
    tiles.forEach(function(tile) {
      tile.addEventListener('mousemove', function(e) {
        var rect = tile.getBoundingClientRect();
        tile.style.setProperty('--fx', (e.clientX - rect.left) + 'px');
        tile.style.setProperty('--fy', (e.clientY - rect.top) + 'px');
      }, { passive: true });

      // Touch version
      tile.addEventListener('touchmove', function(e) {
        var touch = e.touches[0];
        var rect = tile.getBoundingClientRect();
        tile.style.setProperty('--fx', (touch.clientX - rect.left) + 'px');
        tile.style.setProperty('--fy', (touch.clientY - rect.top) + 'px');
      }, { passive: true });
    });
  }

  /* ── GSAP Animations ────────────────────────────────────── */
  function setupGSAPAnimations() {
    if (!window.gsap || !window.ScrollTrigger || prefersReducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);

    // Mark JS as ready (enables hidden initial states in CSS)
    document.documentElement.classList.add('js-ready');

    /* — Hero intro stagger (~0.8s total) — */
    var heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTL
      .to('.header__logo', { opacity: 1, y: 0, duration: 0.4 }, 0)
      .to('.header__nav a', { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 }, 0.1)
      .to('.header__cta', { opacity: 1, y: 0, duration: 0.3 }, 0.2)
      .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.4 }, 0.1)
      .to('.hero__h1-line', { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 }, 0.2)
      .to('.hero__sub', { opacity: 1, y: 0, duration: 0.4 }, 0.45)
      .to('.hero__ctas', { opacity: 1, y: 0, duration: 0.4 }, 0.55)
      .to('.hero__press-sheet', { opacity: 1, scale: 1, duration: 0.6 }, 0.3)
      .to('.hero__stats > div', { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, 0.5);

    // Set initial states for hero elements
    gsap.set('.header__logo, .header__nav a, .header__cta', { opacity: 0, y: -10 });
    gsap.set('.hero__press-sheet', { opacity: 0, scale: 0.95 });
    gsap.set('.hero__stats > div', { opacity: 0, y: 16 });

    // Replay timeline (needs to happen after sets)
    heroTL.restart();

    /* — Counter animation for hero stats — */
    $$('.hero__stat-value').forEach(function(el) {
      var text = el.textContent;
      var num = parseInt(text.replace(/[^0-9]/g, ''), 10);
      var suffix = text.replace(/[0-9]/g, '');
      if (isNaN(num)) return;
      var obj = { val: 0 };
      gsap.to(obj, {
        val: num,
        duration: 1.5,
        delay: 0.6,
        ease: 'power2.out',
        onUpdate: function() {
          el.textContent = Math.round(obj.val) + suffix;
        }
      });
    });

    /* — Section heading reveal (clip-path sweep) — */
    $$('.section__title').forEach(function(title) {
      gsap.fromTo(title,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.8,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            once: true
          },
          onComplete: function() { title.classList.add('revealed'); }
        }
      );
    });

    /* — Section eyebrows and subtitles fade in — */
    $$('.section__eyebrow, .section__subtitle').forEach(function(el) {
      gsap.from(el, {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });

    /* — Press cards stagger reveal — */
    $$('.cap-card').forEach(function(card, i) {
      gsap.from(card, {
        opacity: 0,
        y: 40,
        duration: 0.6,
        delay: i * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          once: true
        }
      });
    });

    /* — Finish tiles stagger — */
    $$('.finish-tile').forEach(function(tile, i) {
      gsap.from(tile, {
        opacity: 0,
        y: 32,
        duration: 0.5,
        delay: i * 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: tile,
          start: 'top 88%',
          once: true
        }
      });
    });

    /* — Industries stagger — */
    $$('.industries__item').forEach(function(item, i) {
      gsap.from(item, {
        opacity: 0,
        y: 12,
        duration: 0.3,
        delay: i * 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 95%',
          once: true
        }
      });
    });

    /* — Plant cards — */
    $$('.plant-card').forEach(function(card, i) {
      gsap.from(card, {
        opacity: 0,
        y: 24,
        duration: 0.5,
        delay: i * 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          once: true
        }
      });
    });

    /* — Job ticket reveal — */
    var ticket = $('.job-ticket');
    if (ticket) {
      gsap.from(ticket, {
        opacity: 0,
        y: 32,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ticket,
          start: 'top 85%',
          once: true
        }
      });
    }

    /* — Press sheet parallax (gentle) — */
    var pressSheet = $('.hero__press-sheet');
    if (pressSheet) {
      gsap.to(pressSheet, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
    }
  }

  /* ── 3D Card Tilt on Hover (desktop) ─────────────────────── */
  function setupCardTilt() {
    if (!hasFinePointer) return;

    $$('.cap-card').forEach(function(card) {
      card.addEventListener('mouseenter', function() {
        card.style.willChange = 'transform';
      }, { passive: true });

      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        var rx = y * -4; // max 2 degrees
        var ry = x * 4;
        card.style.transform = 'perspective(600px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale(1.01)';
      }, { passive: true });

      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
        card.style.willChange = '';
      }, { passive: true });
    });
  }

  /* ══════════════════════════════════════════════════════════
     INIT
     ══════════════════════════════════════════════════════════ */
  function init() {
    // Render content (same as before)
    renderHeroStats(); renderHeroWA(); renderIndustries(); renderCapabilities();
    renderTrust(); renderPlant(); renderFooter(); renderWAFloat();
    populateRFQForm(); restoreDraft(); bindEvents();
    setupWAFloatObserver(); setupMobileEstimateBar();

    // Dynamic effects
    setupHeader();
    setupPointerTracking();
    setupHeroSpotlight();
    setupPressSheetTilt();
    setupFinishTileHighlights();
    setupCardTilt();

    // GSAP (deferred slightly to ensure layout is ready)
    requestAnimationFrame(function() {
      setupGSAPAnimations();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
