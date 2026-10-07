/**
 * Lahore Precision Printworks — Site Configuration
 * =================================================
 * This is the ONLY file a non-developer should edit.
 * Every value marked TODO must be replaced before launch.
 *
 * After editing, redeploy. No build step required.
 */

/* exported SITE_CONFIG */
/* eslint-disable no-unused-vars */

const SITE_CONFIG = {

  /* ── Contact ─────────────────────────────────────────────── */
  CONTACT: {
    whatsapp: '+920000000000',        // TODO: real WhatsApp number with country code
    phone: '+92 000 0000000',         // TODO: real phone number
    email: 'info@example.com',        // TODO: real email
    addresses: [
      {
        label: 'Head Office & Plant',
        lines: '123 Industrial Area, Sundar Road',  // TODO: real address
        city: 'Lahore',                              // TODO: real city
        zip: '54000',                                // TODO: real postal code
        country: 'PK',
        mapUrl: 'https://maps.google.com/?q=31.5204,74.3587' // TODO: real pin
      }
    ],
    hours: 'Mon – Sat  08:00 – 20:00',   // TODO: real hours
    timezone: 'Asia/Karachi'
  },

  /* ── Hero proof stats ────────────────────────────────────── */
  STATS: [
    { value: '18+',  label: 'Years in Business' },   // TODO: verify
    { value: '200M+', label: 'Cartons / Year' },      // TODO: verify
    { value: '120+', label: 'Active Clients' }        // TODO: verify
  ],

  /* ── Industries ──────────────────────────────────────────── */
  INDUSTRIES: [
    { name: 'Pharma',          icon: 'pill' },
    { name: 'FMCG',            icon: 'box' },
    { name: 'Cosmetics',       icon: 'sparkle' },
    { name: 'Confectionery',   icon: 'candy' },
    { name: 'Corporate',       icon: 'building' }
  ],

  /* ── Press / Capability cards ────────────────────────────── */
  PRESSES: [
    {
      name: 'Heidelberg Speedmaster XL 106',           // TODO: verify model
      type: 'Offset Sheet-fed',
      colors: '6-color + coater',
      maxSpeed: '18,000 sph',
      maxSheet: '750 × 1060 mm',
      bestFor: 'Folding cartons, pharma packs, premium retail',
      specs: [
        ['Max Sheet', '750 × 1060 mm'],
        ['Colors', '6 + inline coater'],
        ['Speed', '18,000 sheets/hr'],
        ['Registration', '±0.02 mm'],
        ['Substrate Range', '80 – 800 gsm']
      ]
    },
    {
      name: 'KBA Rapida 106',                           // TODO: verify model
      type: 'Offset Sheet-fed',
      colors: '5-color',
      maxSpeed: '15,000 sph',
      maxSheet: '720 × 1060 mm',
      bestFor: 'Long-run FMCG cartons, labels',
      specs: [
        ['Max Sheet', '720 × 1060 mm'],
        ['Colors', '5'],
        ['Speed', '15,000 sheets/hr'],
        ['Registration', '±0.03 mm'],
        ['Substrate Range', '80 – 600 gsm']
      ]
    },
    {
      name: 'Bobst Expertfold 110 A2',                  // TODO: verify model
      type: 'Folder-Gluer',
      colors: 'N/A',
      maxSpeed: '75,000 blanks/hr',
      maxSheet: '1100 mm feed',
      bestFor: 'Straight-line, lock-bottom, 4/6-corner boxes',
      specs: [
        ['Max Blank', '1100 × 800 mm'],
        ['Min Blank', '120 × 80 mm'],
        ['Speed', 'Up to 75,000 blanks/hr'],
        ['Fold Types', 'Straight, crash-lock, 4 & 6 corner'],
        ['Glue', 'Hot melt + cold glue']
      ]
    },
    {
      name: 'Bobst Mastercut 106 PER',                  // TODO: verify model
      type: 'Die-Cutter',
      colors: 'N/A',
      maxSpeed: '9,000 sph',
      maxSheet: '760 × 1060 mm',
      bestFor: 'Precision die-cutting, creasing, embossing',
      specs: [
        ['Max Sheet', '760 × 1060 mm'],
        ['Speed', '9,000 sheets/hr'],
        ['Cutting Force', '300 tonnes'],
        ['Stripping', 'Full blanking'],
        ['Register', 'Optical camera system']
      ]
    },
    {
      name: 'KAMA ProFold 74',                          // TODO: verify model
      type: 'Hot Foil & Emboss',
      colors: 'N/A',
      maxSpeed: '5,000 sph',
      maxSheet: '520 × 740 mm',
      bestFor: 'Hot foil stamping, embossing, spot UV',
      specs: [
        ['Max Sheet', '520 × 740 mm'],
        ['Speed', '5,000 sheets/hr'],
        ['Foil Width', 'Up to 740 mm'],
        ['Temperature', 'Up to 200 °C'],
        ['Pressure', 'Up to 400 kN']
      ]
    }
  ],

  /* ── Trust / Certifications ─────────────────────────────── */
  CLAIMS: [
    {
      name: 'ISO 9001:2015',          // TODO: verify — do NOT fabricate
      enabled: false,
      verifyUrl: ''                    // TODO: link to certification body
    },
    {
      name: 'ISO 14001',              // TODO: verify — do NOT fabricate
      enabled: false,
      verifyUrl: ''
    },
    {
      name: 'FSC Chain of Custody',   // TODO: verify — do NOT fabricate
      enabled: false,
      verifyUrl: ''
    },
    {
      name: 'DRAP Approved',          // TODO: verify — do NOT fabricate
      enabled: false,
      verifyUrl: ''
    }
  ],

  /* ── Client logos (empty by default; add only REAL clients) */
  CLIENTS: [
    // { name: 'Client Name', logo: 'assets/client-logo.webp' }
    // TODO: add real clients ONLY with written permission
  ],

  /* ── RFQ form options ────────────────────────────────────── */
  PRODUCT_TYPES: [
    'Folding Carton',
    'Rigid Box',
    'Pharma Carton',
    'Brochure / Catalog',
    'Labels',
    'Other'
  ],

  PAPER_STOCKS: [
    { label: 'SBS C1S — 230 gsm', value: 'SBS-C1S-230' },
    { label: 'SBS C1S — 280 gsm', value: 'SBS-C1S-280' },
    { label: 'SBS C1S — 350 gsm', value: 'SBS-C1S-350' },
    { label: 'SBS C2S — 300 gsm', value: 'SBS-C2S-300' },
    { label: 'Art Card — 300 gsm', value: 'ART-300' },
    { label: 'Kraft — 250 gsm',   value: 'KRAFT-250' },
    { label: 'Grey-back Duplex — 300 gsm', value: 'DUPLEX-300' },
    { label: 'Metalized Card — 280 gsm',   value: 'MET-280' }
  ],

  COLOR_OPTIONS: [
    { label: 'CMYK 4/0 (one side)',        value: '4-0' },
    { label: 'CMYK 4/4 (both sides)',      value: '4-4' },
    { label: 'CMYK + 1 PMS',              value: '4-0-1pms' },
    { label: 'CMYK + 2 PMS',              value: '4-0-2pms' }
  ],

  FINISHES: [
    { label: 'Spot UV',             value: 'spot-uv' },
    { label: 'Hot Foil Stamping',   value: 'hot-foil' },
    { label: 'Embossing',           value: 'embossing' },
    { label: 'Soft-touch Lamination', value: 'soft-touch' },
    { label: 'Die-cutting',         value: 'die-cutting' },
    { label: 'Gluing',              value: 'gluing' }
  ],

  QUANTITY_PRESETS: [1000, 3000, 5000, 10000, 25000, 50000, 100000],

  TURNAROUND: [
    { label: 'Standard (10–14 business days)', value: 'standard' },
    { label: 'Express (5–7 business days)',    value: 'express' }
  ],

  /* ── Pricing rules (all values are placeholders) ─────────
   * TODO: replace ALL numbers with real pricing.
   * The estimator shows a RANGE (±12 %) and is clearly labeled
   * "indicative only".
   */
  PRICING: {
    baseCost: {
      'Folding Carton':       3.50,   // TODO: PKR per unit at 1000 qty
      'Rigid Box':            12.00,  // TODO
      'Pharma Carton':        4.00,   // TODO
      'Brochure / Catalog':   8.00,   // TODO
      'Labels':               1.20,   // TODO
      'Other':                5.00    // TODO
    },

    /* Multiply base by this factor based on stock */
    gsmFactor: {
      'SBS-C1S-230':  1.00,   // TODO
      'SBS-C1S-280':  1.12,   // TODO
      'SBS-C1S-350':  1.28,   // TODO
      'SBS-C2S-300':  1.18,   // TODO
      'ART-300':      1.15,   // TODO
      'KRAFT-250':    0.90,   // TODO
      'DUPLEX-300':   0.85,   // TODO
      'MET-280':      1.45    // TODO
    },

    /* Multiply by color factor */
    colorFactor: {
      '4-0':      1.00,   // TODO
      '4-4':      1.60,   // TODO
      '4-0-1pms': 1.25,   // TODO
      '4-0-2pms': 1.40    // TODO
    },

    /* Flat adder per unit for each finish */
    finishAdder: {
      'spot-uv':    0.80,   // TODO
      'hot-foil':   1.50,   // TODO
      'embossing':  1.00,   // TODO
      'soft-touch': 0.60,   // TODO
      'die-cutting': 0.40,  // TODO
      'gluing':     0.30    // TODO
    },

    /* Quantity discount: if qty >= threshold, multiply total by factor */
    quantityDiscount: [
      { min: 1,      factor: 1.00 },   // TODO
      { min: 3000,   factor: 0.88 },   // TODO
      { min: 5000,   factor: 0.78 },   // TODO
      { min: 10000,  factor: 0.68 },   // TODO
      { min: 25000,  factor: 0.58 },   // TODO
      { min: 50000,  factor: 0.50 },   // TODO
      { min: 100000, factor: 0.44 }    // TODO
    ],

    expressMultiplier: 1.35,   // TODO: express surcharge
    rangePct: 0.12             // ±12 % indicative range
  }
};

/* ── Startup: warn about remaining TODOs ─────────────────── */
(function checkTodos() {
  var src = '';
  try {
    /* Reading self is not possible statically; instead we serialise
       the config and look for the TODO sentinel in comments above.
       This is a best-effort runtime check. */
    var json = JSON.stringify(SITE_CONFIG);
    var placeholders = [];

    /* Check for obviously-fake contact values */
    if (SITE_CONFIG.CONTACT.whatsapp.indexOf('000') !== -1)
      placeholders.push('CONTACT.whatsapp');
    if (SITE_CONFIG.CONTACT.phone.indexOf('000') !== -1)
      placeholders.push('CONTACT.phone');
    if (SITE_CONFIG.CONTACT.email === 'info@example.com')
      placeholders.push('CONTACT.email');
    if (SITE_CONFIG.CONTACT.addresses[0].lines.indexOf('123') !== -1)
      placeholders.push('CONTACT.addresses[0]');

    /* Check pricing for round placeholder values */
    var allPricesDefault = Object.values(SITE_CONFIG.PRICING.baseCost)
      .every(function (v) { return v === 3.50 || v === 12 || v === 4 || v === 8 || v === 1.2 || v === 5; });
    if (allPricesDefault)
      placeholders.push('PRICING.baseCost (all values look like defaults)');

    if (placeholders.length) {
      console.warn(
        '%c⚠ Lahore Precision Printworks — TODO placeholders still present:',
        'color:#FF5A1F;font-weight:bold',
        '\n • ' + placeholders.join('\n • ') +
        '\n\nEdit config.js before going live.'
      );
    }
  } catch (e) { /* silently ignore in case of CSP or other issues */ }
})();
