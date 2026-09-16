
---

# ۲. نسخه انگلیسی (`README.md`)

```markdown
<div align="center">

# Afsaneha (افسانه‌ها) 🏔️
### An Open, Community-Driven Archive of Iran's Folklore and Local Legends

[![License: MIT](https://img.shields.io/badge/Code_License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Content: CC BY 4.0](https://img.shields.io/badge/Content-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-success.svg)](#)
[![PWA Ready](https://img.shields.io/badge/PWA-Supported-purple.svg)](#)
[![Static Site](https://img.shields.io/badge/Deploy-GitHub_Pages-black.svg)](#)

[فارسی / Persian](./README.fa.md) • [Live Demo](https://faragomanyoutube.github.io/afsaneha/) • [Submit a Legend](https://faragomanyoutube.github.io/afsaneha/contribute.html)

</div>

---

## 📖 About The Project

Local folklore, mythical creatures, oral tales, and regional proverbs passed down across Iran's mountains, deserts, and valleys are at risk of being lost in modern times.

**Afsaneha** is a decentralized, digital public archive designed to collect, record, and safeguard Iran's regional legends for posterity. Anyone — even without a technical background or a GitHub account — can submit folklore from their local town or village, keeping their original dialect, cultural context, and author attribution intact.

---

## ✨ Key Features

* **🗺️ Interactive Vector Map of Iran:** Built with hand-tuned, pure SVG (zero Mapbox/Leaflet bloat). Features equirectangular coordinate projection, layered parallax depth on scroll, and one-click province filtering.
* **🚀 Pure Zero-Dependency Architecture:** No React, No Tailwind, No bundlers. Crafted in vanilla HTML5, modern CSS3, and native ES modules for blazing-fast performance (100/100 Lighthouse score) and decades of longevity.
* **🗄️ Git as a Resilient Database:** Legends are stored as clean, structured Markdown files under `legends/`. If the site or domain disappears, the entire archive remains accessible and human-readable forever.
* **🤝 Account-free Public Submissions:** Powered by a lightweight Cloudflare Worker that validates community submissions via Turnstile and automatically opens an organized GitHub Pull Request for maintainer review.
* **🎙️ Audio Narration Support:** Built-in audio playback for regional dialects and spoken-word storytelling by local elders.
* **📖 Distraction-Free Reading Mode:** Immersive reading view with enlarged typography, clean margins, and quick escape toggling.
* **❄️ Seasonal Accents:** Automatic festive adaptations (e.g., Shab-e Yalda with animated snowfall and custom accents).
* **📱 Offline-Ready PWA:** Full service worker caching and manifest support for reading anywhere, anytime.
* **🌐 Bilingual Support:** Instant toggle between Persian and English with native RTL/LTR layout transitions.

---

## 📂 Repository Layout

```text
├── index.html              # Homepage (Search, interactive map, filters, cards)
├── legend.html             # Dynamic single-legend view
├── contribute.html         # Submission portal for contributors
├── contributors.html       # Hall of contributors
├── about.html              # Project backstory & guide
├── config.json             # Global site configurations & Worker endpoint
├── sw.js                   # Service worker for offline PWA caching
│
├── assets/
│   ├── css/style.css       # Dark/parchment light themes, 3D tilt & grain
│   ├── js/                 # Framework-free vanilla modules (map, i18n, app, season...)
│   └── data/               # Pre-compiled JSON datasets & manifest
│
├── legends/                # ⬅️ Core archive! Markdown files categorized by province
│   └── <province>/
│       └── <legend-slug>/
│           ├── fa.md       # Persian source text with metadata
│           ├── en.md       # Optional English translation
│           └── voice.mp3   # Optional spoken audio track
│
├── scripts/
│   ├── build.mjs           # Zero-dependency SSG for SEO pages, sitemap & RSS feeds
│   └── build-index.mjs     # Builds index JSON
│
└── worker/                 # Cloudflare Worker bot handling web-to-PR submissions
