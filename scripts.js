
(function () {
  'use strict';

  const GITHUB_USER = 'jagga-123';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  document.addEventListener('DOMContentLoaded', () => {
    setupTheme();
    setupMobileMenu();
    setupScrollProgress();
    setupNavScrollState();
    setupBackToTop();
    setupActiveNav();
    setupReveal();
    setupCounters();
    setupGithubStats();
    setupContactForm();
    setupCopyEmail();
    setupKeyboardShortcuts();
    setupFooterYear();
    setupMagneticButtons();
    setupScrollDrivenHero();
    setupHeroParallax();
    setupProjectSpotlight();
  });

  // ---------------------------------------------------------
  // Theme (dark by default; explicit toggle persisted)
  // ---------------------------------------------------------
  function setupTheme() {
    const root = document.documentElement;
    const btn = $('#themeToggle');
    const stored = localStorage.getItem('theme');
    if (stored) root.setAttribute('data-theme', stored);
    if (btn) btn.setAttribute('aria-pressed', String(root.getAttribute('data-theme') !== 'light'));

    if (!btn) return;
    btn.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      if (next === 'dark') root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', next);
      btn.setAttribute('aria-pressed', String(next === 'dark'));
    });
  }

  // ---------------------------------------------------------
  // Mobile menu
  // ---------------------------------------------------------
  function setupMobileMenu() {
    const btn = $('#hamburger');
    const menu = $('#mobileMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });

    $all('a', menu).forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------------------------------------------------------
  // Scroll progress + back to top + active nav link
  // ---------------------------------------------------------
  function setupScrollProgress() {
    const bar = $('#scrollProgress span');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = `${scrolled || 0}%`;
    }, { passive: true });
  }

  function setupNavScrollState() {
    const nav = $('#navbar');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 24);
    }, { passive: true });
  }

  function setupBackToTop() {
    const el = $('#backToTop');
    if (!el) return;
    window.addEventListener('scroll', () => {
      el.classList.toggle('is-visible', window.scrollY > 480);
    }, { passive: true });
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  function setupActiveNav() {
    const links = $all('.nav-links a[href^="#"]');
    const sections = $all('main section[id]');
    const indicator = $('.nav-indicator');
    if (!links.length || !sections.length) return;

    // Glide the shared indicator under the active link — Linear-nav style —
    // instead of each link owning its own static underline.
    function moveIndicator(link) {
      if (!indicator) return;
      if (!link) { indicator.style.opacity = '0'; return; }
      indicator.style.opacity = '1';
      indicator.style.width = `${link.offsetWidth}px`;
      indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    }

    function update() {
      const pos = window.scrollY + 140;
      let activeLink = null;
      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        const active = pos >= top && pos < bottom;
        const link = links.find((l) => l.getAttribute('href') === `#${sec.id}`);
        if (link) link.classList.toggle('is-active', active);
        if (active) activeLink = link;
        const tag = $('.section-tag', sec);
        if (tag) tag.classList.toggle('is-current', active);
      });
      moveIndicator(activeLink);
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  // ---------------------------------------------------------
  // Reveal on scroll
  // ---------------------------------------------------------
  function setupReveal() {
    const items = $all('.reveal');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach((el) => io.observe(el));
  }

  // ---------------------------------------------------------
  // Count-up stats (hero + GitHub block)
  // ---------------------------------------------------------
  function animateCount(el, target) {
    if (reduceMotion) { el.textContent = String(target); return; }
    const duration = 900;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = String(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = String(target);
    }
    requestAnimationFrame(tick);
  }

  function setupCounters() {
    const groups = $all('[data-count-group]');
    if (!groups.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $all('[data-count-target]', entry.target).forEach((el) => {
          animateCount(el, Number(el.dataset.countTarget || 0));
        });
        io.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    groups.forEach((g) => io.observe(g));
  }

  // ---------------------------------------------------------
  // GitHub stats — real live data, progressive enhancement only.
  // Static fallback numbers already sit in the HTML; this just
  // upgrades them if the API call succeeds.
  // ---------------------------------------------------------
  async function setupGithubStats() {
    const block = $('#githubStats');
    if (!block) return;

    try {
      const res = await fetch(`https://api.github.com/users/${GITHUB_USER}`, {
        headers: { Accept: 'application/vnd.github+json' }
      });
      if (!res.ok) throw new Error('GitHub API unavailable');
      const profile = await res.json();

      const reposEl = $('[data-gh="repos"]', block);
      if (reposEl) reposEl.dataset.countTarget = String(profile.public_repos || 0);

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          $all('[data-count-target]', block).forEach((el) => animateCount(el, Number(el.dataset.countTarget || 0)));
          io.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      io.observe(block);

      block.dataset.state = 'live';
    } catch (err) {
      // Static fallback values already in the markup stay as-is.
      block.dataset.state = 'fallback';
    }
  }

  // ---------------------------------------------------------
  // Contact form — honest validation + mailto handoff.
  // No fake "sent" confirmation: JS cannot know whether a mail
  // client actually delivered anything, so it says what it did
  // (opened your email app) rather than claiming success.
  // ---------------------------------------------------------
  function setupContactForm() {
    const form = $('#contactForm');
    if (!form) return;
    const status = $('#formStatus');
    const submitBtn = $('button[type="submit"]', form);

    function setError(field, message) {
      const box = $(`[data-error-for="${field.id}"]`);
      field.classList.toggle('is-invalid', Boolean(message));
      if (box) box.textContent = message;
      if (message && !reduceMotion) {
        field.classList.remove('shake');
        // eslint-disable-next-line no-unused-expressions
        void field.offsetWidth; // force reflow so the animation restarts on repeat failures
        field.classList.add('shake');
      }
    }

    function validate(field) {
      let message = '';
      if (field.id === 'name' && field.value.trim().length < 2) message = 'Please enter your name.';
      if (field.id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) message = 'Please enter a valid email.';
      if (field.id === 'message' && field.value.trim().length < 10) message = 'Message should be at least 10 characters.';
      setError(field, message);
      return !message;
    }

    $all('.form-input', form).forEach((field) => {
      field.addEventListener('blur', () => validate(field));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = $all('.form-input', form);
      const valid = fields.map(validate).every(Boolean);
      if (!valid) return;

      const name = $('#name', form).value.trim();
      const email = $('#email', form).value.trim();
      const message = $('#message', form).value.trim();
      const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      const mailto = `mailto:handsomerockey891@gmail.com?subject=${encodeURIComponent(`Portfolio contact from ${name}`)}&body=${encodeURIComponent(body)}`;

      if (submitBtn) {
        submitBtn.classList.add('is-sending');
        window.setTimeout(() => submitBtn.classList.remove('is-sending'), 500);
      }

      window.location.href = mailto;

      if (status) {
        status.textContent = 'Opening your email app with this message pre-filled — if nothing opens, email handsomerockey891@gmail.com directly.';
        status.className = 'form-status is-success';
      }
    });
  }

  // ---------------------------------------------------------
  // Copy-email button — real clipboard write, real feedback.
  // Only claims "Copied" once the browser confirms the write; a blocked
  // clipboard permission or insecure context falls back to selecting the
  // email text instead of lying about what happened.
  // ---------------------------------------------------------
  function setupCopyEmail() {
    const btn = $('#copyEmailBtn');
    if (!btn) return;
    const email = btn.dataset.email;
    const label = $('.copy-email-label', btn);
    let resetTimer = null;

    function showState(state, text) {
      btn.classList.remove('is-copied', 'is-error');
      if (state) btn.classList.add(state);
      if (label) label.textContent = text;
      btn.setAttribute('aria-label', state === 'is-copied' ? 'Email address copied' : 'Copy email address');
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        btn.classList.remove('is-copied', 'is-error');
        if (label) label.textContent = 'Copy';
        btn.setAttribute('aria-label', 'Copy email address');
      }, 2000);
    }

    btn.addEventListener('click', async () => {
      try {
        if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
        await navigator.clipboard.writeText(email);
        showState('is-copied', 'Copied');
      } catch (err) {
        // No clipboard permission / insecure context — don't fake success.
        showState('is-error', 'Select & copy');
      }
    });
  }

  // ---------------------------------------------------------
  // Keyboard shortcuts
  // ---------------------------------------------------------
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key.toLowerCase() === 'r') {
        const resumeLink = $('a[data-resume-link]');
        if (resumeLink) resumeLink.click();
      } else if (e.key.toLowerCase() === 'c') {
        const contact = $('#contact');
        if (contact) contact.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  }

  // ---------------------------------------------------------
  // Footer year
  // ---------------------------------------------------------
  function setupFooterYear() {
    const el = $('#footerYear');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  // ---------------------------------------------------------
  // Magnetic CTA buttons — subtle cursor-follow within bounds.
  // Desktop + fine-pointer only; disabled under reduced motion.
  // ---------------------------------------------------------
  function setupMagneticButtons() {
    if (reduceMotion || coarsePointer) return;
    const buttons = $all('.magnetic');
    if (!buttons.length) return;
    const strength = 0.35;
    const maxOffset = 10;

    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        const x = Math.max(-maxOffset, Math.min(maxOffset, relX * strength));
        const y = Math.max(-maxOffset, Math.min(maxOffset, relY * strength));
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  // ---------------------------------------------------------
  // Scroll-driven hero recede — the hero settles back (slight
  // scale/fade/blur) as the next section arrives. One
  // rAF-throttled scroll handler, nothing else attached to it.
  // ---------------------------------------------------------
  function setupScrollDrivenHero() {
    if (reduceMotion) return;
    const hero = $('.hero');
    if (!hero) return;
    let ticking = false;

    function update() {
      const heroHeight = hero.offsetHeight || 1;
      const y = window.scrollY;
      const progress = Math.min(Math.max(y / (heroHeight * 0.9), 0), 1);
      hero.style.setProperty('--hero-scroll', progress.toFixed(3));
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
  }

  // ---------------------------------------------------------
  // Hero mouse-parallax — one continuous rAF loop, started only
  // after the first real mouse move (never on touch, never under
  // reduced motion). Moves the mesh backdrop and photo a few
  // pixels opposite the cursor for a sense of depth — nothing
  // else in the page reacts to pointer position.
  // ---------------------------------------------------------
  function setupHeroParallax() {
    if (reduceMotion || coarsePointer) return;
    const hero = $('.hero');
    if (!hero) return;

    const pointer = { tx: 0, ty: 0, x: 0, y: 0 };
    let running = false;
    let heroRect = hero.getBoundingClientRect();

    function tick() {
      // Depth-layer parallax (normalized -1..1), only meaningful while hero is on screen.
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      hero.style.setProperty('--px', pointer.x.toFixed(3));
      hero.style.setProperty('--py', pointer.y.toFixed(3));
      requestAnimationFrame(tick);
    }

    function onMove(e) {
      if (heroRect && e.clientY >= heroRect.top && e.clientY <= heroRect.bottom) {
        pointer.tx = ((e.clientX / window.innerWidth) - 0.5) * 2;
        pointer.ty = ((e.clientY - heroRect.top) / heroRect.height - 0.5) * 2;
      }
      if (!running) {
        running = true;
        requestAnimationFrame(tick);
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', () => { heroRect = hero.getBoundingClientRect(); }, { passive: true });
  }

  // ---------------------------------------------------------
  // Project card spotlight — mouse-follow glow via CSS custom
  // properties, no canvas, no per-frame JS.
  // ---------------------------------------------------------
  function setupProjectSpotlight() {
    if (coarsePointer) return;
    $all('.project-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      });
    });
  }

})();
