# Deployment Guide

Static site — no build command, no output directory beyond the repo root.

## Vercel (recommended)
1. Import the GitHub repo into Vercel.
2. Framework preset: "Other" / static. Build command: blank. Output directory: `/`.
3. Deploy.

## Netlify
1. Connect the GitHub repo.
2. Build command: blank. Publish directory: `/`.
3. Deploy.

## GitHub Pages
- Serve from `main` (or a `docs/` folder if preferred).

## After the first deploy

1. Note the real deployed URL.
2. Find-and-replace `YOUR-DOMAIN-HERE` across the repo (`index.html`, `projects/*.html`, `sitemap.xml`, `robots.txt`) with that real domain.
3. Redeploy.

## Contact form

The contact form validates client-side and hands off to a `mailto:` link — no backend, no API keys, nothing to configure. If a real inbound form (e.g. Formspree) is wanted later, that only requires changing the `fetch`/`mailto` call in `scripts.js`'s `setupContactForm()` — no HTML changes needed.
