# Sandeep Kumar — Portfolio

A static portfolio site. No build tools, no framework, no dependencies — open `index.html` in a browser or serve the folder as-is.

## Architecture (single source of truth)

- `index.html` — the one real page. All content (hero, about, skills, projects, experience, education, certifications, contact) is real static markup, so it's fully readable without JavaScript and fully crawlable/indexable.
- `styles.css` — the design system (color/type/spacing tokens + components). Linked from every page.
- `scripts.js` — behavior only: theme toggle, mobile menu, scroll effects, contact-form validation, live GitHub stats (progressive enhancement, not required for content to render), keyboard shortcuts. No content lives in this file.
- `projects/*.html` — one case-study page per featured project.
- `projects.json` — the reference record for the 4 featured projects (name, tagline, tech, links, case-study path). **Not fetched by the page** — it's the file to edit first when a project changes, then mirror the same edit into the `#projects` cards in `index.html` and the matching `projects/*.html` page. Keeping this manual (rather than templated) was a deliberate call for a build-free static site — templating from JSON client-side would mean the projects section renders empty until JavaScript runs, which breaks crawlers and link-preview bots.
- `certifications.json` — same pattern: the reference record for the `#certifications` cards.

If this project ever needs projects/certs to be truly data-driven without hurting crawlability, that means adding a build step (Astro/11ty/Next static export) that renders the JSON into HTML at build time — not client-side fetching.

## Local setup

No build step. Open `index.html` directly, or serve the folder:

```bash
python -m http.server 8080
# then open http://localhost:8080
```

## How to update

- **A project changes**: edit `projects.json` (reference), the project card in `index.html`, and its `projects/<slug>.html` case study — all three, by hand.
- **A certification is added**: edit `certifications.json` (reference) and the matching card in `index.html`.
- **Resume**: replace `assets/Sandeep_Kumar_Resume.pdf`. Every "Resume" control on the site (nav, hero, mobile menu, the `R` keyboard shortcut) links straight to that file — there is no external Drive/cloud link anywhere, on purpose.
- **Domain**: live at `https://portfolio-website-eight-beryl-67.vercel.app/` (canonical tags, Open Graph tags, `sitemap.xml`, `robots.txt` all point here). If a custom domain is attached later, search the repo for `portfolio-website-eight-beryl-67.vercel.app` and replace it everywhere.

## Deployment

See `DEPLOY.md`.

## Notes

- `og:image`/`twitter:image` use `assets/og-image.png` (1200×630, rendered from `assets/og-image.svg` — regenerate by opening the SVG in a browser at that viewport and re-exporting if the source ever changes).
- Live GitHub stats (`#githubStats`) call the public GitHub API client-side. The numbers already in the HTML are today's real values, used as the fallback if the API call fails or is rate-limited — the block never shows a broken/empty state.
