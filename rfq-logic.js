/* ==========================================================================
   rfq-logic.js  -  GSM & Job Configurator logic (no DOM, no dependencies)

   RECONSTRUCTED from screen-recording frames of the previous site.
   Items marked [SEEN] were visible on screen. Items marked [INFERRED]
   are sensible guesses - replace them with the client's real numbers.
   All prices are PLACEHOLDERS (marked TODO) until the client confirms.

   Calibration point [SEEN]:
     399 GSM Art Card, 4/4 CMYK, 10,000 units, Standard run,
     finishes = Spot UV + Kurz foil + Soft-touch + Die-cutting
     => PKR 255,400  (PKR 25.54 / unit, about USD 919)

   Works in the browser (window.RFQ) and in Node (module.exports).
   ========================================================================== */
(function (root) {
  'use strict';

  /* ---------------------------------------------------------------------
     1. SLIDER + BANDS  (GSM drives recommendation, application, press)
     --------------------------------------------------------------------- */
  const GSM = { min: 128, max: 400, step: 1, ticks: [128, 170, 250, 300, 350, 400] }; // [SEEN]

  const PRESS = {
    XL106:   'Heidelberg Speedmaster XL 106-6+L',
    SM74:    'Heidelberg Speedmaster SM 74-4',
    CD102:   'Heidelberg Speedmaster CD 102',
    SBG:     'Cylinder SBG Platen',
    DIECUT:  'High-Tonnage Die-Cutter'
  };

  // First band whose [from, to] contains the GSM value wins.
  const BANDS = [
    { from: 128, to: 169, title: 'Flyers, Leaflets & Light Brochures',        // [INFERRED]
      text: 'Ideal for promotional flyers, inserts, leaflets and light brochure inner pages.',
      application: 'Commercial Print',
      press: [PRESS.SM74], icon: 'file' },
    { from: 170, to: 199, title: 'Brochure Covers & Catalog Pages',           // [INFERRED]
      text: 'Ideal for brochure covers, catalog pages, menus and product sheets.',
      application: 'Premium Commercial',
      press: [PRESS.SM74, PRESS.XL106], icon: 'book' },
    { from: 200, to: 250, title: 'Presentation Folders & Covers',             // [SEEN]
      text: 'Ideal for die-cut corporate presentation folders, booklet outer covers, luxury event invitations, corporate certificates & table tents.',
      application: 'Heavy Commercial',
      press: [PRESS.XL106, PRESS.SBG], icon: 'folder' },
    { from: 251, to: 299, title: 'Lightweight Folding Cartons',               // [INFERRED]
      text: 'Ideal for cosmetic and pharma folding cartons, sleeves, shelf-ready retail packs and hang tags.',
      application: 'Folding Carton',
      press: [PRESS.XL106], icon: 'box' },
    { from: 300, to: 350, title: 'Heavy Packaging & Rigid Cards',             // [SEEN title]
      text: 'Ideal for FMCG cartons, beverage packs, confectionery boxes and rigid card packaging with heavy ink coverage.',
      application: 'Industrial Packaging',
      press: [PRESS.XL106, PRESS.CD102], icon: 'layers' },
    { from: 351, to: 379, title: 'Premium Rigid Boxes & Display Board',       // [INFERRED]
      text: 'Ideal for premium gift boxes, display stands and heavy duplex board with deep finishes.',
      application: 'Premium Packaging',
      press: [PRESS.CD102, PRESS.DIECUT], icon: 'layers' },
    { from: 380, to: 400, title: 'Ultra-Rigid Luxury Cartons & Display',      // [SEEN]
      text: 'Ideal for rigid cosmetics cartons, luxury perfume boxes, consumer electronics packaging & heavy duplex display board.',
      application: 'Luxury Rigid Packaging',
      press: [PRESS.CD102, PRESS.DIECUT], icon: 'layers' }
  ];

  function getBand(gsm) {
    const g = clamp(Math.round(gsm), GSM.min, GSM.max);
    return BANDS.find(b => g >= b.from && g <= b.to) || BANDS[BANDS.length - 1];
  }

  /* ---------------------------------------------------------------------
     2. OPTIONS
     --------------------------------------------------------------------- */
  const SUBSTRATES = [ // paperRate = PKR per GSM per unit (TODO real numbers)
    { id: 'art',    label: 'Art Card (Premium Matte/Gloss)', paperRate: 0.01313 }, // [SEEN name, rate calibrated]
    { id: 'sbs',    label: 'SBS Solid Bleached Board',       paperRate: 0.01480 }, // [INFERRED]
    { id: 'fbb',    label: 'Folding Box Board (FBB)',        paperRate: 0.01250 }, // [INFERRED]
    { id: 'duplex', label: 'Duplex Grey Back Board',         paperRate: 0.00950 }, // [INFERRED]
    { id: 'rigid',  label: 'Rigid Greyboard + Wrap Paper',   paperRate: 0.01700 }  // [INFERRED]
  ];

  const COLORS = [ // printPerUnit in PKR, plates = count of CTP plates
    { id: '40',    label: '4/0 Full Color (CMYK One Side)',       printPerUnit: 1.90, plates: 4 },  // [INFERRED]
    { id: '44',    label: '4/4 Full Color (CMYK Both Sides)',     printPerUnit: 3.20, plates: 8 },  // [SEEN]
    { id: '44pms', label: '4/4 + Custom PMS Spot',                printPerUnit: 4.40, plates: 10 }, // [INFERRED]
    { id: '66',    label: '6/6 Color + Coater',                   printPerUnit: 5.60, plates: 12 }  // [INFERRED]
  ];

  const QUANTITIES = [ // factor multiplies per-unit variable cost
    { id: 1000,   label: '1,000 Units (Sampling)',          factor: 1.90 }, // [INFERRED]
    { id: 5000,   label: '5,000 Units (Short Run)',         factor: 1.25 }, // [INFERRED]
    { id: 10000,  label: '10,000 Units (FMCG Pilot)',       factor: 1.00 }, // [SEEN qty, label guessed]
    { id: 25000,  label: '25,000 Units (Standard Batch)',   factor: 0.88 }, // [INFERRED]
    { id: 50000,  label: '50,000 Units (Volume)',           factor: 0.80 }, // [INFERRED]
    { id: 100000, label: '100,000 Units (Contract)',        factor: 0.74 }  // [INFERRED]
  ];

  const TIMELINES = [
    { id: 'standard', label: 'Standard Industrial Run', factor: 1.00 },     // [SEEN]
    { id: 'express',  label: 'Express (Priority Slot)', factor: 1.25 }      // [INFERRED]
  ];

  // unit = PKR per piece, setup = one-time PKR (dies, blocks)
  const FINISHES = [
    { id: 'spotuv',    label: 'Spot UV Selective Gloss',                  unit: 2.40, setup: 0 },      // [SEEN name]
    { id: 'foil',      label: 'Kurz\u00AE Hot Gold Foil Stamping',        unit: 5.60, setup: 14000 },  // [SEEN name]
    { id: 'emboss',    label: '3D Multi-Level Embossing',                 unit: 4.20, setup: 16000 },  // [SEEN name]
    { id: 'softtouch', label: 'Soft-Touch Velvet Lamination',             unit: 2.90, setup: 0 },      // [SEEN name]
    { id: 'diecut',    label: 'Custom Precision Die-Cutting & Creasing',  unit: 1.80, setup: 18000 },  // [SEEN name]
    { id: 'dripoff',   label: 'Hybrid Drip-Off Texture',                  unit: 3.10, setup: 0 }       // [SEEN name]
  ];

  const MONEY = {
    platePrice: 1500,       // PKR per CTP plate (TODO)
    expressAppliesToSetup: false,
    roundTo: 100,           // round the total to nearest PKR 100
    usdRate: 278,           // PKR per USD, for the "approx USD" line (TODO keep updated)
    rangePct: 0.12          // +/- band for the displayed range
  };

  /* ---------------------------------------------------------------------
     3. ESTIMATOR
     total = setup + qty * variablePerUnit * qtyFactor * timelineFactor
       variablePerUnit = gsm*paperRate + printPerUnit + sum(finish.unit)
       setup           = plates*platePrice + sum(finish.setup)
     --------------------------------------------------------------------- */
  const DEFAULTS = {
    gsm: 300, substrate: 'art', color: '44', quantity: 10000,
    timeline: 'standard', finishes: ['spotuv', 'foil', 'softtouch', 'diecut']
  };

  function byId(list, id) { return list.find(x => String(x.id) === String(id)) || list[0]; }
  function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }
  function roundTo(n, step) { return Math.round(n / step) * step; }

  function estimate(input) {
    const s = Object.assign({}, DEFAULTS, input || {});
    const gsm = clamp(Math.round(Number(s.gsm) || DEFAULTS.gsm), GSM.min, GSM.max);
    const sub = byId(SUBSTRATES, s.substrate);
    const col = byId(COLORS, s.color);
    const qty = byId(QUANTITIES, s.quantity);
    const tl = byId(TIMELINES, s.timeline);
    const fins = (s.finishes || []).map(id => FINISHES.find(f => f.id === id)).filter(Boolean);

    const paper = gsm * sub.paperRate;
    const finishUnit = fins.reduce((a, f) => a + f.unit, 0);
    const variablePerUnit = paper + col.printPerUnit + finishUnit;

    const setup = col.plates * MONEY.platePrice + fins.reduce((a, f) => a + f.setup, 0);

    const quantity = Number(qty.id);
    const tlFactor = tl.factor;
    const variableTotal = quantity * variablePerUnit * qty.factor * tlFactor;
    const setupTotal = setup * (MONEY.expressAppliesToSetup ? tlFactor : 1);

    const total = roundTo(setupTotal + variableTotal, MONEY.roundTo);
    const perUnit = total / quantity;

    return {
      gsm, band: getBand(gsm),
      substrate: sub, color: col, quantity, timeline: tl, finishes: fins,
      total,
      perUnit: Math.round(perUnit * 100) / 100,
      usd: Math.round(total / MONEY.usdRate),
      range: {
        low: roundTo(total * (1 - MONEY.rangePct), MONEY.roundTo),
        high: roundTo(total * (1 + MONEY.rangePct), MONEY.roundTo)
      },
      breakdown: { paper, print: col.printPerUnit, finishUnit, variablePerUnit, setup }
    };
  }

  /* ---------------------------------------------------------------------
     4. RFQ NUMBER, FORMATTING, WHATSAPP MESSAGE
     --------------------------------------------------------------------- */
  function rfqNumber() {
    return 'RFQ-#LPW-' + String(Math.floor(1000 + Math.random() * 9000)); // [SEEN format]
  }

  function fmtPKR(n) { return 'PKR ' + Math.round(n).toLocaleString('en-US'); }

  function buildMessage(est, contact, rfqNo, notes) {
    const c = contact || {};
    const lines = [
      '*New RFQ - ' + (rfqNo || rfqNumber()) + '*',
      '',
      '*Specification*',
      'Paper: ' + est.gsm + ' GSM - ' + est.substrate.label,
      'Application: ' + est.band.application,
      'Assigned press: ' + est.band.press.join(' & '),
      'Colors: ' + est.color.label,
      'Quantity: ' + est.quantity.toLocaleString('en-US') + ' units',
      'Finishes: ' + (est.finishes.length ? est.finishes.map(f => f.label).join(', ') : 'None'),
      'Timeline: ' + est.timeline.label,
      '',
      '*Indicative estimate*',
      fmtPKR(est.total) + ' (approx PKR ' + est.perUnit.toFixed(2) + ' / unit)',
      'Range: ' + fmtPKR(est.range.low) + ' - ' + fmtPKR(est.range.high),
      '_Indicative only. Final quote after artwork and stock review._'
    ];
    if (notes) lines.push('', '*Job notes*', notes);
    if (c.company || c.name || c.phone) {
      lines.push('', '*Client*',
        'Company: ' + (c.company || '-'),
        'Contact: ' + (c.name || '-'),
        'WhatsApp: ' + (c.phone || '-'));
    }
    return lines.join('\n');
  }

  function whatsappUrl(number, message) {
    return 'https://wa.me/' + String(number).replace(/\D/g, '') +
           '?text=' + encodeURIComponent(message);
  }

  /* ---------------------------------------------------------------------
     5. SLIDER HELPERS (position 0..1, tick snapping)
     --------------------------------------------------------------------- */
  function gsmProgress(gsm) { return (clamp(gsm, GSM.min, GSM.max) - GSM.min) / (GSM.max - GSM.min); }
  function tickPercent(t) { return gsmProgress(t) * 100; }
  function nearestTick(gsm, within) {
    const w = within == null ? 3 : within;
    return GSM.ticks.find(t => Math.abs(t - gsm) <= w) || null;
  }

  const RFQ = {
    GSM, BANDS, SUBSTRATES, COLORS, QUANTITIES, TIMELINES, FINISHES, MONEY, DEFAULTS,
    getBand, estimate, rfqNumber, fmtPKR, buildMessage, whatsappUrl,
    gsmProgress, tickPercent, nearestTick
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = RFQ;
  else root.RFQ = RFQ;
})(typeof window !== 'undefined' ? window : globalThis);
