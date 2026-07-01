// ── HARDWARE & CAPABILITY DETECTION ──
function getDeviceTier() {
  const isMobileScreen = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Safely check hardware specs if browser supports it
  const cores = navigator.hardwareConcurrency || 4; // Defaults to 4 if unsupported
  // Note: navigator.deviceMemory is mainly Chrome/Edge
  const memory = navigator.deviceMemory || 4; 
  
  // If it's a mobile screen, has < 4 cores, < 4GB RAM, or user wants reduced motion
  if (isMobileScreen || prefersReducedMotion || cores < 4 || memory < 4) {
    return 'low-tier';
  }
  return 'high-tier';
}

const deviceTier = getDeviceTier();
const isMobile = window.innerWidth < 768;

/* ── Lenis Smooth Scrolling (Awwwards-style weight) ── */
let lenis = null;
if (!isMobile) {
  lenis = new Lenis({
    lerp: deviceTier === 'low-tier' ? 0.1 : 0.06,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    smoothTouch: false,
    infinite: false,
  });
  window.lenis = lenis;
  // Merge both scroll listeners into one callback
  lenis.on('scroll', (e) => {
    window.__lenisScroll = e.animatedScroll || e.scroll || window.scrollY;
    ScrollTrigger.update();
  });
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
}
gsap.ticker.lagSmoothing(0);
// Cap at 60fps for all devices to ensure smooth animations
gsap.ticker.fps(60);

// Prevent mobile scroll glitches when address bar hides/shows
ScrollTrigger.config({ ignoreMobileResize: true });

/* ═══════════════════════════════
   THREE.JS BACKGROUND SCENE
═══════════════════════════════ */
function initThree(){
  // Completely skip heavy 3D WebGL rendering on low-tier hardware or mobile
  if(isMobile || deviceTier === 'low-tier') return;
  try {
    const test = document.createElement('canvas').getContext('webgl');
    if(!test) return;
  } catch(e){ return; }

  (function(){
  const container = document.getElementById('three-bg');
  if(!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 500;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // ── INTERACTIVE TOPOGRAPHIC GRID ──
  const cols = 28;
  const rows = 18;
  const spacingX = 45;
  const spacingY = 40;
  const gridWidth = (cols - 1) * spacingX;
  const gridHeight = (rows - 1) * spacingY;

  // We will keep an array of base vertex positions to calculate animations
  const baseVertices = [];
  for(let j = 0; j < rows; j++){
    for(let i = 0; i < cols; i++){
      const x = i * spacingX - gridWidth / 2;
      const y = j * spacingY - gridHeight / 2;
      baseVertices.push({ x, y, ox: x, oy: y });
    }
  }

  // Define line segments geometry
  const numLines = (cols - 1) * rows + cols * (rows - 1);
  const lineGeo = new THREE.BufferGeometry();
  const linePositions = new Float32Array(numLines * 2 * 3);
  const lineColors = new Float32Array(numLines * 2 * 3);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

  const lineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.22,
    linewidth: 1
  });
  const gridLines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(gridLines);

  // Define glowing nodes (Points) at intersections
  const pointGeo = new THREE.BufferGeometry();
  const pointPositions = new Float32Array(cols * rows * 3);
  const pointColors = new Float32Array(cols * rows * 3);
  pointGeo.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
  pointGeo.setAttribute('color', new THREE.BufferAttribute(pointColors, 3));

  // Custom canvas texture for glowing particles
  function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    return new THREE.CanvasTexture(canvas);
  }

  const pointMat = new THREE.PointsMaterial({
    size: 5.5,
    map: createCircleTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const gridPoints = new THREE.Points(pointGeo, pointMat);
  scene.add(gridPoints);

  // ── MOUSE AND INTERACTION STATE ──
  let mouseX = 0, mouseY = 0;
  const mouse3D = new THREE.Vector3(0, 0, 0);
  const targetMouse3D = new THREE.Vector3(0, 0, 0);
  let isHovered = false;

  document.addEventListener('mousemove', e => {
    isHovered = true;
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  document.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  // Colors — pre-allocated OUTSIDE the loop to avoid GC churn every frame
  const colorBlue = new THREE.Color(0x4F7CFF);
  const colorGold = new THREE.Color(0xFFB547);
  const colorDark = new THREE.Color(0x0F1A33);
  const localColor = new THREE.Color(); // reused per vertex, never re-allocated

  // ── RESIZE — debounced so it doesn't fire on every pixel ──
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 150);
  });

  let time = 0;
  // Pause Three.js when tab is hidden — saves GPU/CPU
  // Use restartLoop IIFE for proper cancelAnimationFrame support
  (function restartLoop(){
    let afId;
    function loop(){
      afId = requestAnimationFrame(loop);
      time += 0.008;

      const aspect = window.innerWidth / window.innerHeight;
      const vWidth = 500 * aspect;
      const vHeight = 500;
      if (isHovered) {
        targetMouse3D.set(mouseX * vWidth * 0.65, -mouseY * vHeight * 0.6, 0);
      } else {
        targetMouse3D.set(Math.sin(time * 0.5) * 120, Math.cos(time * 0.3) * 80, 0);
      }
      mouse3D.lerp(targetMouse3D, 0.06);

      const vertices = [];
      const maxDist = 220;
      for(let j = 0; j < rows; j++){
        for(let i = 0; i < cols; i++){
          const idx = j * cols + i;
          const base = baseVertices[idx];
          let x = base.ox, y = base.oy;
          let z = Math.sin(x * 0.003 + time * 1.2) * Math.cos(y * 0.0035 + time * 1.0) * 45
                + Math.sin(x * 0.008 - time * 1.5) * 12;
          const dx = x - mouse3D.x, dy = y - mouse3D.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          localColor.copy(colorBlue);
          if(dist < maxDist){
            const force = (1 - dist / maxDist);
            z += force * force * 110;
            x += (dx / (dist + 0.1)) * force * 22;
            y += (dy / (dist + 0.1)) * force * 22;
            localColor.lerp(colorGold, force * 0.95);
          } else {
            const edgeDist = Math.sqrt(x*x + y*y);
            const maxEdge = Math.sqrt(gridWidth*gridWidth + gridHeight*gridHeight) * 0.5;
            localColor.lerp(colorDark, Math.min(edgeDist / maxEdge, 1) * 0.6);
          }
          vertices.push({ x, y, z, color: { r: localColor.r, g: localColor.g, b: localColor.b } });
          pointPositions[idx*3]=x; pointPositions[idx*3+1]=y; pointPositions[idx*3+2]=z;
          pointColors[idx*3]=localColor.r; pointColors[idx*3+1]=localColor.g; pointColors[idx*3+2]=localColor.b;
        }
      }
      pointGeo.attributes.position.needsUpdate = true;
      pointGeo.attributes.color.needsUpdate = true;

      let lineIdx = 0;
      for(let j = 0; j < rows; j++){
        for(let i = 0; i < cols; i++){
          const idx = j * cols + i;
          const pA = vertices[idx];
          if(i < cols - 1){
            const pB = vertices[idx + 1];
            linePositions[lineIdx*3]=pA.x; linePositions[lineIdx*3+1]=pA.y; linePositions[lineIdx*3+2]=pA.z;
            lineColors[lineIdx*3]=pA.color.r; lineColors[lineIdx*3+1]=pA.color.g; lineColors[lineIdx*3+2]=pA.color.b;
            lineIdx++;
            linePositions[lineIdx*3]=pB.x; linePositions[lineIdx*3+1]=pB.y; linePositions[lineIdx*3+2]=pB.z;
            lineColors[lineIdx*3]=pB.color.r; lineColors[lineIdx*3+1]=pB.color.g; lineColors[lineIdx*3+2]=pB.color.b;
            lineIdx++;
          }
          if(j < rows - 1){
            const pC = vertices[idx + cols];
            linePositions[lineIdx*3]=pA.x; linePositions[lineIdx*3+1]=pA.y; linePositions[lineIdx*3+2]=pA.z;
            lineColors[lineIdx*3]=pA.color.r; lineColors[lineIdx*3+1]=pA.color.g; lineColors[lineIdx*3+2]=pA.color.b;
            lineIdx++;
            linePositions[lineIdx*3]=pC.x; linePositions[lineIdx*3+1]=pC.y; linePositions[lineIdx*3+2]=pC.z;
            lineColors[lineIdx*3]=pC.color.r; lineColors[lineIdx*3+1]=pC.color.g; lineColors[lineIdx*3+2]=pC.color.b;
            lineIdx++;
          }
        }
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;

      gridLines.rotation.y = Math.sin(time * 0.15) * 0.08;
      gridLines.rotation.x = -0.3 + Math.cos(time * 0.1) * 0.05;
      gridPoints.rotation.copy(gridLines.rotation);
      camera.position.z = 500 - (window.__lenisScroll || 0) * 0.12;
      renderer.render(scene, camera);
    }
    loop();
    // Pause when tab is hidden — significant GPU/battery saving
    document.addEventListener('visibilitychange', () => {
      if(document.hidden) { cancelAnimationFrame(afId); }
      else { loop(); }
    });
  })(); // end restartLoop IIFE

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
  if(isMobile) return;
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

// Hero entrance animations moved to native CSS for faster LCP

// Scroll reveals
gsap.utils.toArray('.reveal').forEach(el => {
  gsap.to(el, {
    opacity:1, y:0,
    duration:0.65, ease:'power2.out',
    scrollTrigger:{ trigger:el, start:'top 90%', toggleActions:'play none none none' }
  });
});

gsap.utils.toArray('.niche-card').forEach((el, i) => {
  gsap.to(el, {
    opacity:1, y:0, scale:1,
    // ...(isMobile ? {} : { filter:'blur(0px)' }), // REMOVED: Caused massive GPU lag on scroll
    duration:.9, ease:'power3.out',
    delay: isMobile ? 0 : i * 0.12,
    scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none none' }
  });
});

gsap.utils.toArray('.proof-card').forEach((el, i) => {
  gsap.to(el, {
    opacity:1, y:0, scale:1,
    // ...(isMobile ? {} : { filter:'blur(0px)' }), // REMOVED: Caused massive GPU lag on scroll
    duration:.85, ease:'power3.out',
    delay: isMobile ? 0 : i * 0.1,
    scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none none' }
  });
});

gsap.utils.toArray('.srv').forEach((el, i) => {
  gsap.to(el, {
    opacity:1, y:0,
    // ...(isMobile ? {} : { filter:'blur(0px)' }), // REMOVED: Caused massive GPU lag on scroll
    duration:.75, ease:'power3.out',
    delay: isMobile ? 0 : i * 0.08,
    scrollTrigger:{ trigger:el, start:'top 90%', toggleActions:'play none none none' }
  });
});

gsap.to('.tool-outer', {
  opacity:1, y:0, duration:.9, ease:'power3.out',
  scrollTrigger:{ trigger:'.tool-outer', start:'top 88%', toggleActions:'play none none none' }
});

if (!isMobile) {
  // Parallax
  gsap.to('.hero-glow', {
    y: 60, scale: 1.1, ease:'none',
    scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub: 1.2 }
  });

  gsap.to('.hero-glow2', {
    y: 35, scale: 1.12, ease:'none',
    scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub: 1.4 }
  });


}

// ── Smooth nav background
// Nav background on scroll (native)
(function(){
  const nav = document.getElementById('navbar');
  const progress = document.getElementById('scroll-progress');
  let ticking = false;
  function updateNav(){
    // READ phase
    const s = window.scrollY;
    let maxScroll = 0;
    if(progress){
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    }
    
    // WRITE phase
    if(s > 60){
      nav.style.background = 'rgba(0,0,0,0.95)';
      nav.style.boxShadow = '0 1px 0 rgba(255,255,255,0.05)';
    } else {
      nav.style.background = 'rgba(0,0,0,0.7)';
      nav.style.boxShadow = 'none';
    }
    if(progress){
      const pct = maxScroll > 0 ? (s / maxScroll) * 100 : 0;
      progress.style.width = pct + '%';
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });
})();

// ── Nav link smooth scroll
document.querySelectorAll('a[href*="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const url = new URL(a.href, window.location.origin);
    if (!url.hash) return;
    
    // If not the same page, let browser navigate naturally
    const currentPath = window.location.pathname;
    const linkPath = url.pathname;
    if (linkPath !== currentPath && linkPath !== currentPath.replace(/\/$/, '') && linkPath !== currentPath + '/') {
      return; 
    }

    const targetId = url.hash.substring(1);
    const target = document.getElementById(targetId);
    if(target){
      e.preventDefault();
      if(typeof lenis !== 'undefined' && lenis) {
        lenis.scrollTo(target, { offset: -80 });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    }
  });
});

// Handle hash on page load for smooth scrolling libraries
document.addEventListener('DOMContentLoaded', () => {
  // PWA Navbar Smart Scroll Logic
  let lastScrollY = window.scrollY;
  const navbar = document.getElementById('navbar');
  
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    // Don't hide navbar at the very top
    if (window.scrollY <= 50) {
      navbar.classList.remove('nav-hidden');
    } else if (window.scrollY > lastScrollY) {
      // Scrolling down
      navbar.classList.add('nav-hidden');
    } else {
      // Scrolling up
      navbar.classList.remove('nav-hidden');
    }
    lastScrollY = window.scrollY;
  }, { passive: true });

  if (window.location.hash) {
    const target = document.getElementById(window.location.hash.substring(1));
    if (target) {
      setTimeout(() => {
        if(typeof lenis !== 'undefined' && lenis) {
          lenis.scrollTo(target, { offset: -80, immediate: true });
        } else {
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
        }
      }, 300);
    }
  }
});

function focusStrategyCall(){
  const target = document.getElementById('cta-inner');
  if(!target) return;
  if(typeof lenis !== 'undefined' && lenis) {
    lenis.scrollTo(target, { offset: -80 });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }
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
  document.getElementById('re-fields').style.display     = tab === 're'          ? 'block' : 'none';
  document.getElementById('saas-fields').style.display   = tab === 'saas'        ? 'block' : 'none';
  document.getElementById('imgstudio-fields').style.display = tab === 'imgstudio' ? 'block' : 'none';
  const copyGenBtn = document.getElementById('copy-gen-btn');
  if(copyGenBtn) copyGenBtn.style.display = (tab === 'imgstudio') ? 'none' : 'flex';
  const outCols = document.getElementById('out-cols');
  if(outCols && tab === 'imgstudio') outCols.style.display = 'none';
  if(tab !== 'imgstudio'){
    document.getElementById('out-box').style.display  = 'none';
    document.getElementById('copy-row').style.display = 'none';
    const mockup = document.getElementById('creative-mockup');
    const mockupImg = document.getElementById('mockup-img');
    if(mockup) {
      if(tab === 're') {
        mockup.classList.remove('saas-creative-theme');
        if(mockupImg) mockupImg.src = '/assets/real_estate_creative.png';
      } else if(tab === 'saas') {
        mockup.classList.add('saas-creative-theme');
        if(mockupImg) mockupImg.src = '/assets/saas_creative.png';
      }
    }
  }
  if(tab === 'imgstudio' && !document.getElementById('img-prompt-textarea').value){
    rebuildImgPrompt();
  }
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
  const outCols = document.getElementById('out-cols');
  
  const mockup = document.getElementById('creative-mockup');
  const mockupImg = document.getElementById('mockup-img');
  const mockupTitleHeader = document.getElementById('mockup-title-header');
  const mockupEyebrow = document.getElementById('mockup-eyebrow');
  const mockupHeadline = document.getElementById('mockup-headline');
  const mockupText = document.getElementById('mockup-text');
  const mockupCtaText = document.getElementById('mockup-cta-text');

  bt.style.display='none'; bs.style.display='inline-block';
  outCols.style.display='flex';
  ob.style.display='block'; ob.className='out-box loading';
  ob.textContent='Generating copy using Gomza\'s CRO framework…';
  cr.style.display='none';
  
  if(mockup) {
    mockup.style.opacity = '0';
    mockup.classList.add('mockup-loading');
  }

  // ── Helper: silently load an AI image in background, then swap
  function loadAIImageInBackground(aiUrl, fallbackSrc) {
    // Show local asset immediately — never a black box
    if(mockupImg) {
      mockupImg.src = fallbackSrc;
      mockupImg.style.opacity = '1';
    }
    // Reveal the whole mockup right away
    if(mockup) {
      mockup.classList.remove('mockup-loading');
      mockup.style.opacity = '1';
      if(typeof gsap !== 'undefined') {
        gsap.fromTo(mockup, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' });
      }
    }
    // Load AI image in background
    const bgImg = new Image();
    let swapped = false;
    const swapFn = () => {
      if(swapped || !mockupImg) return;
      swapped = true;
      mockupImg.style.transition = 'opacity 0.5s ease';
      mockupImg.style.opacity = '0';
      setTimeout(() => {
        mockupImg.src = bgImg.src;
        mockupImg.style.opacity = '1';
      }, 500);
    };
    bgImg.onload  = swapFn;
    bgImg.onerror = () => { /* keep local image, do nothing */ };
    bgImg.src = aiUrl;
    // Fallback: if image doesn't load in 20s, keep local
    setTimeout(() => { if(!swapped) swapped = true; }, 20000);
  }

  let prompt = '';
  let pendingAiUrl = '';
  let pendingFallback = '';

  if(currentTab === 're'){
    const type = document.getElementById('re-type').value;
    const audience = document.getElementById('re-audience').value;
    const offer = document.getElementById('re-offer').value || 'premium properties';
    const content = document.getElementById('re-content').value;
    prompt = buildRealEstateCopy(type, audience, offer, content);

    // Setup Real Estate mockup details
    if(mockup) {
      mockup.classList.remove('saas-creative-theme');
      if(mockupTitleHeader) mockupTitleHeader.textContent = 'Real Estate Ad Visual';
      if(mockupEyebrow)    mockupEyebrow.textContent    = `${type}`;
      if(mockupHeadline)   mockupHeadline.textContent   = `${offer}`;
      if(mockupText)       mockupText.textContent       = `High-converting positioning for ${audience.toLowerCase()} — structured using Gomza's CRO framework.`;
      if(mockupCtaText)    mockupCtaText.textContent    = content.includes('email') ? 'Contact Agent' : 'Learn More';

      const reSeed = Math.floor(Math.random() * 9999999) + 1;
      const aiPrompt = `luxury real estate property exterior, ${offer}, golden hour photography, modern architecture, sharp professional photo`;
      pendingAiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiPrompt)}?width=600&height=400&seed=${reSeed}&nologo=true`;
      pendingFallback = '/assets/real_estate_creative.png';
      
      // Set to fallback image immediately with loading class
      if(mockupImg) {
        mockupImg.src = pendingFallback;
        mockupImg.style.opacity = '1';
      }
      mockup.classList.add('mockup-loading');
      mockup.style.opacity = '1';
    }
  } else {
    const product = document.getElementById('saas-product').value || 'a productivity SaaS tool';
    const icp     = document.getElementById('saas-icp').value     || 'B2B founders';
    const problem = document.getElementById('saas-problem').value || 'teams waste hours on manual work';
    const content = document.getElementById('saas-content').value;
    prompt = buildSaasCopy(product, icp, problem, content);

    // Setup SaaS mockup details
    if(mockup) {
      mockup.classList.add('saas-creative-theme');
      if(mockupTitleHeader) mockupTitleHeader.textContent = 'SaaS Creative Preview';
      if(mockupEyebrow)    mockupEyebrow.textContent    = `Campaign for ${icp}`;
      if(mockupHeadline)   mockupHeadline.textContent   = `${product}`;
      if(mockupText)       mockupText.textContent       = `Optimized user-acquisition design built to solve conversion friction in the funnel.`;
      if(mockupCtaText)    mockupCtaText.textContent    = content.includes('email') ? 'Book Demo' : 'Launch App';

      const saasSeed = Math.floor(Math.random() * 9999999) + 1;
      const aiPrompt = `modern software dashboard interface for ${product}, neon blue and purple accents, clean minimalist tech branding, high tech illustration, detailed UI vector`;
      pendingAiUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiPrompt)}?width=600&height=400&seed=${saasSeed}&nologo=true`;
      pendingFallback = '/assets/saas_creative.png';
      
      // Set to fallback image immediately with loading class
      if(mockupImg) {
        mockupImg.src = pendingFallback;
        mockupImg.style.opacity = '1';
      }
      mockup.classList.add('mockup-loading');
      mockup.style.opacity = '1';
    }
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
      typingDone = true;
      checkReveal();
      
      // Trigger AI image load after the copywriting has completely rendered
      if(pendingAiUrl && pendingFallback) {
        loadAIImageInBackground(pendingAiUrl, pendingFallback);
      }
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
    a.addEventListener('click', (e) => {
      const url = new URL(a.href, window.location.origin);
      if (!url.hash) {
        close();
        return;
      }
      
      const targetId = url.hash.substring(1);
      const target = document.getElementById(targetId);
      
      const currentPath = window.location.pathname;
      const linkPath = url.pathname;
      if (linkPath !== currentPath && linkPath !== currentPath.replace(/\/$/, '') && linkPath !== currentPath + '/') {
         // Different page. Close drawer and let browser navigate.
         close();
         return;
      }
      
      if(target){
        e.preventDefault();
        close();
        setTimeout(() => {
          if(typeof lenis !== 'undefined' && lenis) {
            lenis.scrollTo(target, { offset: -80 });
          } else {
            const top = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
          }
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
   AI IMAGE STUDIO
═══════════════════════════════ */
const IMG_INDUSTRY_DATA = {
  real_estate: {
    label: '🏠 Real Estate',
    color: '#FFB547',
    subjects: ['luxury villa', 'modern apartment', 'commercial office', 'gated community'],
    prompts: (s, a, style, mood) =>
      `${mood} ${style} photography of ${s||'luxury real estate property'}, premium architectural exterior, golden hour lighting, ultra-detailed, award-winning real estate photo, for ${a||'high-net-worth buyers'}, 8K resolution`
  },
  saas: {
    label: '💻 SaaS / Tech',
    color: '#29D3FF',
    subjects: ['dashboard interface', 'analytics platform', 'AI workflow tool', 'CRM software'],
    prompts: (s, a, style, mood) =>
      `${mood} ${style} graphic of ${s||'modern SaaS dashboard'}, glowing UI components, data visualization, deep space gradient background, neon cyan and electric blue, for ${a||'B2B decision makers'}, ultra-sharp digital art`
  },
  ecommerce: {
    label: '🛒 E-Commerce',
    color: '#FF6B8B',
    subjects: ['product showcase', 'fashion collection', 'electronics', 'lifestyle product'],
    prompts: (s, a, style, mood) =>
      `${mood} ${style} product photography of ${s||'premium ecommerce product'}, studio lighting, white marble surface, minimalist composition, for ${a||'online shoppers'}, commercial ad quality, 4K`
  },
  healthcare: {
    label: '🏥 Healthcare',
    color: '#4ADE80',
    subjects: ['medical clinic', 'wellness app', 'health service', 'telemedicine platform'],
    prompts: (s, a, style, mood) =>
      `${mood} ${style} visual of ${s||'modern healthcare service'}, clean clinical environment, soft blue-green tones, trust-building composition, for ${a||'patients and caregivers'}, professional medical imagery`
  },
  finance: {
    label: '💰 Finance',
    color: '#A78BFA',
    subjects: ['investment platform', 'digital banking app', 'wealth management', 'fintech dashboard'],
    prompts: (s, a, style, mood) =>
      `${mood} ${style} image of ${s||'modern fintech platform'}, stock market data visualization, gold and deep navy palette, wealth symbolism, for ${a||'investors and HNIs'}, premium financial brand aesthetic`
  },
  hospitality: {
    label: '🏨 Hospitality',
    color: '#FB923C',
    subjects: ['luxury hotel lobby', 'resort pool', 'fine dining restaurant', 'boutique hotel room'],
    prompts: (s, a, style, mood) =>
      `${mood} ${style} photography of ${s||'luxury hotel and resort'}, opulent interior design, warm ambient lighting, marble and gold accents, for ${a||'premium travelers'}, travel magazine quality, cinematic depth`
  }
};

const IMG_RATIO_MAP = {
  landscape: { w: 960,  h: 540 },
  square:    { w: 768,  h: 768 },
  portrait:  { w: 640,  h: 800 },
  banner:    { w: 960,  h: 320 }
};

let imgState = {
  industry: 'real_estate',
  style: 'photorealistic',
  mood: 'premium luxury',
  ratio: 'landscape'
};

let currentImgUrl = '';

function selectIndustry(btn, industry){
  document.querySelectorAll('.industry-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  imgState.industry = industry;
  const data = IMG_INDUSTRY_DATA[industry];
  // Tint the active chip with industry color
  btn.style.setProperty('--ind-color', data.color);
  rebuildImgPrompt();
}

function selectCtrl(btn, type){
  const groupId = `img-${type}-group`;
  document.querySelectorAll(`#${groupId} .img-ctrl-chip`).forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  imgState[type] = btn.dataset.val;
  rebuildImgPrompt();
}

function rebuildImgPrompt(){
  const data = IMG_INDUSTRY_DATA[imgState.industry];
  if(!data) return;
  const subject  = (document.getElementById('img-subject')  || {}).value || '';
  const audience = (document.getElementById('img-audience') || {}).value || '';
  const built = data.prompts(subject, audience, imgState.style, imgState.mood);
  const ta = document.getElementById('img-prompt-textarea');
  if(ta) ta.value = built;
}

// Auto-rebuild prompt when inputs change
setTimeout(() => {
  const subjectEl  = document.getElementById('img-subject');
  const audienceEl = document.getElementById('img-audience');
  if(subjectEl)  subjectEl.addEventListener('input',  debounce(rebuildImgPrompt, 400));
  if(audienceEl) audienceEl.addEventListener('input', debounce(rebuildImgPrompt, 400));
  // Initial build
  rebuildImgPrompt();
}, 200);

function debounce(fn, ms){
  let t;
  return function(...args){
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), ms);
  };
}

async function generateAIImage(){
  const prompt = (document.getElementById('img-prompt-textarea') || {}).value;
  if(!prompt || !prompt.trim()) { rebuildImgPrompt(); return; }

  const genBtn    = document.getElementById('img-gen-btn');
  const btnText   = document.getElementById('img-btn-text');
  const btnSpin   = document.getElementById('img-btn-spin');
  const previewArea = document.getElementById('img-preview-area');
  const skeleton  = document.getElementById('img-gen-skeleton');
  const imgEl     = document.getElementById('ai-generated-img');
  const metaEl    = document.getElementById('img-preview-meta');
  const metaInd   = document.getElementById('img-meta-industry');
  const metaPro   = document.getElementById('img-meta-prompt');
  const labelEl   = document.getElementById('img-preview-label');

  // Show loading state
  if(btnText) btnText.style.display = 'none';
  if(btnSpin) btnSpin.style.display = 'inline-block';
  if(genBtn)  genBtn.disabled = true;

  previewArea.style.display = 'block';
  skeleton.style.display = 'flex';
  if(imgEl)  { imgEl.style.display = 'none'; imgEl.src = ''; }
  if(metaEl) metaEl.style.display = 'none';

  // Scroll preview into view
  previewArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  const { w, h } = IMG_RATIO_MAP[imgState.ratio] || IMG_RATIO_MAP.landscape;
  const seed = Math.floor(Math.random() * 9999999) + 1;
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${w}&height=${h}&seed=${seed}&nologo=true`;
  currentImgUrl = url;

  const data = IMG_INDUSTRY_DATA[imgState.industry];

  imgEl.onload = () => {
    skeleton.style.display = 'none';
    imgEl.style.display = 'block';
    if(metaEl) {
      metaEl.style.display = 'flex';
      metaInd.textContent = data ? data.label : imgState.industry;
      metaPro.textContent = prompt.length > 120 ? prompt.slice(0, 120) + '…' : prompt;
    }
    if(labelEl) labelEl.textContent = `${data ? data.label : 'AI'} — ${imgState.style} · ${imgState.mood}`;
    // Animate in
    imgEl.style.opacity = '0';
    imgEl.style.transform = 'scale(0.97) translateY(8px)';
    imgEl.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    requestAnimationFrame(() => {
      imgEl.style.opacity = '1';
      imgEl.style.transform = 'scale(1) translateY(0)';
    });
    // Restore button
    if(btnText) btnText.style.display = 'inline-flex';
    if(btnSpin) btnSpin.style.display = 'none';
    if(genBtn)  genBtn.disabled = false;
  };

  imgEl.onerror = () => {
    skeleton.style.display = 'none';
    skeleton.innerHTML = `<div class="skeleton-text" style="color:#FF6B8B">⚠️ Generation failed — try again</div>`;
    if(btnText) btnText.style.display = 'inline-flex';
    if(btnSpin) btnSpin.style.display = 'none';
    if(genBtn)  genBtn.disabled = false;
  };

  imgEl.src = url;
}

function downloadAIImage(){
  if(!currentImgUrl) return;
  const a = document.createElement('a');
  a.href = currentImgUrl;
  a.download = `gomza-ai-creative-${Date.now()}.jpg`;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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
    '.whatsapp-float', '#navbar',
    '#hamburger', '.hero-btns', '.cta-btn-link', '.nav-cta-link'
  ];
  interactiveSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.style.pointerEvents = 'auto';
      const computedPos = window.getComputedStyle(el).position;
      if (computedPos === 'static') {
        el.style.position = 'relative';
      }
      const computedZ = window.getComputedStyle(el).zIndex;
      if (computedZ === 'auto') {
        el.style.zIndex = '50';
      }
    });
  });
})();


/* ═══════════════════════════════
   CUSTOM CURSOR (SEE PROJECT)
═══════════════════════════════ */
(function(){
  if(isMobile) return;
  const cursor = document.getElementById('custom-cursor');
  if(!cursor) return;

  const phrases = ["I am Gomza", "I build brands", "I drive growth", "I run ads", "I write copy"];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeCursor() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      cursor.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      cursor.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 30 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 1500; 
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400; 
    }

    setTimeout(typeCursor, typeSpeed);
  }
  
  typeCursor();

  // Track mouse and cursor coordinates
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Lerp loop for buttery smoothness
  function renderCursor() {
    // 0.15 is the easing amount. Lower = slower/more trailing.
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    // 42.5px offset to perfectly center the 85x85px cursor
    cursor.style.transform = `translate3d(${cursorX - 42.5}px, ${cursorY - 42.5}px, 0)`;
    
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Activate on hover over main sections
  // Add more selectors here as needed for other "main sections"
  const hoverTargets = document.querySelectorAll('.niche-card, .srv, .proof-card, .mockup-img-wrap');
  hoverTargets.forEach(target => {
    target.style.cursor = 'none'; // hide default cursor when hovering these
    target.addEventListener('mouseenter', () => cursor.classList.add('active'));
    target.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });

  // Giant text spotlight
  const giantText = document.getElementById('giant-text');
  if(giantText) {
    document.addEventListener('mousemove', (e) => {
      const rect = giantText.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      giantText.style.setProperty('--mx', `${x}px`);
      giantText.style.setProperty('--my', `${y}px`);
    });
  }
  // Magnetic Buttons
  const magneticButtons = document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta, .gen-btn, .copy-btn, .cro-glass');
  
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.4,
        ease: "power2.out"
      });
    });
    
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });
})();


/* ── THEME TOGGLE ── */
(function(){
  const themeBtn = document.getElementById('theme-toggle');
  if(themeBtn) {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
      document.body.classList.add('light-mode');
    }
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
      localStorage.setItem('theme', theme);
    });
  }
})();

/* ── VANILLA TILT INIT (moved from Layout.astro inline script) ── */
if (typeof VanillaTilt !== 'undefined' && window.innerWidth >= 768) {
  VanillaTilt.init(document.querySelectorAll(".btn-primary, .btn-ghost, .nav-cta, .gen-btn"), {
    max: 15,
    speed: 400,
    scale: 1.05
  });
} else {
  // Defer init until VanillaTilt is loaded
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof VanillaTilt !== 'undefined' && window.innerWidth >= 768) {
      VanillaTilt.init(document.querySelectorAll(".btn-primary, .btn-ghost, .nav-cta, .gen-btn"), {
        max: 15, speed: 400, scale: 1.05
      });
    }
  });
}

/* ── LAZY BACKGROUND IMAGE LOADER (for location cards & data-bg elements) ── */
(function(){
  if (!('IntersectionObserver' in window)) return;
  const lazyBgs = document.querySelectorAll('[data-bg]');
  if (!lazyBgs.length) return;
  const bgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.backgroundImage = `url('${el.dataset.bg}')`;
        bgObserver.unobserve(el);
      }
    });
  }, { rootMargin: '200px 0px' }); // Start loading 200px before visible
  lazyBgs.forEach(el => bgObserver.observe(el));
})();
