# Lahore Precision Printworks — Interactive B2B Website

A high-performance, single-page marketing and lead-generation website for a commercial B2B printing press in Lahore, Pakistan. Built with vanilla HTML/CSS/JS and GSAP animations — no framework, no build step, instant deploy.

![Hero](https://img.shields.io/badge/Stack-HTML%20%2F%20CSS%20%2F%20JS-orange?style=flat-square)
![Animations](https://img.shields.io/badge/Animations-GSAP%20%2B%20ScrollTrigger-green?style=flat-square)
![Design](https://img.shields.io/badge/Design-Glassmorphism%20%2B%20Dark-blueviolet?style=flat-square)

---

## ✨ Features

- **Animated Hero** — GSAP-powered press-room motion with orange accent slot
- **Live Press Fleet** — Interactive cards for all 6 Heidelberg machines (specs, status, highlights)
- **Portfolio Showcase** — Filterable gallery of premium print finishes (Spot UV, hot foil stamping, sculptured emboss, holographic cold foil, drip-off UV)
- **RFQ Configurator** — Real-time quote estimator: substrate, GSM, quantity, finishes → instant price band + job ticket PDF-ready output
- **Plant & Facilities** — Climate-controlled pressroom, diesel backup, FSC certification
- **Trust Section** — ISO / FSC claim badges, client logos slot
- **Responsive** — Mobile-first layout, works across all viewports
- **SEO-ready** — `sitemap.xml`, `robots.txt`, semantic HTML, meta tags

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Markup | Semantic HTML5 |
| Styling | CSS custom properties, CSS Grid, Flexbox, glassmorphism |
| Animations | [GSAP](https://gsap.com/) + ScrollTrigger (self-hosted) |
| Typography | Inter (self-hosted `.woff2`) |
| Logic | Vanilla JS (ES6 modules) |
| Config | `config.js` — single source of truth for all business data |

---

## 📁 Project Structure

```
├── index.html          # Single-page entry point
├── styles.css          # All styling (design tokens, components, sections)
├── app.js              # GSAP animations, interactions, section rendering
├── rfq-logic.js        # RFQ pricing engine and job ticket generation
├── config.js           # Business data (presses, portfolio, contacts, stats)
├── assets/
│   ├── gsap.min.js
│   ├── ScrollTrigger.min.js
│   └── inter-latin-*.woff2
├── robots.txt
├── sitemap.xml
└── _headers            # Netlify / CDN cache headers
```

---

## 🚀 Running Locally

No build tools required. Just open in a browser:

```bash
# Option 1 — direct file open
open index.html

# Option 2 — local dev server (avoids CORS on font loading)
npx serve .
# or
python -m http.server 8080
```

---

## ⚙️ Configuration

All business-specific content lives in [`config.js`](./config.js). Update these before going live:

```js
CONTACT: {
  whatsapp: '+92 300 0000000',   // ← real WhatsApp number
  phone:    '+92 42  0000000',   // ← real landline
  email:    'rfq@yourpress.com', // ← real RFQ email
  addresses: [ ... ]             // ← real facility addresses + map URLs
}
```

The site logs a console warning if placeholder values are still present.

---

## 📦 Deployment

Drop the files on any static host — no server required:

- **Netlify** — drag & drop the folder, `_headers` is auto-picked up
- **GitHub Pages** — enable Pages on the `main` branch
- **Cloudflare Pages** — connect the repo, no build command needed

---

## 📋 Print Finishes Covered

| Finish | Process | Application |
|---|---|---|
| High-Build Spot UV | XL 106 inline UV | Luxury cosmetics, spirits |
| Kurz Hot Gold Stamping | SBG Platen brass die | Premium gifting, confectionery |
| Sculptured Emboss | Male/female counter die | Boutique retail, apparel |
| Holographic Cold Foil | Inline prismatic foil | Pharma, electronics |
| Hybrid Drip-Off UV | Single-pass dual-texture | FMCG, beverage packs |

---

## 📄 License

This project is a client demonstration. All brand assets, press specifications, and copy are placeholders unless explicitly replaced.
