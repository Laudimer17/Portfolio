// =====================================
//   FELIX PROTOCOL - MAIN JS
//   Network & Cybersecurity Theme
// =====================================

// ---- Typed Text Effect ----
const typedEl = document.getElementById('typed-text');
const roles = [
  'Network Engineer',
  'Customer Experience Specialist',
  'IT Practitioner',
  'Aspiring Purple Team Pro',
  'Cybersecurity Enthusiast'
];
let roleIdx = 0, charIdx = 0, isDeleting = false;

function typeEffect() {
  const current = roles[roleIdx];
  if (isDeleting) {
    typedEl.textContent = current.slice(0, charIdx--);
    if (charIdx < 0) { isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; charIdx = 0; }
    setTimeout(typeEffect, 55);
  } else {
    typedEl.textContent = current.slice(0, charIdx++);
    if (charIdx > current.length) { isDeleting = true; setTimeout(typeEffect, 1800); return; }
    setTimeout(typeEffect, 85);
  }
}
typeEffect();

// =====================================
// NAVBAR SCROLL
// =====================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.getAttribute('id');
  });

  navLinks.forEach(l => {
    l.classList.remove('active');
    if (l.getAttribute('href') === `#${current}`) l.classList.add('active');
  });
});

// =====================================
// SMOOTH SCROLL FOR SAME-PAGE LINKS
// =====================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar ? navbar.offsetHeight : 70;
    const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 30;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// =====================================
// HAMBURGER MENU
// =====================================
const hamburger = document.getElementById('hamburger');
const navList = document.querySelector('.nav-links');

if (hamburger && navList) {
  hamburger.addEventListener('click', () => navList.classList.toggle('open'));
  navList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navList.classList.remove('open'));
  });
}

// ---- Counter Animation ----
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start >= target) clearInterval(timer);
  }, 16);
}

const statNums = document.querySelectorAll('.stat-number');
let statsAnimated = false;
const heroObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    statNums.forEach(el => animateCounter(el, +el.dataset.target));
  }
}, { threshold: 0.5 });
heroObs.observe(document.getElementById('hero'));

// ---- Scroll Reveal ----
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('visible'), +delay);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.skill-card').forEach(el => revealObs.observe(el));

// ---- Skill Bars Animation ----
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const bar = e.target.querySelector('.skill-bar');
      if (bar) bar.style.width = bar.dataset.width + '%';
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-card').forEach(el => barObs.observe(el));

// ---- About Image Fallback ----
const aboutImg = document.getElementById('about-img');
if (aboutImg) {
  aboutImg.onerror = () => {
    aboutImg.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `width:100%;aspect-ratio:1;background:linear-gradient(135deg,#22d3ee,#60a5fa);display:flex;align-items:center;justify-content:center;font-size:6rem;`;
    placeholder.textContent = '🛡️';
    aboutImg.parentNode.insertBefore(placeholder, aboutImg);
  };
}

// ---- Contact Form ----
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  btn.disabled = true;
  btn.innerHTML = '<span>Sending...</span>';
  setTimeout(() => {
    btn.innerHTML = '<span>Send Message</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/></svg>';
    btn.disabled = false;
    formSuccess.classList.add('visible');
    form.reset();
    setTimeout(() => formSuccess.classList.remove('visible'), 5000);
  }, 1500);
});

// ---- Glitch Effect on Hero Title ----
function triggerGlitch() {
  const titles = document.querySelectorAll('.title-line');
  titles.forEach(t => {
    t.classList.add('glitch-active');
    setTimeout(() => t.classList.remove('glitch-active'), 300);
  });
  setTimeout(triggerGlitch, Math.random() * 6000 + 4000);
}
setTimeout(triggerGlitch, 3000);

// =====================================
//   MATRIX BINARY RAIN
// =====================================
(function initMatrixRain() {
  const canvas = document.createElement('canvas');
  canvas.id = 'matrix-canvas';
  canvas.style.cssText = `
    position:fixed;top:0;left:0;width:100%;height:100%;
    pointer-events:none;z-index:1;opacity:0.04;
  `;
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ#$%&<>[]{}|^~';
  const fontSize = 13;
  let cols = Math.floor(canvas.width / fontSize);
  let drops = Array(cols).fill(1);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(5,5,8,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    cols = Math.floor(canvas.width / fontSize);
    if (drops.length !== cols) drops = Array(cols).fill(1);
    for (let i = 0; i < cols; i++) {
      const r = Math.random();
      ctx.font = `${fontSize}px 'Courier New', monospace`;
      ctx.fillStyle = r < 0.1 ? '#60a5fa' : '#22d3ee';
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  setInterval(drawMatrix, 55);
})();

// =====================================
//   THREE.JS HERO — NETWORK NODE GRAPH
// =====================================
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  camera.position.z = 18;

  const NODE_COUNT = 60;
  const CONNECTION_DIST = 4.5;
  const nodes = [];
  const nodeVelocities = [];
  const nodeRoles = [];

  for (let i = 0; i < NODE_COUNT; i++) {
    const role = Math.random() < 0.07 ? 2 : (Math.random() < 0.1 ? 3 : (Math.random() < 0.15 ? 1 : 0));
    nodeRoles.push(role);
    const color = role === 2 ? 0xff4444 : role === 3 ? 0x22c55e : role === 1 ? 0x3b82f6 : 0x22d3ee;
    const size = role === 1 ? 0.18 : role === 2 ? 0.13 : role === 3 ? 0.11 : 0.07 + Math.random() * 0.05;
    const geo = new THREE.SphereGeometry(size, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 8);
    scene.add(mesh);
    nodes.push(mesh);
    nodeVelocities.push(new THREE.Vector3(
      (Math.random() - 0.5) * 0.015,
      (Math.random() - 0.5) * 0.015,
      (Math.random() - 0.5) * 0.005
    ));
  }

  const rings = [];
  nodes.forEach((node, i) => {
    if (nodeRoles[i] === 1 || nodeRoles[i] === 2 || nodeRoles[i] === 3) {
      const ringGeo = new THREE.RingGeometry(0.25, 0.29, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: nodeRoles[i] === 2 ? 0xff4444 : nodeRoles[i] === 3 ? 0x22c55e : 0x3b82f6,
        transparent: true, opacity: 0.5, side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(node.position);
      scene.add(ring);
      rings.push({ mesh: ring, node, idx: i });
    }
  });

  const lineMat = new THREE.LineBasicMaterial({ color: 0x0891b2, transparent: true, opacity: 0.25 });
  const lineObjects = [];

  function buildEdges() {
    lineObjects.forEach(l => scene.remove(l));
    lineObjects.length = 0;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) < CONNECTION_DIST) {
          const geo = new THREE.BufferGeometry().setFromPoints([nodes[i].position.clone(), nodes[j].position.clone()]);
          const line = new THREE.Line(geo, lineMat.clone());
          scene.add(line);
          lineObjects.push(line);
        }
      }
    }
  }
  buildEdges();

  const PACKET_COUNT = 20;
  const packets = [];
  const packetGeo = new THREE.SphereGeometry(0.05, 6, 6);
  for (let p = 0; p < PACKET_COUNT; p++) {
    const color = Math.random() < 0.3 ? 0x60a5fa : 0xc084fc;
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 });
    const mesh = new THREE.Mesh(packetGeo, mat);
    scene.add(mesh);
    packets.push({ mesh, from: Math.floor(Math.random() * nodes.length), to: Math.floor(Math.random() * nodes.length), t: Math.random() });
  }

  function updatePackets() {
    packets.forEach(p => {
      p.t += 0.008;
      if (p.t >= 1) { p.t = 0; p.from = p.to; p.to = Math.floor(Math.random() * nodes.length); }
      p.mesh.position.lerpVectors(nodes[p.from].position, nodes[p.to].position, p.t);
    });
  }

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const clock = new THREE.Clock();
  let edgeTimer = 0;

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    edgeTimer++;
    nodes.forEach((node, i) => {
      node.position.add(nodeVelocities[i]);
      ['x','y','z'].forEach(ax => {
        const lim = ax === 'z' ? 4 : ax === 'y' ? 7 : 11;
        if (Math.abs(node.position[ax]) > lim) nodeVelocities[i][ax] *= -1;
      });
    });
    rings.forEach(r => {
      r.mesh.position.copy(r.node.position);
      r.mesh.rotation.z = t * 1.5;
      r.mesh.scale.setScalar(1 + Math.sin(t * 3 + r.idx) * 0.15);
    });
    if (edgeTimer % 90 === 0) buildEdges();
    else {
      lineObjects.forEach(line => {
        const posAttr = line.geometry.attributes.position;
        if (posAttr) {
          const a = new THREE.Vector3(posAttr.array[0], posAttr.array[1], posAttr.array[2]);
          const b = new THREE.Vector3(posAttr.array[3], posAttr.array[4], posAttr.array[5]);
          line.material.opacity = Math.max(0, 0.35 - a.distanceTo(b) * 0.04);
        }
      });
    }
    updatePackets();
    nodes.forEach((node, i) => {
      if (nodeRoles[i] === 2) node.material.opacity = 0.6 + Math.abs(Math.sin(t * 4 + i)) * 0.4;
    });
    camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 1.0 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();

// =====================================
//   SKILLS SECTION — CIRCUIT BOARD CANVAS
// =====================================
(function initSkillsCanvas() {
  const canvas = document.getElementById('skills-canvas');
  if (!canvas) return;
  const parent = canvas.parentElement;
  canvas.style.display = 'none';
  const c2d = document.createElement('canvas');
  c2d.style.cssText = `position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.5;`;
  parent.appendChild(c2d);
  function resize() { c2d.width = parent.offsetWidth; c2d.height = parent.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  const ctx = c2d.getContext('2d');
  const TRACES = [];
  function generateTraces() {
    TRACES.length = 0;
    const W = c2d.width, H = c2d.height, GRID = 60;
    for (let i = 0; i < 35; i++) {
      TRACES.push({ x: Math.floor(Math.random() * (W / GRID)) * GRID, y: Math.floor(Math.random() * (H / GRID)) * GRID, len: Math.floor(Math.random() * 5 + 2), dir: Math.random() < 0.5 ? 'H' : 'V', progress: 0, speed: Math.random() * 0.012 + 0.005, color: Math.random() < 0.2 ? '#60a5fa' : '#22d3ee' });
    }
  }
  generateTraces();
  const DOTS = [];
  function generateDots() {
    DOTS.length = 0;
    const W = c2d.width, H = c2d.height, GRID = 60;
    for (let x = GRID; x < W - GRID; x += GRID)
      for (let y = GRID; y < H - GRID; y += GRID)
        if (Math.random() < 0.3) DOTS.push({ x, y, pulse: Math.random() * Math.PI * 2, color: Math.random() < 0.15 ? '#60a5fa' : '#67e8f9' });
  }
  generateDots();
  let animT = 0;
  function drawCircuit() {
    ctx.clearRect(0, 0, c2d.width, c2d.height);
    animT += 0.016;
    const GRID = 60;
    TRACES.forEach(tr => {
      tr.progress = Math.min(tr.progress + tr.speed, 1);
      const endX = tr.dir === 'H' ? tr.x + tr.len * GRID : tr.x;
      const endY = tr.dir === 'V' ? tr.y + tr.len * GRID : tr.y;
      const cx = tr.x + (endX - tr.x) * tr.progress;
      const cy = tr.y + (endY - tr.y) * tr.progress;
      ctx.beginPath(); ctx.moveTo(tr.x, tr.y); ctx.lineTo(cx, cy);
      ctx.strokeStyle = tr.color; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.35; ctx.stroke(); ctx.globalAlpha = 1;
      if (tr.progress >= 1) {
        tr.x = Math.floor(Math.random() * (c2d.width / GRID)) * GRID;
        tr.y = Math.floor(Math.random() * (c2d.height / GRID)) * GRID;
        tr.len = Math.floor(Math.random() * 5 + 2);
        tr.dir = Math.random() < 0.5 ? 'H' : 'V';
        tr.progress = 0;
        tr.color = Math.random() < 0.2 ? '#3b82f6' : '#22d3ee';
      }
      ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = tr.color; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1;
    });
    DOTS.forEach(d => {
      const pulse = 0.5 + Math.abs(Math.sin(animT * 2 + d.pulse)) * 0.5;
      ctx.beginPath(); ctx.arc(d.x, d.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = d.color; ctx.globalAlpha = pulse * 0.6; ctx.fill(); ctx.globalAlpha = 1;
    });
    requestAnimationFrame(drawCircuit);
  }
  drawCircuit();
  window.addEventListener('resize', () => { resize(); generateTraces(); generateDots(); });
})();

// =====================================
//   CONTACT SECTION — NETWORK PING CANVAS
// =====================================
(function initContactCanvas() {
  const canvas = document.getElementById('contact-canvas');
  if (!canvas) return;
  canvas.style.display = 'none';
  const parent = canvas.parentElement;
  const c2d = document.createElement('canvas');
  c2d.style.cssText = `position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0.35;`;
  parent.appendChild(c2d);
  function resize() { c2d.width = parent.offsetWidth; c2d.height = parent.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  const ctx = c2d.getContext('2d');
  const sources = [];
  function generateSources() {
    sources.length = 0;
    const W = c2d.width, H = c2d.height;
    for (let i = 0; i < 5; i++) sources.push({ x: Math.random() * W, y: Math.random() * H, waves: [], timer: Math.random() * 120 });
  }
  generateSources();
  function drawHexGrid() {
    const W = c2d.width, H = c2d.height, SIZE = 30, HH = SIZE * Math.sqrt(3);
    ctx.strokeStyle = 'rgba(124,58,237,0.07)'; ctx.lineWidth = 1;
    for (let row = -1; row < H / HH + 1; row++) {
      for (let col = -1; col < W / (SIZE * 1.5) + 1; col++) {
        const x = col * SIZE * 1.5, y = row * HH + (col % 2 === 0 ? 0 : HH / 2);
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const angle = Math.PI / 180 * (60 * k - 30);
          k === 0 ? ctx.moveTo(x + SIZE * Math.cos(angle), y + SIZE * Math.sin(angle)) : ctx.lineTo(x + SIZE * Math.cos(angle), y + SIZE * Math.sin(angle));
        }
        ctx.closePath(); ctx.stroke();
      }
    }
  }
  function drawPings() {
    ctx.clearRect(0, 0, c2d.width, c2d.height);
    drawHexGrid();
    sources.forEach(src => {
      src.timer--;
      if (src.timer <= 0) { src.waves.push({ r: 0, alpha: 0.7 }); src.timer = Math.floor(Math.random() * 100 + 60); }
      ctx.beginPath(); ctx.arc(src.x, src.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() < 0.05 ? '#3b82f6' : '#67e8f9'; ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1;
      src.waves = src.waves.filter(w => w.alpha > 0.01);
      src.waves.forEach(w => {
        ctx.beginPath(); ctx.arc(src.x, src.y, w.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(124,58,237,${w.alpha.toFixed(2)})`; ctx.lineWidth = 1.5; ctx.stroke();
        w.r += 2.5; w.alpha *= 0.96;
      });
    });
    requestAnimationFrame(drawPings);
  }
  drawPings();
  window.addEventListener('resize', () => { resize(); generateSources(); });
})();

// =====================================
//   FELIX PROTOCOL SPLASH SCREEN
// =====================================
document.body.classList.add("splash-active");
document.addEventListener("DOMContentLoaded", () => {

  const splash     = document.getElementById("splash-screen");
  const progress   = document.getElementById("loading-progress");
  const percent    = document.getElementById("loading-percent");
  const message    = document.getElementById("loading-message");
  const ipStatusEl = document.getElementById('ip-status');
  const splashBg   = document.querySelector('.splash-bg');

  const intendedHash = window.location.hash || null;

  // =====================================
  // IP / ISP FETCH (non-blocking)
  // =====================================
  async function fetchVisitorInfo() {
    if (!ipStatusEl) return;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      const ipv4 = data.ip;
      try {
        const res2 = await fetch(`https://ipapi.co/${ipv4}/json/`);
        const d2 = await res2.json();
        const isp = d2.org || 'Unknown ISP';
        const city = d2.city || '';
        const country = d2.country_name || '';
        ipStatusEl.textContent = `✔ SECURE IPv4  |  IP: ${ipv4}  |  ISP: ${isp}  |  ${city}, ${country}`;
      } catch {
        ipStatusEl.textContent = `✔ SECURE IPv4  |  IP: ${ipv4}`;
      }
    } catch {
      ipStatusEl.textContent = 'CONNECTION ESTABLISHED';
    }
  }
  fetchVisitorInfo();

  // =====================================
  // HANDLE HASH FROM OTHER PAGE
  // =====================================
  function handlePageHash() {
    if (!intendedHash) return;
    const check = setInterval(() => {
      if (document.body.classList.contains('splash-done')) {
        clearInterval(check);
        const target = document.querySelector(intendedHash);
        if (!target) return;
        const navHeight = navbar ? navbar.offsetHeight : 70;
        const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 30;
        window.scrollTo({ top, behavior: 'instant' });
      }
    }, 100);
    setTimeout(() => clearInterval(check), 10000);
  }

  // =====================================
  // SPLASH LOADING ANIMATION
  // =====================================
  if (!splash) return;

  const LOADING_DURATION = 7000;
  const READY_DELAY      = 700;

  const loadingMessages = [
    { progress: 0,   text: "INITIALIZING FELIX PROTOCOL..." },
    { progress: 15,  text: "INITIALIZING NETWORK..."        },
    { progress: 35,  text: "LOADING SECURITY MODULES..."    },
    { progress: 55,  text: "ESTABLISHING SECURE CONNECTION..." },
    { progress: 75,  text: "LOADING INTERFACE..."           },
    { progress: 90,  text: "VERIFYING SYSTEM..."            },
    { progress: 100, text: "SYSTEM READY"                   }
  ];

  let animationFrame = null;
  let startTime      = null;

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function updateProgress(value) {
    const rounded = Math.floor(value);
    if (progress) progress.style.width = rounded + "%";
    if (percent)  percent.textContent  = rounded + "%";
    let currentMessage = loadingMessages[0];
    for (const item of loadingMessages) {
      if (rounded >= item.progress) currentMessage = item;
    }
    if (message && message.textContent !== currentMessage.text) {
      message.textContent = currentMessage.text;
    }
  }

  function hideSplash() {
    if (!splash) return;
    splash.classList.add("splash-hidden");
    setTimeout(() => {
      if (splash) splash.style.display = "none";
      document.body.classList.remove("splash-active");
      document.body.classList.add("splash-done");
      handlePageHash();
    }, 500);
  }

  /*
   * -----------------------------------------
   * LOGO MORPH TO NAVBAR — page reveals at landing
   * -----------------------------------------
   */
 function transitionLogoAndHide() {
  const splashLogoImg = document.querySelector('.splash-logo-img');
  const navLogoImg    = document.querySelector('.nav-logo-img');
  const splash        = document.getElementById('splash-screen');
  const curtain       = document.getElementById('splash-curtain');

  if (!splashLogoImg || !navLogoImg || !splash) {
    hideSplash();
    return;
  }

  // Fade out loading elements
  document.querySelectorAll(
    '.splash-loading, .splash-subtitle, .splash-line, .splash-status, .splash-brand, .splash-grid, .splash-corner'
  ).forEach(el => {
    if (el) {
      el.style.transition = 'opacity 0.4s ease';
      el.style.opacity = '0';
    }
  });

  // Measure positions
  const splashRect = splashLogoImg.getBoundingClientRect();
  const navRect    = navLogoImg.getBoundingClientRect();

  const deltaX = (navRect.left + navRect.width / 2) - (splashRect.left + splashRect.width / 2);
  const deltaY = (navRect.top + navRect.height / 2) - (splashRect.top + splashRect.height / 2);
  const scale  = navRect.width / splashRect.width;

  const duration  = 1200;
  const startTime = performance.now();

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function finish() {
    requestAnimationFrame(() => {
      if (splash) {
        splash.style.display = 'none';
        document.body.classList.remove('splash-active');
        document.body.classList.add('splash-done');
      }
      splashLogoImg.style.transform = '';
      if (curtain) curtain.style.opacity = '';
      handlePageHash();
    });
  }






  function frame(now) {
    const elapsed     = now - startTime;
    const rawProgress = Math.min(elapsed / duration, 1);
    const p           = easeOutExpo(rawProgress);


    const currentX = deltaX * p;
    const currentY = deltaY * p;
    const currentScale = 1 + (scale - 1) * p;


    // Fly logo
    splashLogoImg.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(${currentScale})`;
    /* 
    /* 
     * CURTAIN FADE:
     * 0% - 50%   -> fully black (page completely hidden)
     * 50% - 100% -> smoothly clears as logo nears navbar
     */



   if (curtain) {
      let bgOpacity = 1;
      if (p > 0.5) {
        const t = (p - 0.5) / 0.5; // 0 → 1 during second half
        bgOpacity = 1 - (t * t);    // ease-in: stays dark longer, then clears
      }
      curtain.style.opacity = String(Math.max(0, bgOpacity));
    }

    if (rawProgress < 1) {
      requestAnimationFrame(frame);
    } else {
      finish();
    }
  }

  requestAnimationFrame(frame);
}


  function animateLoading(currentTime) {
    if (!startTime) startTime = currentTime;
    const elapsed       = currentTime - startTime;
    const progressRatio = Math.min(elapsed / LOADING_DURATION, 1);
    const value         = Math.min(easeInOut(progressRatio) * 100, 100);
    updateProgress(value);

    if (progressRatio < 1) {
      animationFrame = requestAnimationFrame(animateLoading);
      return;
    }

    updateProgress(100);
    setTimeout(() => transitionLogoAndHide(), READY_DELAY);
  }

  updateProgress(0);
  animationFrame = requestAnimationFrame(animateLoading);

});