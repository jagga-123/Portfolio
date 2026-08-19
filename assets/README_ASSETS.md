Production assets:

- `Sandeep_Kumar_Resume.pdf` — the resume every "Resume" control on the site links to directly. Replace this file to update the resume; no other change needed.
- `favicon.svg` — browser-tab icon, matches the site's palette (`--ink` / `--accent`).
- `og-image.svg` — link-preview image for LinkedIn/Slack/Facebook/iMessage shares. X/Twitter needs PNG/JPG specifically — export this to a 1200×630 PNG when image tooling is available and update the `og:image`/`twitter:image` tags in `index.html` to point at it.
- `projects/helperhub.png`, `projects/ai-b2b-textile.png` — real screenshots of each app's public landing page (960×540), used by both the `.project-thumb` card in `index.html` and the `.case-thumb` banner in the matching `projects/*.html` case study. Re-capture and overwrite either file any time that project's live landing page changes.

Not present yet, would improve the site if added:

- Screenshots for VibeConnect and CampusCare. Both apps require sign-in before showing any real screen, so a straight screenshot only captures a generic login form — not worth swapping in for the current gradient placeholder. Two options: add demo/guest credentials so a screenshot can show the actual feed/dashboard, or manually capture and crop a signed-in view and drop it in as `projects/vibeconnect.png` / `projects/campuscare.png` following the same pattern as the two above.
