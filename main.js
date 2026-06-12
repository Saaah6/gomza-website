/* ── Native scroll shim (replaces heavy Lenis for performance) ── */
const lenis = {
  target: 0,
  _cbs: {},
  on(event, cb){ (this._cbs[event] = this._cbs[event]||[]).push(cb); return this; },
  scrollTo(target, opts={}){
    const offset = (opts&&opts.offset)||0;
    const top = (typeof target === 'number') ? target : target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: Math.max(0, top - 80), behavior:'smooth' });
  }
};
window.lenis = lenis;
// Keep __lenisScroll in sync with native scroll
window.addEventListener('scroll', () => {
  window.__lenisScroll = window.scrollY;
  (lenis._cbs['scroll']||[]).forEach(fn => fn({ scroll: window.scrollY }));
}, { passive: true });

/* ═══════════════════════════════
   THREE.JS BACKGROUND SCENE
═══════════════════════════════ */
function initThree(){
  // Skip on mobile or if WebGL isn't available
  if(window.innerWidth < 768) return;
  try {
    const test = document.createElement('canvas').getContext('webgl');
    if(!test) return;
  } catch(e){ return; }

  (function(){
  const container = document.getElementById('three-bg');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 500;

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // ── STAR FIELD ──
  const starCount = 500;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  const colorPalette = [
    new THREE.Color(0x3B82F6),
    new THREE.Color(0x6366F1),
    new THREE.Color(0xF59E0B),
    new THREE.Color(0xA5B4FC),
    new THREE.Color(0xFFFFFF),
  ];
  for(let i = 0; i < starCount; i++){
    starPos[i*3]   = (Math.random() - 0.5) * 2000;
    starPos[i*3+1] = (Math.random() - 0.5) * 2000;
    starPos[i*3+2] = (Math.random() - 0.5) * 1200;
    const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    starColors[i*3]   = c.r;
    starColors[i*3+1] = c.g;
    starColors[i*3+2] = c.b;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
  const starMat = new THREE.PointsMaterial({
    size: 1.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.45,
    sizeAttenuation: true,
  });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // ── FLOATING NODE NETWORK ──
  const nodeCount = 20;
  const nodePositions = [];
  const nodeVelocities = [];
  const nodeMeshes = [];

  const nodeGeo = new THREE.SphereGeometry(0.8, 5, 5);
  const nodeMats = [
    new THREE.MeshBasicMaterial({ color: 0x3B82F6, transparent: true, opacity: 0.35 }),
    new THREE.MeshBasicMaterial({ color: 0x6366F1, transparent: true, opacity: 0.28 }),
    new THREE.MeshBasicMaterial({ color: 0xF59E0B, transparent: true, opacity: 0.22 }),
  ];

  for(let i = 0; i < nodeCount; i++){
    const pos = new THREE.Vector3(
      (Math.random() - 0.5) * 1400,
      (Math.random() - 0.5) * 900,
      (Math.random() - 0.5) * 400 - 200
    );
    const vel = new THREE.Vector3(
      (Math.random() - 0.5) * 0.12,
      (Math.random() - 0.5) * 0.12,
      0
    );
    nodePositions.push(pos);
    nodeVelocities.push(vel);
    const mesh = new THREE.Mesh(nodeGeo, nodeMats[i % nodeMats.length]);
    mesh.position.copy(pos);
    mesh.scale.setScalar(Math.random() * 0.6 + 0.3);
    scene.add(mesh);
    nodeMeshes.push(mesh);
  }

  // ── CONNECTING LINES ──
  const MAX_DIST = 180;
  const maxSegments = (nodeCount * (nodeCount - 1)) / 2;
  const linePositions = new Float32Array(maxSegments * 2 * 3);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeo.setDrawRange(0, 0);
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x3B82F6,
    transparent: true,
    opacity: 0.06,
  });
  const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lineSegments);

  function updateLines(){
    let writeIndex = 0;
    for(let i = 0; i < nodeCount; i++){
      for(let j = i + 1; j < nodeCount; j++){
        const a = nodePositions[i];
        const b = nodePositions[j];
        if(a.distanceTo(b) < MAX_DIST){
          linePositions[writeIndex++] = a.x;
          linePositions[writeIndex++] = a.y;
          linePositions[writeIndex++] = a.z;
          linePositions[writeIndex++] = b.x;
          linePositions[writeIndex++] = b.y;
          linePositions[writeIndex++] = b.z;
        }
      }
    }
    lineGeo.setDrawRange(0, writeIndex / 3);
    lineGeo.attributes.position.needsUpdate = true;
  }

  // ── LARGE GLOWING ORBS ──
  const orbData = [
    { color: 0x2563EB, x: -300, y: 200, z: -300, size: 80, speed: 0.0008 },
    { color: 0x4F46E5, x: 350, y: -150, z: -400, size: 60, speed: 0.0011 },
    { color: 0xF59E0B, x: -100, y: -280, z: -500, size: 45, speed: 0.0006 },
  ];
  const orbs = orbData.map(d => {
    const geo = new THREE.SphereGeometry(d.size, 32, 32);
    const mat = new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: 0.025 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(d.x, d.y, d.z);
    scene.add(mesh);
    const ringGeo = new THREE.SphereGeometry(d.size * 1.6, 32, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: 0.01, side: THREE.BackSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    mesh.add(ring);
    return { mesh, ...d, angle: Math.random() * Math.PI * 2 };
  });

  // ── MOUSE PARALLAX ──
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── RESIZE ──
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let frame = 0;
  function animate(){
    requestAnimationFrame(animate);
    frame++;

    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    camera.position.x += (targetX * 30 - camera.position.x) * 0.05;
    camera.position.y += (-targetY * 20 - camera.position.y) * 0.05;
    camera.position.z = 500 - (window.__lenisScroll || 0) * 0.12;
    camera.lookAt(scene.position);

    stars.rotation.y += 0.00012;
    stars.rotation.x += 0.00006;

    for(let i = 0; i < nodeCount; i++){
      nodePositions[i].add(nodeVelocities[i]);
      if(Math.abs(nodePositions[i].x) > 700) nodeVelocities[i].x *= -1;
      if(Math.abs(nodePositions[i].y) > 450) nodeVelocities[i].y *= -1;
      if(Math.abs(nodePositions[i].z) > 300) nodeVelocities[i].z *= -1;
      nodeMeshes[i].position.copy(nodePositions[i]);
    }

    if(frame % 3 === 0) updateLines();

    orbs.forEach(o => {
      o.angle += o.speed * 60;
      o.mesh.position.x = o.x + Math.sin(o.angle) * 60;
      o.mesh.position.y = o.y + Math.cos(o.angle * 0.7) * 40;
      o.mesh.rotation.y += 0.003;
    });

    renderer.render(scene, camera);
  }
  animate();
  // Pause rendering when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if(document.hidden) renderer.setAnimationLoop(null);
  });
  })(); // end inner IIFE
} // end initThree

// Run Three.js only after page is idle — pause when scrolled past hero
if('requestIdleCallback' in window){
  requestIdleCallback(initThree, { timeout: 2000 });
} else {
  setTimeout(initThree, 300);
}

/* ═══════════════════════════════
   ANIMATED WAVE CANVAS
═══════════════════════════════ */
(function(){
  const c = document.getElementById('wave-canvas');
  const ctx = c.getContext('2d');
  let t = 0;
  function resize(){ c.width = window.innerWidth; c.height = 100; }
  window.addEventListener('resize', resize);
  resize();

  // 30fps throttle for wave canvas
  let lastWave = 0;
  function draw(now){
    requestAnimationFrame(draw);
    if(now - lastWave < 33) return; // ~30fps
    lastWave = now;
    // Skip if canvas is off-screen
    const rect = c.getBoundingClientRect();
    if(rect.bottom < 0 || rect.top > window.innerHeight) return;

    ctx.clearRect(0,0,c.width,100);
    const W = c.width;

    for(let layer=0; layer<3; layer++){
      const amp = [18,12,7][layer];
      const freq = [0.006,0.009,0.013][layer];
      const speed = [0.015,0.022,0.03][layer];
      const alpha = [0.18,0.12,0.08][layer];
      const offset = [0, Math.PI*0.6, Math.PI*1.2][layer];

      ctx.beginPath();
      ctx.moveTo(0, 100);
      for(let x=0; x<=W; x+=4){ // step 3→4 saves ~25% path ops
        const y = 50 + Math.sin(x * freq + t * speed + offset) * amp
                     + Math.sin(x * freq * 1.7 + t * speed * 0.8 + offset) * amp * 0.5;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, 100);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0,0,W,0);
      grad.addColorStop(0,   `rgba(79,124,255,${alpha})`);
      grad.addColorStop(0.4, `rgba(41,211,255,${alpha * 1.4})`);
      grad.addColorStop(0.7, `rgba(255,181,71,${alpha})`);
      grad.addColorStop(1,   `rgba(79,124,255,${alpha * 0.6})`);
      ctx.fillStyle = grad;
      ctx.fill();
    }
    t++;
  }
  requestAnimationFrame(draw);
})();

/* ═══════════════════════════════
   GSAP ANIMATIONS + SCROLL REVEAL
═══════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

document.documentElement.classList.add('js-ready');

// ScrollTrigger uses native scroll — no manual RAF needed

// Hero entrance
gsap.to('#eyebrow',     { opacity:1, y:0, duration:.9, ease:'power3.out', delay:.15 });
gsap.to('#h1',          { opacity:1, y:0, duration:1,  ease:'power3.out', delay:.3  });
gsap.to('#hero-sub',    { opacity:1, y:0, duration:.9, ease:'power3.out', delay:.5  });
gsap.to('#hero-btns',   { opacity:1, y:0, duration:.9, ease:'power3.out', delay:.65 });
gsap.to('#metrics-strip',{ opacity:1,     duration:1,  ease:'power2.out', delay:.85 });

// Scroll reveals
gsap.utils.toArray('.reveal').forEach(el => {
  gsap.to(el, {
    opacity:1, y:0, filter:'blur(0px)', duration:.85, ease:'power3.out',
    scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none none' }
  });
});

gsap.utils.toArray('.niche-card').forEach((el, i) => {
  gsap.to(el, {
    opacity:1, y:0, scale:1, filter:'blur(0px)', duration:.9, ease:'power3.out',
    delay: i * 0.12,
    scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none none' }
  });
});

gsap.utils.toArray('.proof-card').forEach((el, i) => {
  gsap.to(el, {
    opacity:1, y:0, scale:1, filter:'blur(0px)', duration:.85, ease:'power3.out',
    delay: i * 0.1,
    scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none none' }
  });
});

gsap.utils.toArray('.srv').forEach((el, i) => {
  gsap.to(el, {
    opacity:1, y:0, filter:'blur(0px)', duration:.75, ease:'power3.out',
    delay: i * 0.08,
    scrollTrigger:{ trigger:el, start:'top 90%', toggleActions:'play none none none' }
  });
});

gsap.to('.tool-outer', {
  opacity:1, y:0, duration:.9, ease:'power3.out',
  scrollTrigger:{ trigger:'.tool-outer', start:'top 88%', toggleActions:'play none none none' }
});

// Parallax
gsap.to('.hero-glow', {
  y: 60, scale: 1.1, ease:'none',
  scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub: 1.2 }
});

gsap.to('.hero-glow2', {
  y: 35, scale: 1.12, ease:'none',
  scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub: 1.4 }
});

gsap.to('.cta-bg-glow', {
  scale: 1.08, opacity: 0.95, ease:'sine.inOut',
  repeat: -1, yoyo: true, duration: 2.8
});

gsap.fromTo('#beam-group-1',
  { x: -260, y: -30, rotate: -4 },
  { x: 260, y: -30, rotate: 6, duration: 24, ease: 'none', repeat: -1 }
);

gsap.fromTo('#beam-group-2',
  { x: -320, y: 20, rotate: 2 },
  { x: 320, y: 20, rotate: -4, duration: 28, ease: 'none', repeat: -1, delay: -8 }
);

gsap.fromTo('#beam-group-3',
  { x: -280, y: -10, rotate: -2 },
  { x: 280, y: -10, rotate: 3, duration: 30, ease: 'none', repeat: -1, delay: -15 }
);

// ── Smooth nav background
// Nav background on scroll (native)
(function(){
  const nav = document.getElementById('navbar');
  function updateNav(){
    const s = window.scrollY;
    if(s > 60){
      nav.style.background = 'rgba(6,11,24,0.94)';
      nav.style.boxShadow = '0 1px 0 rgba(248,250,252,0.05)';
    } else {
      nav.style.background = 'rgba(6,11,24,0.7)';
      nav.style.boxShadow = 'none';
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
})();

// ── Nav link smooth scroll
document.querySelectorAll('[data-target]').forEach(a => {
  a.style.cursor = 'pointer';
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.getElementById(a.dataset.target);
    if(target){
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  });
});

function focusStrategyCall(){
  const target = document.getElementById('cta-inner');
  if(!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  target.classList.add('is-targeted');
  window.clearTimeout(window.__strategyCallFocusTimer);
  window.__strategyCallFocusTimer = window.setTimeout(() => {
    target.classList.remove('is-targeted');
  }, 2200);
}

// Only the "See Our Work" ghost button scrolls to the CTA section.
// Real action buttons (Book a Call / Book a Free Strategy Call) are wrapped
// in <a href="tel:..."> or <a href="https://form.typeform.com/..."> links —
// they must NOT be intercepted, or taps on mobile get hijacked and feel unresponsive.
(function(){
  const seeWork = document.getElementById('btn-see-work');
  if(seeWork){
    seeWork.style.cursor = 'pointer';
    seeWork.addEventListener('click', focusStrategyCall);
  }
})();

/* ═══════════════════════════════
   CRO TOOL
═══════════════════════════════ */
let currentTab = 're';
function switchTab(tab, el){
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('re-fields').style.display = tab === 're' ? 'block' : 'none';
  document.getElementById('saas-fields').style.display = tab === 'saas' ? 'block' : 'none';
  document.getElementById('out-box').style.display = 'none';
  document.getElementById('copy-row').style.display = 'none';
}

function cleanPhrase(value){
  return (value || '').trim().replace(/\s+/g, ' ');
}

function titleCase(value){
  return cleanPhrase(value)
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}

function inferRealEstateAngle(type, audience, offer){
  const source = `${type} ${audience} ${offer}`.toLowerCase();
  if(/developer|project|launch|new build|construction/.test(source)) return 'launch demand';
  if(/broker|agent|agency/.test(source)) return 'lead capture';
  if(/commercial|tenant|office|retail/.test(source)) return 'qualified tenant flow';
  if(/investor|nri|overseas/.test(source)) return 'high-intent investor leads';
  return 'local buyer demand';
}

function inferSaasAngle(product, icp, problem){
  const source = `${product} ${icp} ${problem}`.toLowerCase();
  if(/appointment|booking|calendar|scheduling/.test(source)) return 'more booked demos';
  if(/email|newsletter|sequence|outreach/.test(source)) return 'higher reply rates';
  if(/seo|content|organic|traffic/.test(source)) return 'pipeline that compounds';
  if(/sales|crm|pipeline|lead/.test(source)) return 'cleaner pipeline conversion';
  if(/support|ticket|helpdesk|chat/.test(source)) return 'faster response times';
  return 'less friction in the funnel';
}

function buildRealEstateCopy(type, audience, offer, content){
  const offerText = cleanPhrase(offer);
  const audienceText = cleanPhrase(audience).toLowerCase();
  const typeText = titleCase(type);
  const angle = inferRealEstateAngle(type, audience, offer);

  switch(content){
    case 'Cold outreach email':
      return `Subject: ${angle} for ${titleCase(audienceText)}\n\nHi,\n\nIf you are marketing ${offerText.toLowerCase()}, the message needs to do more than look polished. It needs to create ${angle}.\n\nWe help ${audienceText} turn attention into booked calls, qualified inquiries, and faster decisions.\n\nIf helpful, I can send a sharper version of the positioning for this offer.\n\nBest,\nGomza`;
    case 'LinkedIn post':
      return `${typeText} marketing works best when the angle is clear.\n\nFor ${audienceText}, ${offerText.toLowerCase()} should create ${angle}, not just visibility.\n\nThat means a sharper hook, one strong proof point, and a CTA that feels easy to take.\n\nThe best campaigns do not shout. They make the next step obvious.`;
    case 'Google ad headline':
      return `Headline 1: ${offerText}\nHeadline 2: ${angle}\nHeadline 3: For ${titleCase(audienceText)}\n\nDescription: ${typeText.toLowerCase()} marketing built to turn searches into qualified leads and booked visits.`;
    default:
      return `Headline: ${angle} for ${titleCase(audienceText)}\n\nSubhead: ${offerText} needs a message that is clearer, sharper, and easier to act on.\n\nBody: We help ${audienceText} turn interest into qualified demand with ${typeText.toLowerCase()} marketing built around the right angle.\n\nCTA: Book a call to see the positioning.`;
  }
}

function buildSaasCopy(product, icp, problem, content){
  const productText = cleanPhrase(product);
  const icpText = cleanPhrase(icp).toLowerCase();
  const problemText = cleanPhrase(problem).replace(/\.$/, '');
  const angle = inferSaasAngle(product, icp, problem);

  switch(content){
    case 'Cold outreach email':
      return `Subject: ${angle} for ${titleCase(icpText)}\n\nHi,\n\nTeams like yours are losing time because ${problemText}.\n\n${productText} helps ${icpText} remove that friction and get to ${angle} faster.\n\nIf useful, I can share a sharper version of the message for your page or outbound.`;
    case 'LinkedIn ad copy':
      return `Stop ${problemText}.\n\n${productText} helps ${icpText} get to ${angle} with less friction and a clearer value story.\n\nBuilt for teams that want more conversions without adding more manual work.`;
    case 'Email subject lines (3 options)':
      return `1. ${productText}: ${angle}\n2. The faster way for ${titleCase(icpText)}\n3. Stop ${problemText.toLowerCase()}`;
    default:
      return `Headline: ${productText} for ${titleCase(icpText)}\n\nSubhead: Built for ${angle}, not vague clicks.\n\nBody: Stop losing time to ${problemText}. We help ${icpText} move from interest to action with a clearer offer and stronger message.\n\nCTA: Book a demo`;
  }
}

async function generateCopy(){
  const bt = document.getElementById('btn-text');
  const bs = document.getElementById('btn-spin');
  const ob = document.getElementById('out-box');
  const cr = document.getElementById('copy-row');
  bt.style.display='none'; bs.style.display='inline-block';
  ob.style.display='block'; ob.className='out-box loading';
  ob.textContent='Generating copy using Gomza\'s CRO framework…';
  cr.style.display='none';

  let prompt = '';
  if(currentTab === 're'){
    const type = document.getElementById('re-type').value;
    const audience = document.getElementById('re-audience').value;
    const offer = document.getElementById('re-offer').value || 'premium properties';
    const content = document.getElementById('re-content').value;
    prompt = buildRealEstateCopy(type, audience, offer, content);
  } else {
    const product = document.getElementById('saas-product').value || 'a productivity SaaS tool';
    const icp = document.getElementById('saas-icp').value || 'B2B founders';
    const problem = document.getElementById('saas-problem').value || 'teams waste hours on manual work';
    const content = document.getElementById('saas-content').value;
    prompt = buildSaasCopy(product, icp, problem, content);
  }

  ob.className='out-box';
  ob.textContent='';
  cr.style.display='none';

  // Typewriter effect
  let i = 0;
  const speed = 18; // ms per character
  function typeChar(){
    if(i < prompt.length){
      ob.textContent += prompt[i];
      i++;
      setTimeout(typeChar, speed);
    } else {
      cr.style.display='flex';
      bt.style.display='inline'; bs.style.display='none';
    }
  }
  // Small delay so the "Generating…" message is visible briefly
  setTimeout(() => {
    bt.style.display='inline'; bs.style.display='none';
    typeChar();
  }, 600);
}

/* ═══════════════════════════════
   HAMBURGER MENU
═══════════════════════════════ */
(function(){
  const btn     = document.getElementById('hamburger');
  const drawer  = document.getElementById('mob-drawer');
  const overlay = document.getElementById('mob-overlay');

  function open(){
    btn.classList.add('open');
    btn.setAttribute('aria-expanded','true');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => btn.classList.contains('open') ? close() : open());
  overlay.addEventListener('click', close);

  // Mobile drawer nav links
  document.querySelectorAll('.mob-link').forEach(a => {
    a.addEventListener('click', () => {
      const target = document.getElementById(a.dataset.target);
      close();
      if(target){
        setTimeout(() => {
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }, 380); // wait for drawer close animation
      }
    });
  });

  // Mobile CTA
  const mobCta = document.querySelector('.mob-cta');
  if(mobCta) mobCta.addEventListener('click', () => { close(); setTimeout(focusStrategyCall, 400); });
})();

function copyCopy(){
  const text = document.getElementById('out-box').textContent;
  navigator.clipboard.writeText(text).then(()=>{
    const b = document.querySelector('.copy-btn');
    b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
    setTimeout(()=>{ b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy text'; }, 2000);
  });
}

/* ═══════════════════════════════
   MOBILE TAP-THROUGH FIX
   Ensures background layers (Three.js canvas, SVG beams, glows)
   never intercept taps on interactive elements (WhatsApp float,
   nav, CTAs, hamburger, drawer) — common cause of "nothing is
   clickable on mobile" when stacking contexts shift.
═══════════════════════════════ */
(function(){
  const bg = document.getElementById('three-bg');
  const beams = document.getElementById('svg-beams');
  if(bg) bg.style.pointerEvents = 'none';
  if(beams) beams.style.pointerEvents = 'none';

  const interactiveSelectors = [
    '.whatsapp-float', '#navbar', '.mob-drawer', '.mob-overlay',
    '#hamburger', '.hero-btns', '.cta-btn-link', '.nav-cta-link'
  ];
  interactiveSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.style.pointerEvents = 'auto';
      el.style.position = el.style.position || 'relative';
      el.style.zIndex = el.style.zIndex || '50';
    });
  });
})();

/* ═══════════════════════════════
   PAGE LOADER
═══════════════════════════════ */
(function(){
  if(!loader) return;
  // Trigger letter animation
  loader.querySelectorAll('.loader-text span').forEach((span, i) => {
    span.style.animationDelay = (i * 0.08) + 's';
  });
  // Hide loader after animation completes
  window.addEventListener('load', function(){
    setTimeout(function(){
      loader.classList.add('loader-done');
    }, 1400);
  });
  // Fallback: hide after 3s regardless
  setTimeout(function(){
    loader.classList.add('loader-done');
  }, 3000);
})();
