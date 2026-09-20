# TKJ Toolkit

A modern collection of networking, developer, and IT utility tools.
Essential tools for networks, developers, and IT professionals — fast,
practical, and privacy-friendly.

## Features

- 18 real, working tools across 4 categories
- Networking: IP Calculator, Subnet Calculator, CIDR Calculator, MAC Generator,
  HTTP Header Checker, DNS Lookup, HTTP Connectivity Check, Port Checker
- Developer: Base64 Encoder/Decoder, URL Encoder/Decoder, JSON Formatter,
  JWT Decoder, Hash Generator
- Generators: Password Generator, QR Code Generator
- Utilities: Color Converter, Unit Converter, User-Agent Detector
- Light / Dark / System theme with localStorage persistence
- Global search and category filtering
- Fully responsive (360px → 1440px)
- Accessible: semantic HTML, labels, focus states, ARIA where needed
- No fake functionality — tools that the browser cannot perform (ICMP ping,
  raw TCP port checks) say so honestly instead of inventing results

## Tech Stack

- HTML5
- CSS3 (CSS variables, no framework)
- Vanilla JavaScript (modular, `"use strict"`)
- Font Awesome Free 6 (CDN)
- Inter (Google Fonts, `display=swap`)
- qrcodejs (CDN) — used only by the QR Code Generator

## Project Structure

```
tkj-toolkit/
├── index.html
├── 404.html
├── tools/            # tool directory + 18 tool pages
├── pages/            # about, privacy, terms
├── css/              # style, components, tools, responsive
├── js/
│   ├── app.js, theme.js, search.js, tools-data.js,
│   ├── toast.js, clipboard.js, utils.js
│   └── tools/        # one module per tool
├── assets/images/
├── robots.txt
├── sitemap.xml
├── README.md
└── .gitignore
```

## Running Locally

Simply open `index.html`, or use any static web server:

```bash
python -m http.server 8000
```

Then open http://localhost:8000

> Note: the Hash Generator requires a secure context, so use
> http://localhost or HTTPS for that tool (this is a browser rule for
> the Web Crypto API, not a limitation of the site).

## Deployment

The project is fully static and can be deployed to:

- GitHub Pages
- Netlify
- Cloudflare Pages
- Vercel (static hosting)
- Any static hosting provider

## Privacy

Almost every tool processes data entirely in your browser. DNS Lookup uses
Cloudflare's public DNS-over-HTTPS API; the HTTP tools make requests directly
from your browser to the target. See `pages/privacy.html` for details.

## License

MIT
