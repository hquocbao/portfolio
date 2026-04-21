/* ═══════════════════════════════════════════════════════════════
   ALIEN PORTFOLIO — app.js
   Modules: Data · Grid · Modal · Cursor · 3D BG
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   1. DATA MODULE
───────────────────────────────────────── */
const Data = (() => {
  let _cache = null;

  async function fetchAll() {
    if (_cache) return _cache;
    const res = await fetch('/projects.json');
    if (!res.ok) throw new Error('Failed to load projects.json');
    _cache = await res.json();
    return _cache;
  }

  async function getById(id) {
    const all = await fetchAll();
    return all.find(p => p.id === Number(id)) || null;
  }

  async function getBySlug(slug) {
    const all = await fetchAll();
    return all.find(p => p.slug === slug) || null;
  }

  return { fetchAll, getById, getBySlug };
})();


/* ─────────────────────────────────────────
   2. ICONS
───────────────────────────────────────── */
const Icons = {
  play:     `<svg width="11" height="11" viewBox="0 0 11 11"><polygon points="2.5,1.5 9.5,5.5 2.5,9.5" fill="currentColor"/></svg>`,
  photo:    `<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><rect x="1" y="2" width="9" height="7" rx="1" stroke="currentColor" stroke-width=".9"/><circle cx="5.5" cy="5.5" r="1.8" stroke="currentColor" stroke-width=".8"/></svg>`,
  article:  `<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><rect x="1" y="1" width="9" height="9" rx="1" stroke="currentColor" stroke-width=".9"/><path d="M3 4h5M3 6h5M3 8h3" stroke="currentColor" stroke-width=".8" stroke-linecap="round"/></svg>`,
  news:     `<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><rect x="1" y="2" width="9" height="7" rx="1" stroke="currentColor" stroke-width=".9"/><path d="M3 5h5M3 7h3" stroke="currentColor" stroke-width=".8" stroke-linecap="round"/></svg>`,
  trophy:   `<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 7.5V9M3.5 9.5h4" stroke="currentColor" stroke-width=".9" stroke-linecap="round"/><path d="M2 2.5h1.5v2.5a2 2 0 0 0 4 0V2.5H9" stroke="currentColor" stroke-width=".9"/></svg>`,
  youtube:  `<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><rect x="1" y="2.5" width="9" height="6" rx="1.5" stroke="currentColor" stroke-width=".9"/><polygon points="4.5,4 7.5,5.5 4.5,7" fill="currentColor"/></svg>`,
  facebook: `<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><rect x="1" y="1" width="9" height="9" rx="2" stroke="currentColor" stroke-width=".9"/><path d="M6 4H5a.9.9 0 0 0-.9.9v.9H3.5V7H4.1V10h1.4V7H6.8L7 5.8H5.5V5a.5.5 0 0 1 .5-.5H7V4H6z" fill="currentColor"/></svg>`,
  vtv:      `<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><rect x="1" y="2" width="9" height="7" rx="1" stroke="currentColor" stroke-width=".9"/><path d="M3 4.5l1.8 2.5 1.7-2.5M8 4.5v2.5" stroke="currentColor" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  link:     `<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M4.5 5.5a2 2 0 0 0 3 .3l1.2-1.2a2 2 0 0 0-2.8-2.8L5 2.7" stroke="currentColor" stroke-width=".9" stroke-linecap="round"/><path d="M6.5 5.5a2 2 0 0 0-3-.3L2.3 6.4a2 2 0 0 0 2.8 2.8l.9-.9" stroke="currentColor" stroke-width=".9" stroke-linecap="round"/></svg>`,
};

function icon(name) {
  return Icons[name] || Icons.link;
}


/* ─────────────────────────────────────────
   3. GRID RENDERER
───────────────────────────────────────── */
const Grid = (() => {

  function spanClass(n) {
    const map = { 4:'s4', 5:'s5', 6:'s6', 7:'s7', 8:'s8' };
    return map[n] || 's6';
  }

  function renderCard(p) {
    const hasVideo = p.video && p.video.id;
    const ytId     = hasVideo && p.video.type === 'youtube' ? p.video.id : null;

    const ytPreview = ytId
      ? `<div class="yt-preview">
           <iframe src="" data-src="https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&rel=0" allow="autoplay" loading="lazy"></iframe>
         </div>`
      : '';

    const playBadge = hasVideo
      ? `<div class="badge-play"><svg width="9" height="9" viewBox="0 0 9 9"><polygon points="2,1 8,4.5 2,8" fill="rgba(240,237,232,0.75)"/></svg></div>`
      : '';

    const typeBadge = p.category === 'Photo'
      ? `<span class="badge-type">Photo</span>`
      : '';

    /* Primary action for card click */
    const primaryBtn = p.buttons && p.buttons[0];
    const clickAttr  = primaryBtn ? buildClickAttr(primaryBtn, p) : '';

    return `
      <div class="card ${spanClass(p.span)}" data-cat="${p.category}" data-id="${p.id}" ${clickAttr}>
        <div class="card-media">
          <img class="thumb" src="${p.thumbnail}" alt="${p.title}" loading="lazy" onerror="this.style.display='none'">
          ${ytPreview}
          ${playBadge}
          ${typeBadge}
          <div class="card-overlay">
            <div>
              <div class="overlay-tag">${p.tag}</div>
              <div class="overlay-name">${p.title}</div>
              <div class="overlay-cta">Xem chi tiết →</div>
            </div>
          </div>
        </div>
        <div class="card-info">
          <div class="card-tag">${p.tag}</div>
          <div class="card-name">${p.title}</div>
        </div>
      </div>`;
  }

  function buildClickAttr(btn, p) {
    switch (btn.type) {
      case 'video':
        return `onclick="Modal.openVideo(${p.id})"`;
      case 'gallery':
        return `onclick="Modal.openGallery(${p.id})"`;
      case 'page':
        return `onclick="window.location='/project.html?id=${p.id}'"`;
      case 'link':
        return btn.url ? `onclick="window.open('${btn.url}','_blank')"` : '';
      default:
        return `onclick="Modal.openVideo(${p.id})"`;
    }
  }

  async function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      const projects = await Data.fetchAll();
      container.innerHTML = projects.map(renderCard).join('');
      initHoverPreviews();
      initReveal();
    } catch (err) {
      container.innerHTML = `<p style="color:rgba(240,237,232,.3);padding:2rem;font-size:.8rem;">Failed to load projects.</p>`;
      console.error(err);
    }
  }

  function initHoverPreviews() {
    document.querySelectorAll('.card').forEach(card => {
      const ytDiv  = card.querySelector('.yt-preview');
      if (!ytDiv) return;
      const iframe = ytDiv.querySelector('iframe');
      let loaded   = false;
      card.addEventListener('mouseenter', () => {
        if (!loaded && iframe) { iframe.src = iframe.dataset.src; loaded = true; }
      });
    });
  }

  return { render };
})();


/* ─────────────────────────────────────────
   4. FILTER
───────────────────────────────────────── */
const Filter = (() => {
  function init() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        document.querySelectorAll('#project-grid .card').forEach(card => {
          const show = cat === 'all' || card.dataset.cat === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }
  return { init };
})();


/* ─────────────────────────────────────────
   5. MODAL SYSTEM
───────────────────────────────────────── */
const Modal = (() => {
  let currentSlide = 0;
  let totalSlides  = 0;
  let touchStartX  = 0;

  /* ── Build button HTML ── */
  function buildButtons(buttons, projectId) {
    if (!buttons || !buttons.length) return '';
    const html = buttons.map(btn => {
      const ic  = icon(btn.icon || 'link');
      const cls = btn.style === 'accent' ? 'mbtn mbtn-accent'
                : btn.type === 'video' || btn.style === 'primary' ? 'mbtn mbtn-primary'
                : 'mbtn mbtn-outline';

      if (btn.type === 'video') {
        return `<button class="${cls}" onclick="Modal.openVideo(${projectId})">${ic} ${btn.label}</button>`;
      }
      if (btn.type === 'gallery') {
        return `<button class="${cls}" onclick="Modal.openGallery(${projectId})">${ic} ${btn.label}</button>`;
      }
      if (btn.type === 'page') {
        return `<a class="${cls}" href="/project.html?id=${projectId}">${ic} ${btn.label}</a>`;
      }
      if (btn.type === 'link' && btn.url) {
        return `<a class="${cls}" href="${btn.url}" target="_blank" rel="noopener">${ic} ${btn.label}</a>`;
      }
      return `<span class="mbtn mbtn-disabled">${ic} ${btn.label}</span>`;
    }).join('');
    return `<div class="modal-btns">${html}</div>`;
  }

  /* ── Build meta info ── */
  function buildMeta(p) {
    const items = [];
    if (p.client)   items.push(`<div class="meta-item"><div class="meta-label">Client</div><div class="meta-value">${p.client}</div></div>`);
    if (p.location) items.push(`<div class="meta-item"><div class="meta-label">Location</div><div class="meta-value">${p.location}</div></div>`);
    if (p.roles && p.roles.length) {
      const rolesHTML = p.roles.map(r => `<span class="meta-role">${r}</span>`).join('');
      items.push(`<div class="meta-item"><div class="meta-label">My Role</div><div class="meta-roles">${rolesHTML}</div></div>`);
    }
    return items.length ? `<div class="modal-meta">${items.join('')}</div>` : '';
  }

  /* ── Build awards ── */
  function buildAwards(awards) {
    if (!awards || !awards.length) return '';
    return `<div class="modal-awards">${awards.map(a => `<span class="award-tag">🏆 ${a}</span>`).join('')}</div>`;
  }

  /* ── Build body (shared) ── */
  function buildBody(p) {
    return `
      <div class="modal-body">
        <div class="modal-tag">${p.tag}</div>
        <div class="modal-title">${p.title}</div>
        <div class="modal-desc">${p.description}</div>
        ${buildMeta(p)}
        ${buildButtons(p.buttons, p.id)}
        ${buildAwards(p.awards)}
      </div>`;
  }

  /* ── Open video modal ── */
  async function openVideo(id) {
    const p = await Data.getById(id);
    if (!p) return;

    let mediaHTML = '';
    if (p.video) {
      if (p.video.type === 'youtube') {
        mediaHTML = `<div class="modal-video">
          <iframe src="https://www.youtube.com/embed/${p.video.id}?autoplay=1&mute=0&rel=0&modestbranding=1"
            allow="autoplay;fullscreen;encrypted-media" allowfullscreen></iframe>
        </div>`;
      } else if (p.video.type === 'mp4' && p.video.url) {
        mediaHTML = `<div class="modal-video">
          <video src="${p.video.url}" controls autoplay playsinline></video>
        </div>`;
      }
    } else if (p.thumbnail) {
      mediaHTML = `<div class="modal-video"><img src="${p.thumbnail}" alt="${p.title}"></div>`;
    }

    openWith(mediaHTML + buildBody(p));
  }

  /* ── Open gallery modal ── */
  async function openGallery(id) {
    const p = await Data.getById(id);
    if (!p || !p.gallery || !p.gallery.length) {
      /* fallback: show thumbnail only */
      const fb = await Data.getById(id);
      const imgs = fb && fb.thumbnail ? [fb.thumbnail] : [];
      if (!imgs.length) return;
      p.gallery = imgs;
    }

    currentSlide = 0;
    totalSlides  = p.gallery.length;

    const slides = p.gallery.map((src, i) =>
      `<div class="photo-slide${i === 0 ? ' active' : ''}">
        <img src="${src}" alt="${p.title} ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}">
      </div>`
    ).join('');

    const controls = p.gallery.length > 1 ? `
      <button class="slide-arrow prev" onclick="Modal.goTo(Modal.current() - 1)">&#8249;</button>
      <button class="slide-arrow next" onclick="Modal.goTo(Modal.current() + 1)">&#8250;</button>
      <div class="slide-dots">${p.gallery.map((_, i) =>
        `<button class="slide-dot${i === 0 ? ' active' : ''}" onclick="Modal.goTo(${i})"></button>`
      ).join('')}</div>
      <div class="slide-counter" id="slide-counter">1 / ${p.gallery.length}</div>` : '';

    const mediaHTML = `<div class="modal-photo">${slides}${controls}</div>`;
    openWith(mediaHTML + buildBody(p));
  }

  /* ── goTo slide ── */
  function goTo(n) {
    const slides = document.querySelectorAll('.modal-photo .photo-slide');
    const dots   = document.querySelectorAll('.modal-photo .slide-dot');
    if (!slides.length) return;
    currentSlide = ((n % totalSlides) + totalSlides) % totalSlides;
    slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
    dots.forEach((d, i)   => d.classList.toggle('active', i === currentSlide));
    const counter = document.getElementById('slide-counter');
    if (counter) counter.textContent = `${currentSlide + 1} / ${totalSlides}`;
  }

  function current() { return currentSlide; }

  /* ── Core open / close ── */
  function openWith(html) {
    const el = document.getElementById('modal');
    if (!el) return;
    document.getElementById('modal-content').innerHTML = html;
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.querySelector('.modal-box').scrollTop = 0;
  }

  function close() {
    const el = document.getElementById('modal');
    if (!el) return;
    el.classList.remove('open');
    document.body.style.overflow = '';
    const ifr = document.querySelector('#modal-content iframe');
    if (ifr) ifr.src = '';
    const vid = document.querySelector('#modal-content video');
    if (vid) { vid.pause(); vid.currentTime = 0; }
    setTimeout(() => {
      const mc = document.getElementById('modal-content');
      if (mc) mc.innerHTML = '';
    }, 350);
  }

  /* ── Keyboard + swipe ── */
  function initEvents() {
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { close(); return; }
      if (document.querySelector('.modal-photo .photo-slide')) {
        if (e.key === 'ArrowLeft')  goTo(currentSlide - 1);
        if (e.key === 'ArrowRight') goTo(currentSlide + 1);
      }
    });
    document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
    document.addEventListener('touchend',   e => {
      if (!document.querySelector('.modal-photo .photo-slide')) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) goTo(currentSlide + (dx < 0 ? 1 : -1));
    });
  }

  return { openVideo, openGallery, goTo, current, close, initEvents };
})();


/* ─────────────────────────────────────────
   6. SCROLL REVEAL
───────────────────────────────────────── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}


/* ─────────────────────────────────────────
   7. CURSOR
───────────────────────────────────────── */
function initCursor() {
  const cur  = document.getElementById('cur');
  const curR = document.getElementById('cur-r');
  if (!cur || !curR) return;

  let rx = 0, ry = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cur.style.left = cx + 'px';
    cur.style.top  = cy + 'px';
  });
  (function loop() {
    rx += (cx - rx) * 0.12;
    ry += (cy - ry) * 0.12;
    curR.style.left = rx + 'px';
    curR.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  const expandTargets = 'a, button, .card, .filter-btn, .mbtn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(expandTargets)) {
      cur.style.width = '4px'; cur.style.height = '4px';
      curR.style.width = '52px'; curR.style.height = '52px';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(expandTargets)) {
      cur.style.width = '8px'; cur.style.height = '8px';
      curR.style.width = '32px'; curR.style.height = '32px';
    }
  });
}


/* ─────────────────────────────────────────
   8. THREE.JS BACKGROUND
───────────────────────────────────────── */
function initThreeBackground() {
  if (typeof THREE === 'undefined') return;
  const canvas   = document.getElementById('bg-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x080808, 1);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  const geo  = new THREE.TorusKnotGeometry(1.5, 0.42, 200, 32);
  const mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({
    color: 0x0a0a14, emissive: 0x040410, specular: 0x202050,
    shininess: 30, transparent: true, opacity: 0.88
  }));
  mesh.position.x = 2.5;
  scene.add(mesh);

  const wire = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.5, 0.42, 80, 16),
    new THREE.MeshBasicMaterial({ color: 0x18182a, wireframe: true, transparent: true, opacity: 0.07 })
  );
  wire.position.x = 2.5;
  scene.add(wire);

  scene.add(new THREE.AmbientLight(0x080816, 3));
  const l1 = new THREE.PointLight(0x2030d0, 5, 20); l1.position.set(5, 4, 4); scene.add(l1);
  const l2 = new THREE.PointLight(0xc8b89a, 3, 18); l2.position.set(-4, -2, 3); scene.add(l2);

  let mx = 0, my = 0, t = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX / window.innerWidth - 0.5;
    my = -(e.clientY / window.innerHeight - 0.5);
  });
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  (function animate() {
    requestAnimationFrame(animate);
    t += 0.004;
    mesh.rotation.x += 0.003 + my * 0.004;
    mesh.rotation.y += 0.006 + mx * 0.004;
    wire.rotation.x  = mesh.rotation.x;
    wire.rotation.y  = mesh.rotation.y;
    l1.position.x = Math.sin(t) * 6;
    l1.position.y = Math.cos(t * 0.6) * 4;
    l2.position.x = Math.cos(t * 0.8) * 6;
    renderer.render(scene, camera);
  })();
}


/* ─────────────────────────────────────────
   9. BOOT
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  /* Index page */
  if (document.getElementById('project-grid')) {
    Grid.render('project-grid').then(() => Filter.init());
  }

  Modal.initEvents();
  initReveal();
  initCursor();
  initThreeBackground();
});
