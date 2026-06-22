/* ===========================================================
   EDITKARO.IN — MAIN SCRIPT
   =========================================================== */

/* ---------------------------------------------------------
   CONFIG
   Paste your Google Apps Script Web App URL below once you've
   deployed apps-script/Code.gs (see README.md, section 4).
   The SAME url is used for both forms — Code.gs tells the two
   submissions apart using the `formType` field.
   --------------------------------------------------------- */
const CONFIG = {
  SHEETS_ENDPOINT: "https://script.google.com/macros/s/AKfycbxNe0mIo3gVpXM8vSNk9HaarfIWFVRUiOU6g7a_wju_l4CPoWeGAxQx59ZZDSsWALC9/exec",
};

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initTimecode();
  initReveal();
  initNewsletterForm();
  initContactForm();
  initModalShell();
  initFootnoteButtons();

  if (document.getElementById('scrubberTrack')) initScrubber();
  if (document.getElementById('teaserGrid')) initTeaser();
  if (document.getElementById('portfolioGrid')) initPortfolioPage();
});

/* ---------------- Nav ---------------- */
function initNav(){
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links){
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  // highlight active page
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('is-active');
  });
}

/* ---------------- Live running timecode (ambient signature element) ---------------- */
function initTimecode(){
  const el = document.getElementById('navTimecode');
  if (!el) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion){ el.textContent = 'EDITKARO TIMELINE — 00:00:00:00'; return; }

  let frame = 0, sec = 0, min = 0, hr = 0;
  setInterval(() => {
    frame += 6;
    if (frame >= 24){ frame = 0; sec++; }
    if (sec >= 60){ sec = 0; min++; }
    if (min >= 60){ min = 0; hr++; }
    const pad = n => String(n).padStart(2,'0');
    el.textContent = `EDITKARO TIMELINE — ${pad(hr)}:${pad(min)}:${pad(sec)}:${pad(frame)}`;
  }, 250);
}

/* ---------------- Scroll reveal ---------------- */
function initReveal(){
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('is-visible'); obs.unobserve(e.target); } });
  }, { threshold: .15 });
  items.forEach(i => obs.observe(i));
}

/* ---------------- Hero scrubber (one representative clip per category) ---------------- */
function initScrubber(){
  const track = document.getElementById('scrubberTrack');
  const onePerCategory = PORTFOLIO_CATEGORIES.map(cat =>
    PORTFOLIO_ITEMS.find(item => item.category === cat.id)
  ).filter(Boolean);

  track.innerHTML = onePerCategory.map(item => `
    <a class="clip" href="portfolio.html#${item.category}" data-reveal>
      <img src="${thumbUrl(item.seed, 240, 160)}" alt="${item.title} thumbnail" loading="lazy">
      <span class="clip__dur mono">${item.duration}</span>
      <span class="clip__label mono">${categoryLabel(item.category)}</span>
    </a>
  `).join('');
}

function categoryLabel(id){
  const c = PORTFOLIO_CATEGORIES.find(c => c.id === id);
  return c ? c.label : id;
}

/* ---------------- Home page portfolio teaser (subset grid) ---------------- */
function initTeaser(){
  const grid = document.getElementById('teaserGrid');
  const picks = ['fb1','gm1','ec1','an1','doc1','sf1'];
  const items = picks.map(id => PORTFOLIO_ITEMS.find(i => i.id === id)).filter(Boolean);
  grid.innerHTML = items.map(reelCardHTML).join('');
  attachReelClicks(grid);
}

/* ---------------- Full portfolio page ---------------- */
let activeFilter = 'all';

function initPortfolioPage(){
  const filterBar = document.getElementById('filterBar');
  const grid = document.getElementById('portfolioGrid');
  const count = document.getElementById('resultCount');

  const allBtn = makeFilterBtn('all', 'All Work');
  filterBar.appendChild(allBtn);
  PORTFOLIO_CATEGORIES.forEach(cat => filterBar.appendChild(makeFilterBtn(cat.id, cat.label)));

  filterBar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('is-active', b === btn));
    renderPortfolioGrid();
    history.replaceState(null, '', activeFilter === 'all' ? 'portfolio.html' : `portfolio.html#${activeFilter}`);
  });

  // deep-link from hero clips (#category)
  const hash = location.hash.replace('#','');
  if (hash && PORTFOLIO_CATEGORIES.some(c => c.id === hash)) activeFilter = hash;

  renderPortfolioGrid();
  filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('is-active', b.dataset.filter === activeFilter));

  function renderPortfolioGrid(){
    const items = activeFilter === 'all' ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter(i => i.category === activeFilter);
    grid.innerHTML = items.map(reelCardHTML).join('');
    count.textContent = `${items.length} CLIP${items.length === 1 ? '' : 'S'}`;
    attachReelClicks(grid);
  }
}

function makeFilterBtn(id, label){
  const b = document.createElement('button');
  b.className = 'filter-btn';
  b.dataset.filter = id;
  b.textContent = label;
  return b;
}

function reelCardHTML(item){
  return `
    <article class="reel" data-id="${item.id}" data-reveal>
      <div class="reel__thumb-wrap">
        <img src="${thumbUrl(item.seed, 480, 360)}" alt="${item.title} placeholder thumbnail" loading="lazy">
        <div class="reel__play" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="11" fill="rgba(14,13,18,.55)" stroke="white" stroke-width="1"/><path d="M10 8l6 4-6 4V8z" fill="white"/></svg>
        </div>
        <span class="reel__cat">${categoryLabel(item.category)}</span>
        <span class="reel__dur mono">${item.duration}</span>
      </div>
      <div class="reel__body">
        <h4 class="reel__title">${item.title}</h4>
        <span class="reel__client">Client: ${item.client}</span>
      </div>
    </article>
  `;
}

function attachReelClicks(scope){
  scope.querySelectorAll('.reel').forEach(card => {
    card.addEventListener('click', () => openClipModal(card.dataset.id));
  });
}

/* ---------------- Lightbox modal ---------------- */
function initModalShell(){
  if (document.getElementById('clipModal')) return;
  const modal = document.createElement('div');
  modal.id = 'clipModal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal__panel" role="dialog" aria-modal="true">
      <button class="modal__close" aria-label="Close">&times;</button>
      <div class="modal__thumb">
        <img id="modalImg" src="" alt="">
        <div class="note">PLACEHOLDER PREVIEW — swap this thumbnail and add a videoUrl in js/portfolio-data.js to embed the real client edit.</div>
      </div>
      <div class="modal__body">
        <span class="eyebrow" id="modalCat"></span>
        <h3 class="h3 mt-xl" id="modalTitle" style="margin-top:14px;"></h3>
        <p class="text-dim mono" id="modalClient" style="margin-top:8px; font-size:12.5px;"></p>
        <p class="text-dim" id="modalBlurb" style="margin-top:14px;"></p>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('.modal__close').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openClipModal(id){
  const item = PORTFOLIO_ITEMS.find(i => i.id === id);
  if (!item) return;
  document.getElementById('modalImg').src = thumbUrl(item.seed, 800, 450);
  document.getElementById('modalImg').alt = item.title;
  document.getElementById('modalCat').textContent = categoryLabel(item.category);
  document.getElementById('modalTitle').textContent = item.title;
  document.getElementById('modalClient').textContent = `Client: ${item.client}  ·  Duration: ${item.duration}`;
  document.getElementById('modalBlurb').textContent = item.blurb;
  document.getElementById('clipModal').classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
function closeModal(){
  const m = document.getElementById('clipModal');
  if (m) m.classList.remove('is-open');
  document.body.style.overflow = '';
}

/* ---------------- Toast (for placeholder footer / social buttons) ---------------- */
function showToast(msg){
  let toast = document.getElementById('toast');
  if (!toast){
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast mono';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function initFootnoteButtons(){
  document.querySelectorAll('[data-toast]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      showToast(el.dataset.toast);
    });
  });
}

/* ---------------- Shared: post a payload to the Apps Script sheet endpoint ---------------- */
function postToSheet(payload){
  if (!CONFIG.SHEETS_ENDPOINT || CONFIG.SHEETS_ENDPOINT.startsWith('PASTE_')){
    return Promise.reject(new Error('not-configured'));
  }
  // mode: 'no-cors' avoids the CORS preflight that Apps Script web apps
  // don't handle by default. Trade-off: we can't read the response body,
  // so success is optimistic. See README.md section 4 for details.
  return fetch(CONFIG.SHEETS_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
}

/* ---------------- Home page: email collector ---------------- */
function initNewsletterForm(){
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  const msg = document.getElementById('newsletterMsg');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('input[name="email"]').value.trim();
    if (!isValidEmail(email)){
      msg.textContent = 'Enter a valid email address.';
      msg.className = 'form-msg error';
      return;
    }
    msg.textContent = 'Sending…';
    msg.className = 'form-msg';

    postToSheet({ formType: 'subscriber', email, source: 'home-newsletter' })
      .then(() => {
        msg.textContent = 'Subscribed. Welcome to the cutting room.';
        msg.className = 'form-msg success';
        form.reset();
      })
      .catch(err => {
        if (err.message === 'not-configured'){
          msg.textContent = 'Form is ready — connect a Google Sheet endpoint in js/main.js (CONFIG.SHEETS_ENDPOINT) to start collecting emails.';
        } else {
          msg.textContent = 'Something went wrong. Try again in a moment.';
        }
        msg.className = 'form-msg error';
      });
  });
}

/* ---------------- Contact page: full contact form ---------------- */
function initContactForm(){
  const form = document.getElementById('contactForm');
  if (!form) return;
  const msg = document.getElementById('contactMsg');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      name: form.querySelector('[name="name"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim(),
      phone: form.querySelector('[name="phone"]').value.trim(),
      message: form.querySelector('[name="message"]').value.trim(),
    };

    let valid = true;
    valid = validateField(form, 'name', data.name.length > 1) && valid;
    valid = validateField(form, 'email', isValidEmail(data.email)) && valid;
    valid = validateField(form, 'phone', data.phone.length >= 7) && valid;
    valid = validateField(form, 'message', data.message.length > 5) && valid;
    if (!valid) return;

    msg.textContent = 'Sending…';
    msg.className = 'form-msg';

    postToSheet({ formType: 'contact', ...data })
      .then(() => {
        msg.textContent = 'Message sent. We usually reply within one business day.';
        msg.className = 'form-msg success';
        form.reset();
      })
      .catch(err => {
        if (err.message === 'not-configured'){
          msg.textContent = 'Form is ready — connect a Google Sheet endpoint in js/main.js (CONFIG.SHEETS_ENDPOINT) to start receiving messages.';
        } else {
          msg.textContent = 'Something went wrong. Try again in a moment.';
        }
        msg.className = 'form-msg error';
      });
  });
}

function validateField(form, name, isValid){
  const field = form.querySelector(`[name="${name}"]`).closest('.field');
  field.classList.toggle('has-error', !isValid);
  return isValid;
}

function isValidEmail(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
