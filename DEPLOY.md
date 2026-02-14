# Deployment Guide

## Vercel (recommended)
1. Create a Vercel account and connect your GitHub repository.
2. Push this project to GitHub.
3. In Vercel, import the repo and set the framework to "Other" or "Static Site".
4. Set the build command to blank and the output directory to `/` (static). Deploy.

## Netlify
1. Connect your GitHub repo to Netlify.
2. For a static site without a build step, set the build command empty and publish directory `/`.
3. Deploy and configure domain.

## GitHub Pages
- Push to `gh-pages` branch or configure to serve from `main`/`docs` folder.

## Environment variables
- If using EmailJS or other services, set keys in your hosting provider's environment variables and update `scripts.js` integration.

