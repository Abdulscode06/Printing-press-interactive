const SITE_CONFIG = {
  CONTACT: {
    whatsapp: '+92 000 0000000', // TODO: Replace with real WhatsApp number
    phone: '+92 000 0000000', // TODO: Replace with real phone number
    email: 'rfq@example.com', // TODO: Replace with real email
    addresses: [
      {
        label: 'Sundar Industrial Heavy Press Facility',
        lines: '123 Fake Street, Sundar Industrial Estate', // TODO: Replace
        city: 'Lahore',
        zip: '54000',
        country: 'PK',
        mapUrl: 'https://maps.google.com/?q=Lahore',
        details: '45,000 sq ft climate-controlled pressroom, Heidelberg multi-color sheetfed lines, automatic die-cutters and folder-gluers, 500kVA uninterruptible diesel backup.',
        hours: '24 hours / 7 days',
        specialty: 'FMCG, pharma, large format'
      },
      {
        label: 'Royal Park Pre-Press & Client Center',
        lines: '456 Fake Road, Royal Park', // TODO: Replace
        city: 'Lahore',
        zip: '54000',
        country: 'PK',
        mapUrl: 'https://maps.google.com/?q=Lahore',
        details: 'Heidelberg Suprasetter CTP, Epson calibrated proofing press, CAD sample cutting table, executive conference suite.',
        hours: 'Mon-Sat 9:00 AM - 8:30 PM',
        specialty: 'Express proofing, paper stock library, custom die making'
      }
    ],
    logistics: 'Enclosed container trucks, same-day Lahore delivery, overnight Punjab industrial corridor, Karachi and export via Port Qasim, corner-guard packaging.'
  },
  STATS: [
    { value: '6', label: 'Active Press Lines' },
    { value: 'B1 & B2', label: 'Full Sheet Formats' },
    { value: '100%', label: 'Heidelberg OEM press fleet' },
    { value: '24/7', label: 'Redundant Diesel Backup' }
  ],
  PRESSES: [
    {
      model: 'Speedmaster XL 106-6+L',
      config: '6 colors + inline coater',
      maxSpeed: '18,000 SPH',
      sheetFormat: '750x1060 mm',
      substrateRange: '60-450 GSM',
      highlights: ['Prinect Inpress Control 3', 'Autoplate XL 3', 'Hycolor Multidrive'],
      status: 'In Production',
      flagship: true
    },
    {
      model: 'Speedmaster SM 74-4',
      config: '4 colors CMYK',
      maxSpeed: '15,000 SPH',
      sheetFormat: '530x740 mm',
      substrateRange: '70-350 GSM',
      highlights: ['CP2000 touchscreen', 'Alcolor dampening', 'Auto register'],
      status: 'In Production'
    },
    {
      model: 'Speedmaster CD 102-5',
      config: '5 colors + custom spot',
      maxSpeed: '15,000 SPH',
      sheetFormat: '720x1020 mm',
      substrateRange: '100-600 GSM',
      highlights: ['Preset Plus Delivery', 'AirTransfer System', 'AutoWash'],
      status: 'Ready / Standby'
    },
    {
      model: 'Cylinder SBG 56x77',
      config: 'Heavy platen die-cutter and hot foil',
      maxSpeed: '4,200 SPH',
      sheetFormat: '560x770 mm',
      substrateRange: '80-700 GSM',
      highlights: ['High-tonnage impression', 'Heated foil bed', 'Precision register'],
      status: 'In Production'
    },
    {
      model: 'Suprasetter A106 CTP',
      config: 'Thermal plate setter',
      maxSpeed: '38 plates/hour',
      sheetFormat: 'max plate 930x1140 mm',
      substrateRange: 'aluminum 0.15-0.30 mm',
      highlights: ['Internal punch', 'Auto loader', 'Laser diodes'],
      status: 'In Production'
    },
    {
      model: 'Polar Mohr 115',
      config: 'High-speed cutter',
      maxSpeed: '45 cuts/min',
      sheetFormat: '1150 mm width',
      substrateRange: 'pile height 165 mm',
      highlights: ['OptiKnife', 'Touch-screen program', 'Air table'],
      status: 'In Production'
    }
  ],
  PORTFOLIO: [
    {
      id: 'spotuv',
      tags: ['Spot UV & High Gloss', 'Tuck-End Cosmetic Monocarton'],
      title: 'High-Build Spot UV',
      desc: 'Precision high-build spot UV on soft-touch velvet carton.',
      packagingType: 'Tuck-End Cosmetic Monocarton',
      registration: '+/-0.08mm micro-camera sensor',
      applications: 'Luxury perfume cartons, premium skincare, spirits packaging',
      pressUnit: 'Heidelberg XL 106 inline UV dryer'
    },
    {
      id: 'foil',
      tags: ['Hot Gold Stamping', '400 GSM rigid bleached board', 'Kurz foil'],
      title: 'Kurz Metallic Hot Gold Stamping',
      desc: '540C high-pressure brass stamped die, zero flaking. Micro-etched brass dies.',
      packagingType: 'Rigid Presentation Box Cover',
      registration: 'Mechanical precision platen',
      applications: 'Premium cosmetics, confectionary, corporate gifting',
      pressUnit: 'Cylinder SBG Platen'
    },
    {
      id: 'emboss',
      tags: ['3D Sculptured Emboss', '350 GSM high-bulk cotton board', '1.4mm depth'],
      title: 'Multi-Tier Sculptured Relief',
      desc: 'Blind debossing and raised paper relief. 1.8mm deep multi-bevel matrix.',
      packagingType: 'Premium Boutique Carton',
      registration: 'Male/Female brass counter die',
      applications: 'Boutique retail packaging, invites, high-end apparel',
      pressUnit: 'High-Tonnage Die-Cutter'
    },
    {
      id: 'holographic',
      tags: ['Prismatic Cold Foil', '350 GSM SBS', 'Anti-Counterfeit'],
      title: 'Holographic Security Cold Foil',
      desc: 'Inline prismatic cold foil with CMYK overprinting. Rainbow spectrum dispersion, inline over-printable.',
      packagingType: 'Pharma / Electronics Carton',
      registration: 'Inline offset unit registration',
      applications: 'Pharma, cosmetics, electronics',
      pressUnit: 'Heidelberg XL 106 inline cold foil module'
    },
    {
      id: 'dripoff',
      tags: ['Hybrid Drip-Off', 'FMCG Carton', 'Single-pass'],
      title: 'Hybrid Drip-Off UV',
      desc: 'Single-pass dual-texture drip-off coating. Micro-sand matte vs high-gloss UV droplet, 100% inline, no offline silk-screen passes.',
      packagingType: 'Beverage / Confectionery Pack',
      registration: 'Inline coating plate',
      applications: 'FMCG confectionery, beverage packs, catalog jackets',
      pressUnit: 'Heidelberg XL 106'
    }
  ],
  FACILITIES: [
    { name: '45,000 sq ft Plant', desc: 'Climate-controlled pressroom ensuring perfect paper conditioning.' },
    { name: 'Redundant Backup', desc: '500kVA uninterruptible diesel backup for zero downtime.', highlight: true },
    { name: 'In-house CTP', desc: 'Thermal plate-setting directly from studio to press.' },
    { name: 'Post-Press Finishing', desc: 'Die-cutting, folding, gluing and premium foil stamping in one facility.' },
    { name: 'FSC Certified', desc: 'Committed to responsible forestry.', highlight: true }
  ],
  CLAIMS: [
    { name: 'ISO 9001:2015', enabled: false, verifyUrl: '#' },
    { name: 'FSC Certified', enabled: false, verifyUrl: '#' }
  ],
  CLIENTS: []
};

// Console warning for placeholders
(function() {
  const warnings = [];
  if (SITE_CONFIG.CONTACT.whatsapp.includes('000')) warnings.push('CONTACT.whatsapp');
  if (SITE_CONFIG.CONTACT.phone.includes('000')) warnings.push('CONTACT.phone');
  if (SITE_CONFIG.CONTACT.email.includes('example.com')) warnings.push('CONTACT.email');
  if (SITE_CONFIG.CONTACT.addresses[0].lines.includes('Fake')) warnings.push('CONTACT.addresses[0]');
  if (warnings.length > 0) {
    console.warn('%c⚠ Lahore Precision Printworks — TODO placeholders still present:', 'color:#FF5A1F;font-weight:bold', '\n • ' + warnings.join('\n • '));
  }
})();
