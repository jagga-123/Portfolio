# Sandeep Kumar — Portfolio

Production-ready static portfolio built with HTML, Tailwind (CDN), and vanilla JS.

## Features
- Animated hero with particles and typing
- Theme toggle (persistent)
- Projects fetched from GitHub (fallback to local JSON)
- Certifications from `certifications.json` (admin-friendly)
- Contact form (mailto fallback; EmailJS optional)
- Accessibility & performance minded

## File structure
- index.html
- styles.css
- scripts.js
- certifications.json
- projects.json
- assets/
  - hero-illustration.svg
  - favicon.svg
  - README_ASSETS.md

## Local setup
1. Open the folder in a static server or VS Code Live Server.
2. Ensure `assets/Sandeep_Kumar_Resume.pdf` exists if you want the resume download to work.

Quick preview using Python (from project root):

```bash
# Python 3
python -m http.server 8080
# then open http://localhost:8080
```

## How to update
- Add new certifications to `certifications.json`.
- Add or edit `projects.json` entries or let the site pull them directly from GitHub (username `jagga-123`).

## Deployment
See `DEPLOY.md` for Vercel / Netlify instructions.

## Notes
- This is a static, production-ready starter: for higher performance and SEO, consider converting to Next.js or Astro with Tailwind installed and image optimization.

"# Portfolio" 
