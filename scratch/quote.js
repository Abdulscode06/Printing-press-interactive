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
    inputs.forEach(inp => inp.addEventListener('change', updateQuote));

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
    const sub = $('#rfq-stock').value;
    const col = $('#rfq-colors').value;
    const qty = $('#rfq-qty-input').value;
    const tl = $('#rfq-turnaround').value;
    
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
