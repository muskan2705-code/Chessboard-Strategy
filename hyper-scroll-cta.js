(function () {
  const section = document.getElementById('hyperScrollCta');
  const world = document.getElementById('hyperWorld');
  const viewport = document.getElementById('hyperViewport');
  const proxy = section?.querySelector('.hyper-scroll-proxy');
  const fpsEl = document.getElementById('hyperFps');
  const velEl = document.getElementById('hyperVel');
  const coordEl = document.getElementById('hyperCoord');

  if (!section || !world || !viewport || !proxy) return;

  const CONFIG = {
    itemCount: 14,
    starCount: 40,
    zGap: 620,
    camSpeed: 2.05
  };
  CONFIG.loopSize = CONFIG.itemCount * CONFIG.zGap;

  const TEXTS = ['IMPACT', 'PROCESS', 'SYSTEM', 'GROWTH', 'SCALE', 'STRATEGY', 'BIZZ', 'BUILD'];
  const state = { scroll: 0, velocity: 0, targetSpeed: 0, mouseX: 0, mouseY: 0 };
  const items = [];
  let lastScroll = 0;
  let lastFrameTime = performance.now();

  function sectionScrollY() {
    const top = section.offsetTop;
    const start = top;
    const end = top + proxy.offsetHeight - window.innerHeight;
    const y = window.scrollY || window.pageYOffset;
    if (y < start) return 0;
    if (y > end) return end - start;
    return y - start;
  }

  function init() {
    for (let i = 0; i < CONFIG.itemCount; i++) {
      const el = document.createElement('div');
      el.className = 'hyper-item';

      const isHeading = i % 2 === 0;
      if (isHeading) {
        const txt = document.createElement('div');
        txt.className = 'hyper-big-text';
        txt.textContent = TEXTS[i % TEXTS.length];
        el.appendChild(txt);
        items.push({ el, type: 'text', x: 0, y: 0, rot: 0, baseZ: -i * CONFIG.zGap });
      } else {
        const card = document.createElement('div');
        card.className = 'hyper-card';
        const randId = Math.floor(Math.random() * 9999);
        card.innerHTML = `
          <div class="hyper-card-header">
            <span class="hyper-card-id">ID-${randId}</span>
            <div style="width:8px;height:8px;background:var(--accent);"></div>
          </div>
          <h3>${TEXTS[i % TEXTS.length]}</h3>
          <div class="hyper-card-footer">
            <span>GRID: ${Math.floor(Math.random() * 10)}x${Math.floor(Math.random() * 10)}</span>
            <span>DATA: ${(Math.random() * 100).toFixed(1)}MB</span>
          </div>
        `;
        el.appendChild(card);

        const angle = (i / CONFIG.itemCount) * Math.PI * 4;
        const x = Math.cos(angle) * (window.innerWidth * 0.17);
        const y = Math.sin(angle) * (window.innerHeight * 0.14);
        const rot = (Math.random() - 0.5) * 12;
        items.push({ el, type: 'card', x, y, rot, baseZ: -i * CONFIG.zGap });
      }
      world.appendChild(el);
    }

    for (let i = 0; i < CONFIG.starCount; i++) {
      const el = document.createElement('div');
      el.className = 'hyper-star';
      world.appendChild(el);
      items.push({
        el,
        type: 'star',
        x: (Math.random() - 0.5) * 1800,
        y: (Math.random() - 0.5) * 1200,
        baseZ: -Math.random() * CONFIG.loopSize
      });
    }

    window.addEventListener('mousemove', (e) => {
      state.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      state.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  function updateScrollState(now) {
    const current = sectionScrollY();
    const dt = Math.max(1, now - lastFrameTime) / 1000;
    const rawVel = (current - lastScroll) / dt;
    state.scroll = current;
    state.targetSpeed = rawVel * 0.0035;
    state.velocity += (state.targetSpeed - state.velocity) * 0.08;
    lastScroll = current;
  }

  function render(now) {
    const delta = Math.max(1, now - lastFrameTime);
    lastFrameTime = now;
    updateScrollState(now);

    if (fpsEl && now % 12 < 1) fpsEl.textContent = String(Math.round(1000 / delta));
    if (velEl) velEl.textContent = Math.abs(state.velocity).toFixed(2);
    if (coordEl) coordEl.textContent = state.scroll.toFixed(0);

    const tiltX = state.mouseY * 1.2 - state.velocity * 0.18;
    const tiltY = state.mouseX * 1.4;
    world.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

    const fov = 980 - Math.min(Math.abs(state.velocity) * 20, 120);
    viewport.style.perspective = `${fov}px`;

    const cameraZ = state.scroll * CONFIG.camSpeed;

    items.forEach((item) => {
      const relZ = item.baseZ + cameraZ;
      let vizZ = ((relZ % CONFIG.loopSize) + CONFIG.loopSize) % CONFIG.loopSize;
      if (vizZ > 480) vizZ -= CONFIG.loopSize;

      let alpha = 1;
      if (vizZ < -2600) alpha = 0;
      else if (vizZ < -1800) alpha = (vizZ + 2600) / 800;
      if (vizZ > 120 && item.type !== 'star') alpha = 1 - (vizZ - 120) / 420;
      alpha = Math.max(0, Math.min(1, alpha));

      item.el.style.opacity = alpha;
      if (!alpha) return;

      let trans = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px)`;
      if (item.type === 'star') {
        const stretch = Math.max(1, Math.min(1 + Math.abs(state.velocity) * 0.02, 2.2));
        trans += ` scale3d(1,1,${stretch})`;
      } else if (item.type === 'text') {
        trans += ` rotateZ(${item.rot}deg)`;
      } else {
        const t = now * 0.001;
        const float = Math.sin(t + item.x) * 2.2;
        trans += ` rotateZ(${item.rot}deg) rotateY(${float}deg)`;
      }

      item.el.style.transform = trans;
    });

    requestAnimationFrame(render);
  }

  init();
  requestAnimationFrame(render);
})();

