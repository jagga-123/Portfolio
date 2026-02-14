// Theme toggle
(function(){
  const body = document.body;
  const btn = document.getElementById('theme-toggle') || document.getElementById('themeToggle');
  const icon = document.getElementById('theme-icon');
  if (!btn) return; // nothing to do if no theme button
  const stored = localStorage.getItem('theme');
  const prefers = window.matchMedia('(prefers-color-scheme:dark)').matches;
  const apply = (t) => { body.setAttribute('data-theme', t); if (icon) icon.textContent = (t === 'dark') ? '☀️' : '🌙'; }
  apply(stored || (prefers ? 'dark' : 'light'));
  btn.addEventListener('click', () => { const cur = body.getAttribute('data-theme') || 'light'; const next = cur === 'dark' ? 'light' : 'dark'; apply(next); localStorage.setItem('theme', next); });
})();

// tsParticles background
window.addEventListener('load', () => {
  if (window.tsParticles) {
    try { tsParticles.load('tsparticles', { particles: { number: { value: 60, density: { enable: true, value_area: 800 } }, color: { value: ['#3B82F6', '#60A5FA', '#06B6D4'] }, shape: { type: 'circle' }, opacity: { value: .7 }, size: { value: 3 }, move: { enable: true, speed: 1 } } }); } catch (e) { console.warn('tsParticles failed', e); }
  }
});

// Typing and roles rotation
(function(){
  const nameEl = document.getElementById('typed-name');
  const rolesEl = document.getElementById('role-rotator');
  const roles = ['IoT Developer','Full-Stack Developer','AI/ML Enthusiast'];
  // Simple typewriter for name (one-time)
  if (nameEl) {
    const nameText = 'Sandeep Kumar'; let i = 0; nameEl.textContent = '';
    function typeName(){ if (i < nameText.length) { nameEl.textContent += nameText[i++]; setTimeout(typeName, 70); } }
    typeName();
  }
  // rotate roles
  if (rolesEl) { let r = 0; setInterval(()=>{ rolesEl.style.opacity = 0; setTimeout(()=>{ rolesEl.textContent = roles[r % roles.length]; rolesEl.style.opacity = 1; r++; }, 300); }, 3000); }
})();

// Counters animation
(function(){
  const els = document.querySelectorAll('[data-target]');
  if (!els || els.length === 0) return;
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target; const target = parseInt(el.getAttribute('data-target'), 10) || 0; let cur = 0; const step = Math.max(1, Math.ceil(target / 60)); const t = setInterval(()=>{ cur += step; el.textContent = cur > target ? target : cur; if (cur >= target) { clearInterval(t); } }, 25); obs.unobserve(el);
      }
    });
  });
  els.forEach(el => io.observe(el));
})();

// Projects fetch & render
const PROJECTS_PER_PAGE=6;
let allProjects=[];let shown=0;
async function fetchGitHubProjects(){
  const user='jagga-123';
  try{
    const res=await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`);
    if(!res.ok) throw new Error('rate');
    const repos=await res.json();
    allProjects=repos.map(r=>({name:r.name,desc:r.description||'',url:r.html_url,topics:r.topics||[],lang:r.language||'',updated:r.updated_at}));
  }catch(e){
    // fallback to local projects list
    try{const f=await fetch('projects.json');allProjects=await f.json()}catch(e){allProjects=[]}
  }
  renderProjects();document.getElementById('gh-repo-count').textContent=allProjects.length||'—';
}

function renderProjects(filter='all'){
  const grid=document.getElementById('projects-grid');grid.innerHTML='';
  const list=(filter==='all')?allProjects:allProjects.filter(p=>{const f=filter.toLowerCase();return (p.topics||[]).some(t=>t.toLowerCase().includes(f))|| (p.desc||'').toLowerCase().includes(f)|| (p.name||'').toLowerCase().includes(f)});
  const slice=list.slice(0,shown||PROJECTS_PER_PAGE);
  slice.forEach(p=>{const el=document.createElement('div');el.className='project-card';el.innerHTML=`<h4 class="font-semibold">${p.name}</h4><p class="text-sm text-slate-600 mt-2">${p.desc||''}</p><div class="mt-3"><a href="${p.url||'#'}" target="_blank" class="text-blue-600 underline">View on GitHub</a></div>`;grid.appendChild(el)});
}

const loadMoreBtn = document.getElementById('load-more');
if (loadMoreBtn) loadMoreBtn.addEventListener('click', ()=>{ shown += PROJECTS_PER_PAGE; const pf = document.getElementById('project-filter'); renderProjects(pf ? pf.value : 'all'); });
const projectFilter = document.getElementById('project-filter');
if (projectFilter) projectFilter.addEventListener('change', (e)=>{ shown = PROJECTS_PER_PAGE; renderProjects(e.target.value); });

// init
shown = PROJECTS_PER_PAGE; try { fetchGitHubProjects(); } catch(e) { console.warn('fetchGitHubProjects failed', e); }

// certifications
async function loadCerts(){try{const r=await fetch('certifications.json');const j=await r.json();const el=document.getElementById('cert-list');j.certifications.forEach(c=>{const d=document.createElement('div');d.className='card';d.innerHTML=`<div class="flex items-center justify-between"><div><div class="font-semibold">${c.title}</div><div class="text-sm text-slate-500">${c.issuer} • ${c.date} • ${c.score||''}</div></div><div><a href="${c.link||'#'}" target="_blank" class="text-blue-600 underline">Certificate</a></div></div>`;el.appendChild(d)});}catch(e){console.warn('certs load failed',e)} }
try { loadCerts(); } catch(e) { console.warn('loadCerts failed', e); }

// copy email (if element exists)
const copyEmailBtn = document.getElementById('copy-email');
if (copyEmailBtn) copyEmailBtn.addEventListener('click', ()=>{ if (navigator.clipboard) navigator.clipboard.writeText('sandeeppal321ku@gmail.com').catch(()=>{}); else alert('Copied'); });

// contact form basic handler (EmailJS optional)
const contactFormEl = document.getElementById('contact-form');
if (contactFormEl) contactFormEl.addEventListener('submit', async (ev) => { ev.preventDefault(); const f = new FormData(ev.target); const data = Object.fromEntries(f); const mailto = `mailto:sandeeppal321ku@gmail.com?subject=${encodeURIComponent(data.subject||'Contact from portfolio')}&body=${encodeURIComponent(`Name: ${data.name}\n\n${data.message}`)}`; window.location = mailto; });

// mobile menu toggle
(function(){ const btn = document.getElementById('mobile-menu-btn'); if (!btn) return; btn.addEventListener('click', ()=>{ const nav = document.querySelector('nav'); if (!nav) return; if (nav.style.display === 'flex') { nav.style.display = 'none' } else { nav.style.display = 'flex' } }); })();
