/* =========================================================
   Portfolio interactions
   Vanilla JS only. No build tools, no dependencies.
   ========================================================= */

(function () {
  'use strict';

  // ---------------------------------------------------------
  // Config
  // ---------------------------------------------------------
  const GITHUB_USER = 'jagga-123';
  // Fill these in when EmailJS is ready:
  // const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
  // const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
  // const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  const EMAILJS_PUBLIC_KEY = '';
  const EMAILJS_SERVICE_ID = '';
  const EMAILJS_TEMPLATE_ID = '';

  const TERMINAL_LINES = [
    'Building full stack web apps...',
    'Crafting MERN stack solutions...',
    'Shipping responsive UIs...'
  ];

  const FEATURED_PROJECTS = [
    { name: 'vibe-connect', liveUrl: 'https://vibe-connect-chi.vercel.app/' },
    { name: 'campuse--care', liveUrl: 'https://campuscare-frontend.onrender.com' },
    { name: '-bharat-founder-pitch-', liveUrl: 'https://bharat-founder-pitch.vercel.app' },
    { name: 'Helperhub', liveUrl: 'https://eclectic-marzipan-57a909.netlify.app/' },
    { name: 'Resume-Builder', liveUrl: 'https://resume-builder-eta-blush.vercel.app/' }
  ];

  const HERO_STATS = [
    { selector: '[data-count-target="10"]', target: 10, suffix: '+' },
    { selector: '[data-count-target="15"]', target: 15, suffix: '+' },
    { selector: '[data-count-target="3"]', target: 3, suffix: '' },
    { selector: '[data-count-target="1"]', target: 1, suffix: '' }
  ];

  const state = {
    theme: 'dark',
    githubVisible: false,
    heroVisible: false,
    radarVisible: false,
    projectFilter: 'all',
    repos: [],
    repoMap: new Map(),
    readmeCache: new Map(),
    modalToken: 0,
    cursorFine: window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(pointer: coarse)').matches,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    profileStats: null,
    languageStats: []
  };

  document.addEventListener('DOMContentLoaded', init);

  // ---------------------------------------------------------
  // Entry point
  // ---------------------------------------------------------
  function init() {
    setupTheme();
    refreshProfileSections();
    injectJourneySection();
    injectOpenToWorkSection();
    setupMobileMenu();
    setupRevealObserver();
    setupBackToTop();
    setupScrollProgress();
    setupActiveNav();
    setupCursor();
    setupHeroCanvas();
    setupTypewriters();
    setupCounters();
    setupRadarChart();
    setupProjectFilters();
    setupProjectModal();
    setupContactForm();
    bindStaticProjectFallbacks();
    loadGithubData();
  }

  // ---------------------------------------------------------
  // Small helpers
  // ---------------------------------------------------------
  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function safeUrl(url) {
    try {
      const parsed = new URL(url);
      return parsed.toString();
    } catch (_) {
      return '#';
    }
  }

  function formatRepoCount(value) {
    return Number.isFinite(value) ? value.toLocaleString() : '0';
  }

  function debounceFrame(fn) {
    let raf = 0;
    return function (...args) {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => fn.apply(this, args));
    };
  }

  function refreshProfileSections() {
    // Refresh the About section copy for a Full Stack focused profile.
    const aboutText = $('.about-text');
    if (aboutText) {
      aboutText.innerHTML = `
        <p>I have graduated from Government Engineering College, Khagaria, with a strong focus on full stack web development. My portfolio showcases modern web applications built using the MERN stack, Next.js, and responsive design principles.</p>
        <p>I build full stack applications — from frontend UIs with React and Next.js to robust backend APIs with Node.js and Express, backed by databases like MongoDB, MySQL, and PostgreSQL. I am currently looking for opportunities where I can contribute as a full stack developer.</p>
        <div style="margin-top:14px">
          <div class="badge-current">Graduate: Ready for Full Stack Roles, Internships & Freelance Work</div>
        </div>
        <div class="tech-wrap" aria-hidden="false">
          <div class="tech-track" id="techTrack">
            <span class="tech-chip">HTML</span>
            <span class="tech-chip">CSS</span>
            <span class="tech-chip">TAILWIND CSS</span>
            <span class="tech-chip">JAVASCRIPT</span>
            <span class="tech-chip">TYPESCRIPT</span>
            <span class="tech-chip">REACT.JS</span>
            <span class="tech-chip">NEXT.JS</span>
            <span class="tech-chip">NODE.JS</span>
            <span class="tech-chip">EXPRESS</span>
            <span class="tech-chip">REST API</span>
            <span class="tech-chip">MONGODB</span>
            <span class="tech-chip">MYSQL</span>
            <span class="tech-chip">POSTGRESQL</span>
            <span class="tech-chip">GIT/GITHUB</span>
            <span class="tech-chip">VS CODE</span>
            <span class="tech-chip">NPM</span>
            <span class="tech-chip">VERCEL</span>
            <span class="tech-chip">NETLIFY</span>
          </div>
        </div>
      `;
    }

    const aboutCards = $all('.detail-card');
    if (aboutCards.length >= 4) {
      const definitions = [
        ['fa-solid fa-code', 'Frontend', 'Building responsive UIs with React.js, Next.js, TypeScript, and Tailwind CSS.'],
        ['fa-solid fa-server', 'Backend', 'Developing REST APIs with Node.js, Express, and integrating with various databases.'],
        ['fa-solid fa-database', 'Databases', 'Working with MongoDB, MySQL, and PostgreSQL for efficient data management.'],
        ['fa-solid fa-layer-group', 'Full Stack', 'Shipping end-to-end web applications with clean UI, robust APIs, and deployed on Vercel/Netlify.']
      ];

      aboutCards.slice(0, 4).forEach((card, index) => {
        const [icon, title, description] = definitions[index];
        card.innerHTML = `
          <div class="left-accent"></div>
          <h4><i class="${icon}"></i>&nbsp;${escapeHtml(title)}</h4>
          <p>${escapeHtml(description)}</p>
        `;
      });
    }

    const skillsSurface = $('.skills-surface');
    if (skillsSurface) {
      skillsSurface.innerHTML = `
        <div class="skills-matrix">
          <div class="skill-matrix-card">
            <h4>Frontend</h4>
            <p>HTML, CSS, JavaScript, TypeScript, React.js, Next.js, Tailwind CSS.</p>
          </div>
          <div class="skill-matrix-card">
            <h4>Backend</h4>
            <p>Node.js, Express.js, REST API development and integration.</p>
          </div>
          <div class="skill-matrix-card">
            <h4>Databases</h4>
            <p>MongoDB, MySQL, PostgreSQL — schema design and query optimization.</p>
          </div>
          <div class="skill-matrix-card">
            <h4>Tools</h4>
            <p>Git, GitHub, VS Code, npm, Vercel, Netlify deployment workflows.</p>
          </div>
          <div class="skill-matrix-card">
            <h4>Full Stack</h4>
            <p>React, Node.js, Express, MongoDB, and hosted deployment workflows.</p>
          </div>
        </div>
        <div class="skill-chip-row">
          <span>HTML</span>
          <span>CSS</span>
          <span>JavaScript</span>
          <span>TypeScript</span>
          <span>React.js</span>
          <span>Next.js</span>
          <span>Tailwind CSS</span>
          <span>Node.js</span>
          <span>Express</span>
          <span>MongoDB</span>
          <span>MySQL</span>
          <span>PostgreSQL</span>
        </div>
      `;
    }

    const heroChipCloud = $('.hero-chip-cloud');
    if (heroChipCloud) {
      heroChipCloud.innerHTML = `
        <span>React.js</span>
        <span>Node.js</span>
        <span>Express</span>
        <span>MongoDB</span>
        <span>Next.js</span>
        <span>TypeScript</span>
      `;
    }

    const projectsGrid = $('#projectsGrid');
    if (projectsGrid) {
      projectsGrid.innerHTML = '<div class="card" style="grid-column:1/-1">Loading featured projects from GitHub...</div>';
    }
  }

  // ---------------------------------------------------------
  // Theme toggle with persisted preference
  // ---------------------------------------------------------
  function setupTheme() {
    const btn = $('#themeToggle');
    const icon = btn ? $('i', btn) : null;
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored || (prefersDark ? 'dark' : 'light');

    applyTheme(initial, false);

    if (!btn) return;

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.body.classList.add('is-theme-transitioning');
      applyTheme(next, true);
      window.setTimeout(() => document.body.classList.remove('is-theme-transitioning'), 460);
    });

    function applyTheme(theme, persist) {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.classList.toggle('theme-dark', theme === 'dark');
      document.body.classList.toggle('theme-light', theme === 'light');
      if (btn) btn.setAttribute('aria-pressed', String(theme === 'dark'));
      if (icon) {
        icon.className = theme === 'light' ? 'fa-regular fa-sun' : 'fa-regular fa-moon';
      }
      if (persist) localStorage.setItem('theme', theme);
      state.theme = theme;
    }
  }

  // ---------------------------------------------------------
  // Inject extra sections without disturbing the existing IDs
  // ---------------------------------------------------------
  function injectJourneySection() {
    if ($('#journey')) return;
    const educationSection = $('#education');
    if (!educationSection || !educationSection.parentElement) return;

    const section = document.createElement('section');
    section.id = 'journey';
    section.className = 'reveal';
    section.setAttribute('aria-labelledby', 'journey-title');
    section.innerHTML = `
      <div class="container">
        <div class="section-tag reveal">04B - Journey</div>
        <h2 id="journey-title" class="section-title reveal">Timeline</h2>
        <p class="section-sub reveal">A short roadmap of how the portfolio and my work have evolved.</p>
        <div class="journey-track">
          <article class="journey-card reveal-left">
            <div class="journey-year">2022</div>
            <h3>Started B.Tech at GEC Khagaria</h3>
            <p>Entered the Computer Science & Engineering program and began exploring the bridge between software, electronics, and applied problem solving.</p>
          </article>
          <article class="journey-card reveal-left" style="transition-delay: 0.08s;">
            <div class="journey-year">2023</div>
            <h3>First weather app + AI emotion detector</h3>
            <p>Built early web and machine learning projects, then completed the NPTEL certification in The Joy of Computing using Python.</p>
          </article>
          <article class="journey-card reveal-left" style="transition-delay: 0.16s;">
            <div class="journey-year">2024</div>
            <h3>Binance bot, IoT smart home, freelancing</h3>
            <p>Expanded into automation, IoT prototyping, and client-oriented development with a stronger focus on shipping usable systems.</p>
          </article>
          <article class="journey-card reveal-left" style="transition-delay: 0.24s;">
            <div class="journey-year">2025</div>
            <h3>Growing ML, cloud IoT, open source</h3>
            <p>Kept building practical proofs of concept, connected more devices to the cloud, and leaned into reusable engineering patterns.</p>
          </article>
          <article class="journey-card reveal-left" style="transition-delay: 0.32s;">
            <div class="journey-year">2026</div>
            <h3>Graduating and seeking internships / full-time</h3>
            <p>Preparing for the next stage with a portfolio that highlights hands-on impact, curiosity, and consistency.</p>
          </article>
        </div>
      </div>
    `;
    educationSection.parentElement.insertBefore(section, educationSection);
  }

  function injectOpenToWorkSection() {
    if ($('#opportunities')) return;
    const contactSection = $('#contact');
    if (!contactSection || !contactSection.parentElement) return;

    const section = document.createElement('section');
    section.id = 'opportunities';
    section.className = 'reveal';
    section.setAttribute('aria-labelledby', 'opportunities-title');
    section.innerHTML = `
      <div class="container">
        <div class="opportunity-card reveal">
          <div class="opportunity-copy">
            <div class="opportunity-status"><span class="pulsing-dot"></span> Available for Opportunities</div>
            <h2 id="opportunities-title">Internships, Freelance, Open Source</h2>
            <p>I am actively looking for teams and projects where I can contribute as a full stack developer building modern web applications.</p>
          </div>
          <div class="opportunity-actions">
            <a href="assets/Sandeep_Kumar_Resume.pdf" download="Sandeep_Kumar_Resume.pdf" class="btn-hero btn-primary-hero">View Resume</a>
            <a href="mailto:sandeeppal321ku@gmail.com?subject=Hiring%20Inquiry" class="btn-hero btn-outline-hero">Hire Me (Email)</a>
          </div>
        </div>
      </div>
    `;
    contactSection.parentElement.insertBefore(section, contactSection);
  }

  // ---------------------------------------------------------
  // Reveal animations
  // ---------------------------------------------------------
  function setupRevealObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('count-group-hero')) {
          animateCountGroup(entry.target);
          state.heroVisible = true;
        }
        if (entry.target.id === 'github-stats') {
          state.githubVisible = true;
          animateGithubStats();
        }
        if (entry.target.id === 'skills') {
          state.radarVisible = true;
          animateRadarChart();
        }
      });
    }, { threshold: 0.16 });

    $all('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));
    const heroStats = $('#hero-stats');
    if (heroStats) {
      heroStats.classList.add('count-group-hero');
      observer.observe(heroStats);
    }
    const githubStats = $('#github-stats');
    if (githubStats) observer.observe(githubStats);
    const skillsSection = $('#skills');
    if (skillsSection) observer.observe(skillsSection);
    const journey = $('#journey');
    if (journey) observer.observe(journey);
    const opportunities = $('#opportunities');
    if (opportunities) observer.observe(opportunities);
  }

  // ---------------------------------------------------------
  // Scroll progress + back to top
  // ---------------------------------------------------------
  function setupScrollProgress() {
    const bar = $('#scrollProgress span');
    if (!bar) return;
    const onScroll = debounceFrame(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = `${Math.max(0, Math.min(progress, 100))}%`;
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function setupBackToTop() {
    const button = $('#backToTop');
    if (!button) return;
    const onScroll = debounceFrame(() => {
      button.style.display = window.scrollY > 520 ? 'flex' : 'none';
    });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------------------------------------------------------
  // Active nav highlighting
  // ---------------------------------------------------------
  function setupActiveNav() {
    const navLinks = $all('.links a');
    const sections = $all('main section[id]');
    if (!navLinks.length || !sections.length) return;

    const map = new Map(navLinks.map((link) => [link.getAttribute('href'), link]));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach((link) => link.classList.remove('nav-active'));
        const active = map.get(id);
        if (active) active.classList.add('nav-active');
      });
    }, { threshold: 0.35 });

    sections.forEach((section) => observer.observe(section));
  }

  // ---------------------------------------------------------
  // Mobile menu
  // ---------------------------------------------------------
  function setupMobileMenu() {
    const hamburger = $('#hamburger');
    const mobileMenu = $('#mobileMenu');
    if (!hamburger || !mobileMenu) return;

    const closeMenu = () => {
      mobileMenu.style.display = 'none';
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburger.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
      mobileMenu.style.display = 'flex';
      mobileMenu.setAttribute('aria-hidden', 'false');
      hamburger.setAttribute('aria-expanded', 'true');
    };

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu();
      else openMenu();
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  // ---------------------------------------------------------
  // Custom cursor with a delayed trail
  // ---------------------------------------------------------
  function setupCursor() {
    const dot = $('#cursorDot');
    const trail = $('#cursorTrail');
    if (!dot || !trail || !state.cursorFine) {
      document.body.classList.add('cursor-hidden');
      return;
    }

    document.body.classList.remove('cursor-hidden');
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    const move = (event) => {
      x = event.clientX;
      y = event.clientY;
      if (!document.body.classList.contains('cursor-hidden')) {
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    const animate = () => {
      tx += (x - tx) * 0.16;
      ty += (y - ty) * 0.16;
      trail.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      requestAnimationFrame(animate);
    };

    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', () => document.body.classList.add('cursor-hidden'));
    document.addEventListener('pointerenter', () => document.body.classList.remove('cursor-hidden'));
    animate();
  }

  // ---------------------------------------------------------
  // Hero canvas background
  // ---------------------------------------------------------
  function setupHeroCanvas() {
    const canvas = $('#hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles = [];
    let width = 0;
    let height = 0;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = canvas.clientWidth || canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.clientHeight || canvas.parentElement.clientHeight || window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function makeParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        size: 1 + Math.random() * 1.5,
        alpha: 0.12 + Math.random() * 0.28
      };
    }

    function buildParticles() {
      particles.length = 0;
      const count = window.innerWidth < 768 ? 24 : 44;
      for (let i = 0; i < count; i += 1) particles.push(makeParticle());
    }

    function drawGrid() {
      ctx.clearRect(0, 0, width, height);
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(34, 211, 238, 0.12)');
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0.08)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw a faint circuit-like grid.
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    function tick() {
      drawGrid();
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${particle.alpha})`;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = index + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.12 * (1 - dist / 140)})`;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(tick);
    }

    resize();
    buildParticles();
    window.addEventListener('resize', () => {
      resize();
      buildParticles();
    });
    requestAnimationFrame(tick);
  }

  // ---------------------------------------------------------
  // Typewriter / terminal effects
  // ---------------------------------------------------------
  function setupTypewriters() {
    const roleText = $('#roleText');
    const terminalText = $('#terminalText');
    if (roleText) startTypewriter(roleText, TERMINAL_LINES, { typeSpeed: 74, deleteSpeed: 36, pause: 1200 });
    if (terminalText) startTerminalCycle(terminalText, TERMINAL_LINES);
  }

  function startTypewriter(element, phrases, options) {
    const typeSpeed = options.typeSpeed || 80;
    const deleteSpeed = options.deleteSpeed || 42;
    const pause = options.pause || 1100;
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const phrase = phrases[phraseIndex % phrases.length];
      if (!phrase) return;
      if (deleting) {
        charIndex -= 1;
        element.textContent = phrase.slice(0, Math.max(0, charIndex));
      } else {
        charIndex += 1;
        element.textContent = phrase.slice(0, charIndex);
      }

      let delay = deleting ? deleteSpeed : typeSpeed;
      if (!deleting && charIndex >= phrase.length) {
        deleting = true;
        delay = pause;
      } else if (deleting && charIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 220;
      }
      window.setTimeout(tick, delay);
    };

    tick();
  }

  function startTerminalCycle(element, phrases) {
    let index = 0;
    const cycle = () => {
      const phrase = phrases[index % phrases.length];
      element.textContent = phrase;
      index += 1;
      window.setTimeout(cycle, 2500);
    };
    cycle();
  }

  // ---------------------------------------------------------
  // Counters
  // ---------------------------------------------------------
  function setupCounters() {
    // Hero and GitHub counters are animated by the reveal observer once
    // their containing sections enter the viewport.
  }

  function animateCountGroup(container) {
    const scope = container && container.querySelectorAll ? container : document;
    $all('.count-up[data-count-target]', scope).forEach((el) => {
      if (el.dataset.countAnimated === 'true' && el.closest('#github-stats')) return;
      const target = Number(el.dataset.countTarget || '0');
      const suffix = el.dataset.countSuffix || '';
      animateCount(el, target, suffix);
    });
  }

  function animateCount(element, target, suffix) {
    if (!element) return;
    cancelAnimationFrame(element._countFrame);
    const start = performance.now();
    const duration = 1200 + Math.min(target * 18, 700);
    const from = Number(element.textContent.replace(/[^\d.-]/g, '')) || 0;

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(from + (target - from) * eased);
      element.textContent = `${value}${suffix}`;
      if (progress < 1) {
        element._countFrame = requestAnimationFrame(step);
      } else {
        element.textContent = `${target}${suffix}`;
        element.dataset.countAnimated = 'true';
      }
    };

    element._countFrame = requestAnimationFrame(step);
  }

  function animateGithubStats() {
    if (!state.profileStats) return;
    const { profile, commits } = state.profileStats;
    const mappings = [
      ['#githubReposCount', Number(profile.public_repos || 0)],
      ['#githubFollowersCount', Number(profile.followers || 0)],
      ['#githubGistsCount', Number(profile.public_gists || 0)],
      ['#githubCommitsCount', Number(commits || 0)]
    ];

    mappings.forEach(([selector, target]) => {
      const el = $(selector);
      if (!el) return;
      el.dataset.countTarget = String(target);
      animateCount(el, target, '');
    });
  }

  // ---------------------------------------------------------
  // Radar chart
  // ---------------------------------------------------------
  function setupRadarChart() {
    const svg = $('#skillsRadar');
    if (!svg) return;

    const labels = ['Frontend', 'Backend', 'Databases', 'Tools', 'Full Stack'];
    const values = [95, 88, 82, 80, 94];
    const cx = 260;
    const cy = 260;
    const radius = 170;

    const ringMarkup = [];
    for (let ring = 1; ring <= 5; ring += 1) {
      ringMarkup.push(`<polygon points="${buildPolygonPoints(labels.length, cx, cy, radius * (ring / 5))}" class="radar-ring"></polygon>`);
    }

    const axisMarkup = labels.map((label, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / labels.length;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      const textX = cx + Math.cos(angle) * (radius + 28);
      const textY = cy + Math.sin(angle) * (radius + 28);
      return `
        <line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" class="radar-axis"></line>
        <text x="${textX}" y="${textY}" class="radar-label" text-anchor="middle">${label}</text>
      `;
    }).join('');

    svg.innerHTML = `
      <defs>
        <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.34"></stop>
          <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.34"></stop>
        </linearGradient>
      </defs>
      <circle cx="${cx}" cy="${cy}" r="4" class="radar-center"></circle>
      ${ringMarkup.join('')}
      ${axisMarkup}
      <path id="radarArea" class="radar-area"></path>
      <path id="radarOutline" class="radar-outline"></path>
    `;

    state.radarValues = values;
    state.radarMeta = { cx, cy, radius, labels };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        state.radarVisible = true;
        animateRadarChart();
      });
    }, { threshold: 0.3 });

    observer.observe(svg);
  }

  function buildPolygonPoints(count, cx, cy, radius, values) {
    const points = [];
    for (let i = 0; i < count; i += 1) {
      const angle = -Math.PI / 2 + (Math.PI * 2 * i) / count;
      const value = values ? values[i] : 1;
      const x = cx + Math.cos(angle) * radius * value;
      const y = cy + Math.sin(angle) * radius * value;
      points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return points.join(' ');
  }

  function animateRadarChart() {
    if (!state.radarMeta) return;
    const area = $('#radarArea');
    const outline = $('#radarOutline');
    if (!area || !outline) return;

    const duration = state.reducedMotion ? 1 : 1200;
    const start = performance.now();
    const { cx, cy, radius, labels } = state.radarMeta;
    const values = state.radarValues || [];

    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const scaled = values.map((value) => value / 100 * eased);
      const points = buildPolygonPoints(labels.length, cx, cy, radius, scaled);
      area.setAttribute('d', `M ${points.split(' ').join(' L ')} Z`);
      outline.setAttribute('d', `M ${points.split(' ').join(' L ')} Z`);
      if (progress < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------
  // GitHub API data
  // ---------------------------------------------------------
  async function loadGithubData() {
    const profileUrl = `https://api.github.com/users/${GITHUB_USER}`;
    const commitsUrl = `https://api.github.com/search/commits?q=author:${GITHUB_USER}&per_page=1`;

    try {
      const [profileResponse, commitsResponse, repos] = await Promise.all([
        fetch(profileUrl, { headers: { Accept: 'application/vnd.github+json' } }),
        fetch(commitsUrl, { headers: { Accept: 'application/vnd.github.cloak-preview+json' } }),
        fetchFeaturedRepos()
      ]);

      if (!profileResponse.ok) {
        throw new Error('GitHub API returned a non-OK response');
      }

      const profile = await profileResponse.json();
      let commitsTotal = 0;
      if (commitsResponse.ok) {
        const commitsJson = await commitsResponse.json();
        commitsTotal = Number(commitsJson.total_count || 0);
      }

      state.profileStats = { profile, commits: commitsTotal };
      state.repos = repos
        .filter((repo) => repo && repo.description)
        .map((repo) => ({
          ...repo,
          homepage: repo.homepage || repo.liveUrl || '',
          liveUrl: repo.liveUrl || ''
        }));
      state.repoMap = new Map(state.repos.map((repo) => [repo.name, repo]));
      state.languageStats = buildLanguageStats(state.repos);

      renderGitHubStats(profile, commitsTotal, state.languageStats);
      renderProjects(state.repos.length ? state.repos : await loadLocalProjects());

      if (state.githubVisible) animateGithubStats();
      if (state.heroVisible) animateCountGroup($('#hero-stats'));
    } catch (error) {
      console.warn('GitHub data load failed, using local fallback where possible:', error);
      const localProjects = await loadLocalProjects();
      renderProjects(localProjects);
      state.profileStats = state.profileStats || {
        profile: { public_repos: localProjects.length, followers: 0, public_gists: 0 },
        commits: 0
      };
      renderGitHubStats(state.profileStats.profile, state.profileStats.commits, state.languageStats);
      if (state.heroVisible) animateCountGroup($('#hero-stats'));
    }
  }

  function renderGitHubStats(profile, commitsTotal, languageStats) {
    const languageGrid = $('#githubLanguageGrid');
    if (languageGrid && languageStats && languageStats.length) {
      const topLanguages = languageStats.slice(0, 4);
      const max = topLanguages.reduce((memo, item) => Math.max(memo, item.count), 1);
      languageGrid.innerHTML = topLanguages.map((item) => `
        <div class="lang-row">
          <div class="row"><span>${escapeHtml(item.language)}</span><span>${Math.round((item.count / max) * 100)}%</span></div>
          <div class="lang-bar">
            <div class="fill ${['js', 'py', 'html', 'c'][topLanguages.indexOf(item) % 4]}" style="width:${Math.round((item.count / max) * 100)}%"></div>
          </div>
        </div>
      `).join('');
    }

    const mappings = [
      ['#githubReposCount', Number(profile.public_repos || 0)],
      ['#githubFollowersCount', Number(profile.followers || 0)],
      ['#githubGistsCount', Number(profile.public_gists || 0)],
      ['#githubCommitsCount', Number(commitsTotal || 0)]
    ];
    mappings.forEach(([selector, target]) => {
      const el = $(selector);
      if (!el) return;
      el.dataset.countTarget = String(target);
      if (state.githubVisible) animateCount(el, target, '');
      else el.textContent = '0';
    });
  }

  function buildLanguageStats(repos) {
    const counts = new Map();
    repos.forEach((repo) => {
      const language = repo.language || 'Other';
      counts.set(language, (counts.get(language) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count);
  }

  async function fetchFeaturedRepos() {
    const repoRequests = FEATURED_PROJECTS.map(async (item) => {
      try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${encodeURIComponent(item.name)}`, {
          headers: { Accept: 'application/vnd.github+json' }
        });
        if (!response.ok) return null;
        const repo = await response.json();
        return {
          ...repo,
          liveUrl: repo.homepage || item.liveUrl || ''
        };
      } catch (error) {
        console.warn(`Failed to fetch repo ${item.name}`, error);
        return null;
      }
    });

    const results = await Promise.all(repoRequests);
    const byName = new Map(results.filter(Boolean).map((repo) => [repo.name, repo]));

    return FEATURED_PROJECTS.map((item) => {
      const repo = byName.get(item.name);
      if (!repo) return null;
      return {
        ...repo,
        liveUrl: repo.liveUrl || item.liveUrl || '',
        homepage: repo.homepage || item.liveUrl || ''
      };
    }).filter(Boolean);
  }

  async function loadLocalProjects() {
    try {
      const response = await fetch('projects.json');
      if (!response.ok) return [];
      const json = await response.json();
        return (json || []).map((item) => ({
        name: item.name,
        description: item.desc,
        html_url: item.url,
        homepage: item.homepage || '',
        language: item.language || 'Project',
        stargazers_count: item.stars || 1,
        forks_count: item.forks || 0,
        topics: item.topics || [],
        updated_at: item.updated_at || new Date().toISOString(),
        default_branch: 'main'
      }));
    } catch (error) {
      console.warn('Local project fallback failed', error);
      return [];
    }
  }

  // ---------------------------------------------------------
  // Project cards
  // ---------------------------------------------------------
  function setupProjectFilters() {
    const container = $('#projFilters');
    if (!container) return;
    container.addEventListener('click', (event) => {
      const button = event.target.closest('.filter-btn');
      if (!button) return;
      $all('.filter-btn', container).forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      state.projectFilter = button.dataset.filter || 'all';
      applyProjectFilter();
    });
  }

  function renderProjects(repos) {
    const grid = $('#projectsGrid');
    if (!grid) return;

    const projects = repos
      .filter((repo) => repo && repo.description);

    if (!projects.length && state.repos.length) {
      return;
    }

    grid.innerHTML = projects.length
      ? projects.map((repo, index) => buildProjectCard(repo, index)).join('')
      : '<div class="card" style="grid-column:1/-1">No starred repositories with descriptions were found.</div>';

    applyProjectFilter();
  }

  function buildProjectCard(repo, index) {
    const categories = inferProjectCategories(repo).join(' ');
    const topics = (repo.topics || []).slice(0, 4);
    const liveUrl = repo.liveUrl || repo.homepage ? safeUrl(repo.liveUrl || repo.homepage) : '';
    const sourceUrl = safeUrl(repo.html_url);
    const year = repo.updated_at ? new Date(repo.updated_at).getFullYear() : 'GitHub';

    return `
      <article class="project-card proj-card" tabindex="0" role="button" data-card-index="${index}" data-project-name="${escapeHtml(repo.name)}" data-project-url="${escapeHtml(sourceUrl)}" data-project-homepage="${escapeHtml(liveUrl)}" data-project-lang="${escapeHtml(repo.language || 'Project')}" data-project-stars="${Number(repo.stargazers_count || 0)}" data-project-forks="${Number(repo.forks_count || 0)}" data-project-topics="${escapeHtml(topics.join(','))}" data-project-description="${escapeHtml(repo.description || '')}" data-project-categories="${escapeHtml(categories)}" data-cat="${escapeHtml(categories)}">
        <div class="top-accent"></div>
        <div class="project-meta proj-meta">
          <span>${escapeHtml(repo.language || 'Repository')}</span>
          <span>${year}</span>
        </div>
        <h3 class="proj-title">${escapeHtml(repo.name)}</h3>
        <p class="proj-desc">${escapeHtml(repo.description || 'No description provided.')}</p>
        <div class="proj-tags">
          ${repo.language ? `<span class="proj-tag">${escapeHtml(repo.language)}</span>` : ''}
          ${topics.map((topic) => `<span class="proj-tag">${escapeHtml(topic)}</span>`).join('')}
        </div>
        <div class="project-stats">
          <span><i class="fa-solid fa-star"></i> ${formatRepoCount(repo.stargazers_count || 0)}</span>
          <span><i class="fa-solid fa-code-fork"></i> ${formatRepoCount(repo.forks_count || 0)}</span>
        </div>
        <div class="project-actions proj-links">
          <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Source</a>
          ${liveUrl ? `<a href="${liveUrl}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> View Live</a>` : ''}
        </div>
      </article>
    `;
  }

  function inferProjectCategories(repo) {
    const text = `${repo.name || ''} ${repo.description || ''} ${(repo.topics || []).join(' ')} ${repo.language || ''}`.toLowerCase();
    const categories = [];
    if (/(react|web|frontend|javascript|html|css|tailwind)/.test(text)) categories.push('web');
    if (/(iot|esp32|arduino|mqtt|sensor|hardware)/.test(text)) categories.push('iot');
    if (/(ai|ml|machine|tensorflow|opencv|python|emotion)/.test(text)) categories.push('ai');
    if (!categories.length) categories.push('web');
    return categories;
  }

  function applyProjectFilter() {
    const cards = $all('#projectsGrid .proj-card');
    const filter = state.projectFilter || 'all';
    cards.forEach((card) => {
      const cats = (card.dataset.projectCategories || card.dataset.cat || '').toLowerCase();
      const visible = filter === 'all' || cats.includes(filter);
      card.classList.toggle('hidden', !visible);
      card.style.display = visible ? 'block' : 'none';
    });
  }

  function bindStaticProjectFallbacks() {
    const grid = $('#projectsGrid');
    if (!grid) return;

    grid.addEventListener('click', (event) => {
      const card = event.target.closest('.proj-card');
      if (!card) return;
      if (event.target.closest('a')) return;
      const repo = readProjectFromCard(card);
      if (repo) openProjectModal(repo);
    });

    grid.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const card = event.target.closest('.proj-card');
      if (!card) return;
      event.preventDefault();
      const repo = readProjectFromCard(card);
      if (repo) openProjectModal(repo);
    });
  }

  function readProjectFromCard(card) {
    const name = card.dataset.projectName || $('.proj-title', card)?.textContent || 'Project';
    const description = card.dataset.projectDescription || $('.proj-desc', card)?.textContent || '';
    const url = card.dataset.projectUrl || $('a[href*="github.com"]', card)?.href || '#';
    const homepage = card.dataset.projectHomePage || card.dataset.projectHomepage || $('a[href]:not([href*="github.com"])', card)?.href || '';
    const stars = Number(card.dataset.projectStars || 0);
    const forks = Number(card.dataset.projectForks || 0);
    const language = card.dataset.projectLang || $('.proj-tag', card)?.textContent || 'Project';
    const topics = (card.dataset.projectTopics || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    return {
      name,
      description,
      html_url: url,
      homepage,
      language,
      stargazers_count: stars,
      forks_count: forks,
      topics,
      default_branch: 'main'
    };
  }

  // ---------------------------------------------------------
  // Project modal
  // ---------------------------------------------------------
  function setupProjectModal() {
    const modal = $('#projectModal');
    const content = $('#projectModalContent');
    if (!modal || !content) return;

    modal.addEventListener('click', (event) => {
      if (event.target.matches('[data-modal-close]')) closeProjectModal();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeProjectModal();
    });
  }

  async function openProjectModal(repo) {
    const modal = $('#projectModal');
    const content = $('#projectModalContent');
    if (!modal || !content) return;

    const token = ++state.modalToken;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    content.innerHTML = `
      <div class="project-modal-grid">
        <div class="project-modal-copy">
          <h3 id="projectModalTitle">${escapeHtml(repo.name)}</h3>
          <p>Loading project details and README screenshots...</p>
        </div>
      </div>
    `;

    const screenshots = await fetchReadmeImages(repo);
    const features = buildFeatureList(repo);
    if (token !== state.modalToken) return;

    content.innerHTML = `
      <div class="project-modal-grid">
        <div class="project-modal-media">
          ${screenshots.length
            ? screenshots.map((src) => `<img src="${escapeHtml(src)}" alt="${escapeHtml(repo.name)} screenshot" loading="lazy">`).join('')
            : '<div class="placeholder-shot">README screenshots unavailable</div>'}
        </div>
        <div class="project-modal-copy">
          <div class="project-meta proj-meta">
            <span>${escapeHtml(repo.language || 'Repository')}</span>
            <span><i class="fa-solid fa-star"></i> ${formatRepoCount(repo.stargazers_count || 0)}</span>
          </div>
          <h3 id="projectModalTitle">${escapeHtml(repo.name)}</h3>
          <p>${escapeHtml(repo.description || 'No description provided by the repository.')}</p>
          <div class="proj-tags">
            ${repo.language ? `<span class="proj-tag">${escapeHtml(repo.language)}</span>` : ''}
            ${(repo.topics || []).slice(0, 5).map((topic) => `<span class="proj-tag">${escapeHtml(topic)}</span>`).join('')}
          </div>
          <ul class="project-modal-list">
            ${features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}
          </ul>
          <div class="project-stats">
            <span><i class="fa-solid fa-star"></i> ${formatRepoCount(repo.stargazers_count || 0)} stars</span>
            <span><i class="fa-solid fa-code-fork"></i> ${formatRepoCount(repo.forks_count || 0)} forks</span>
          </div>
          <div class="project-modal-links">
            <a href="${safeUrl(repo.html_url)}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> GitHub</a>
            ${repo.homepage ? `<a href="${safeUrl(repo.homepage)}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  function closeProjectModal() {
    const modal = $('#projectModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function buildFeatureList(repo) {
    const features = [];
    if (repo.description) {
      repo.description
        .split(/[,.•;]| and /i)
        .map((item) => item.trim())
        .filter((item) => item.length > 10)
        .forEach((item) => features.push(item));
    }
    (repo.topics || []).slice(0, 3).forEach((topic) => features.push(`Topic: ${topic}`));
    if (repo.language) features.push(`Primary language: ${repo.language}`);
    features.push(`Stars: ${formatRepoCount(repo.stargazers_count || 0)}`);
    features.push(`Forks: ${formatRepoCount(repo.forks_count || 0)}`);
    return Array.from(new Set(features)).slice(0, 5);
  }

  async function fetchReadmeImages(repo) {
    const cacheKey = repo.full_name || repo.name;
    if (state.readmeCache.has(cacheKey)) return state.readmeCache.get(cacheKey);

    const readmeUrl = `https://api.github.com/repos/${GITHUB_USER}/${repo.name}/readme`;
    try {
      const response = await fetch(readmeUrl, { headers: { Accept: 'application/vnd.github+json' } });
      if (!response.ok) {
        state.readmeCache.set(cacheKey, []);
        return [];
      }
      const json = await response.json();
      const markdown = decodeBase64(json.content || '');
      const matches = Array.from(markdown.matchAll(/!\[[^\]]*]\((.*?)\)/g));
      const images = matches.map((match) => resolveReadmeImage(repo, match[1])).filter(Boolean);
      const unique = Array.from(new Set(images)).slice(0, 4);
      state.readmeCache.set(cacheKey, unique);
      return unique;
    } catch (error) {
      console.warn('README image fetch failed:', error);
      state.readmeCache.set(cacheKey, []);
      return [];
    }
  }

  function resolveReadmeImage(repo, imageUrl) {
    if (!imageUrl) return '';
    if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
    const clean = imageUrl.replace(/^\.\//, '').replace(/^\//, '');
    const branch = repo.default_branch || 'main';
    return `https://raw.githubusercontent.com/${GITHUB_USER}/${repo.name}/${branch}/${clean}`;
  }

  function decodeBase64(value) {
    try {
      return decodeURIComponent(escape(atob(value)));
    } catch (_) {
      try {
        return atob(value);
      } catch (error) {
        return '';
      }
    }
  }

  // ---------------------------------------------------------
  // Contact form with validation and EmailJS-ready structure
  // ---------------------------------------------------------
  function setupContactForm() {
    const form = $('#contactForm');
    if (!form) return;

    const successBox = $('#formSuccess');
    const nameField = $('#name');
    const emailField = $('#email');
    const messageField = $('#message');

    ensureErrorNode(nameField);
    ensureErrorNode(emailField);
    ensureErrorNode(messageField);

    [nameField, emailField, messageField].forEach((field) => {
      if (!field) return;
      field.addEventListener('input', () => clearError(field));
      field.addEventListener('blur', () => validateField(field));
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const valid = [nameField, emailField, messageField].every((field) => validateField(field));
      if (!valid) return;

      const payload = {
        from_name: nameField.value.trim(),
        reply_to: emailField.value.trim(),
        message: messageField.value.trim()
      };

      try {
        if (canUseEmailJs()) {
          if (window.emailjs && typeof window.emailjs.init === 'function') {
            window.emailjs.init(EMAILJS_PUBLIC_KEY);
          }
          await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload);
        } else {
          await sendViaFormspree(form);
        }

        showFormSuccess(successBox);
        form.reset();
        clearAllErrors(form);
      } catch (error) {
        console.warn('Contact form submit failed:', error);
        showInlineError(successBox, 'Unable to send right now. Please try again.');
      }
    });
  }

  function canUseEmailJs() {
    return Boolean(
      window.emailjs &&
      EMAILJS_PUBLIC_KEY &&
      EMAILJS_SERVICE_ID &&
      EMAILJS_TEMPLATE_ID &&
      !EMAILJS_PUBLIC_KEY.includes('YOUR_') &&
      !EMAILJS_SERVICE_ID.includes('YOUR_') &&
      !EMAILJS_TEMPLATE_ID.includes('YOUR_')
    );
  }

  async function sendViaFormspree(form) {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    });
    if (!response.ok) {
      throw new Error('Formspree submission failed');
    }
  }

  function ensureErrorNode(field) {
    if (!field) return;
    const wrapper = field.parentElement;
    if (!wrapper || wrapper.querySelector('[data-error-for]')) return;
    const error = document.createElement('div');
    error.className = 'field-error';
    error.dataset.errorFor = field.id;
    wrapper.appendChild(error);
  }

  function validateField(field) {
    if (!field) return true;
    let message = '';
    if (field.id === 'name' && field.value.trim().length < 2) message = 'Please enter your name.';
    if (field.id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) message = 'Please enter a valid email.';
    if (field.id === 'message' && field.value.trim().length < 10) message = 'Please write a message with at least 10 characters.';
    setFieldState(field, message);
    return !message;
  }

  function setFieldState(field, message) {
    if (!field) return;
    const error = document.querySelector(`[data-error-for="${field.id}"]`);
    field.classList.toggle('is-invalid', Boolean(message));
    if (error) error.textContent = message;
  }

  function clearError(field) {
    setFieldState(field, '');
  }

  function clearAllErrors(form) {
    $all('.form-input', form).forEach((field) => setFieldState(field, ''));
  }

  function showFormSuccess(successBox) {
    if (!successBox) return;
    successBox.innerHTML = '<i class="fa-solid fa-check"></i> Message sent successfully!';
    successBox.classList.add('show');
    createSuccessBurst(successBox);
    window.setTimeout(() => successBox.classList.remove('show'), 4200);
  }

  function showInlineError(successBox, message) {
    if (!successBox) return;
    successBox.innerHTML = escapeHtml(message);
    successBox.classList.add('show');
    window.setTimeout(() => successBox.classList.remove('show'), 4200);
  }

  function createSuccessBurst(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#22d3ee', '#34d399', '#f472b6', '#fb923c'];
    for (let i = 0; i < 14; i += 1) {
      const particle = document.createElement('span');
      particle.className = 'success-burst';
      particle.textContent = '•';
      particle.style.left = `${rect.left + rect.width / 2}px`;
      particle.style.top = `${rect.top + 10}px`;
      particle.style.color = colors[i % colors.length];
      particle.style.transform = `translate(${(Math.random() - 0.5) * 120}px, ${-Math.random() * 40}px)`;
      document.body.appendChild(particle);
      window.setTimeout(() => particle.remove(), 1250);
    }
  }
})();
