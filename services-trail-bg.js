(() => {
  const canvas = document.getElementById("servicesTrailCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) return;

  const config = {
    maxStrokes: 320,
    pointsPerStroke: 2,
    emitBase: 10,
    emitSpeedFactor: 0.22,
    fadeSpeed: 0.42, // lower = slower fade
    smoothing: 0.28,
    minSpeed: 0.6,
    drag: 0.974,
    curlStrength: 0.06,
    widthMin: 1.8,
    widthMax: 3.4,
    palette: [
      "rgba(153, 102, 255, 0.95)", // #9966FF
      "rgba(153, 102, 255, 0.78)",
      "rgba(184, 150, 255, 0.62)",
      "rgba(128, 86, 230, 0.72)"
    ]
  };

  const state = {
    dpr: 1,
    w: 0,
    h: 0,
    t: performance.now(),
    pointerX: null,
    pointerY: null,
    smoothX: null,
    smoothY: null,
    prevX: null,
    prevY: null,
    strokes: []
  };

  function resize() {
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.w = window.innerWidth;
    state.h = window.innerHeight;
    canvas.width = Math.floor(state.w * state.dpr);
    canvas.height = Math.floor(state.h * state.dpr);
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function emitStroke(x, y, baseAngle, speed) {
    if (state.strokes.length >= config.maxStrokes) {
      state.strokes.splice(0, state.strokes.length - config.maxStrokes + 1);
    }

    const angle = baseAngle + rand(-0.32, 0.32);
    const spd = speed * rand(0.6, 1.35) + rand(0.3, 1.2);
    const vx = Math.cos(angle) * spd;
    const vy = Math.sin(angle) * spd;

    state.strokes.push({
      points: [{ x, y }],
      x,
      y,
      vx,
      vy,
      life: 1,
      width: rand(config.widthMin, config.widthMax),
      hueShift: rand(-0.08, 0.08),
      noiseSeed: rand(0, Math.PI * 2),
      noiseFreq: rand(5.5, 9.2),
      color: config.palette[Math.floor(Math.random() * config.palette.length)]
    });
  }

  function updatePointer() {
    if (state.pointerX == null || state.pointerY == null) return { speed: 0, angle: 0 };

    if (state.smoothX == null || state.smoothY == null) {
      state.smoothX = state.pointerX;
      state.smoothY = state.pointerY;
      state.prevX = state.smoothX;
      state.prevY = state.smoothY;
      return { speed: 0, angle: 0 };
    }

    state.smoothX += (state.pointerX - state.smoothX) * config.smoothing;
    state.smoothY += (state.pointerY - state.smoothY) * config.smoothing;

    const dx = state.smoothX - state.prevX;
    const dy = state.smoothY - state.prevY;
    const speed = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    state.prevX = state.smoothX;
    state.prevY = state.smoothY;
    return { speed, angle };
  }

  function emitFromPointer(speed, angle) {
    if (state.smoothX == null || state.smoothY == null) return;
    if (speed < config.minSpeed) return;

    const emissionCount = Math.min(
      24,
      Math.max(8, config.emitBase + Math.floor(speed * config.emitSpeedFactor))
    );

    for (let i = 0; i < emissionCount; i += 1) {
      emitStroke(state.smoothX, state.smoothY, angle, speed * 0.35);
    }
  }

  function emitBurst(x, y, count = 36) {
    const cx = x ?? state.smoothX ?? state.pointerX;
    const cy = y ?? state.smoothY ?? state.pointerY;
    if (cx == null || cy == null) return;
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count;
      emitStroke(cx, cy, angle, 2.2);
    }
  }

  function updateStrokes(dt) {
    for (let i = state.strokes.length - 1; i >= 0; i -= 1) {
      const s = state.strokes[i];
      const age = 1 - s.life;

      const tangent = Math.atan2(s.vy, s.vx);
      const curl = Math.sin((age * s.noiseFreq) + s.noiseSeed) * config.curlStrength;
      const nextAngle = tangent + curl;
      const mag = Math.hypot(s.vx, s.vy) * config.drag;

      s.vx = Math.cos(nextAngle) * mag;
      s.vy = Math.sin(nextAngle) * mag;

      s.x += s.vx * dt * 60;
      s.y += s.vy * dt * 60;
      s.points.push({ x: s.x, y: s.y });
      if (s.points.length > config.pointsPerStroke) {
        s.points.shift();
      }

      s.life -= config.fadeSpeed * dt;
      if (s.life <= 0 || s.points.length < 2) {
        state.strokes.splice(i, 1);
      }
    }
  }

  function drawStroke(stroke) {
    const alpha = Math.max(0, stroke.life) * 0.92;
    const radius = stroke.width * 0.55;

    ctx.beginPath();
    ctx.arc(stroke.x, stroke.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = stroke.color;
    ctx.globalAlpha = alpha;
    ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, state.w, state.h);
    for (let i = 0; i < state.strokes.length; i += 1) {
      drawStroke(state.strokes[i]);
    }
    ctx.globalAlpha = 1;
  }

  function tick(ts) {
    const dt = Math.min((ts - state.t) / 1000, 0.05);
    state.t = ts;

    const motion = updatePointer();
    emitFromPointer(motion.speed, motion.angle);
    updateStrokes(dt);
    draw();
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener(
    "pointermove",
    (e) => {
      state.pointerX = e.clientX;
      state.pointerY = e.clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerdown",
    (e) => {
      state.pointerX = e.clientX;
      state.pointerY = e.clientY;
      emitBurst(e.clientX, e.clientY, 44);
    },
    { passive: true }
  );
  window.addEventListener(
    "touchmove",
    (e) => {
      if (!e.touches || e.touches.length === 0) return;
      state.pointerX = e.touches[0].clientX;
      state.pointerY = e.touches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerleave",
    () => {
      state.pointerX = null;
      state.pointerY = null;
    },
    { passive: true }
  );

  resize();
  requestAnimationFrame(tick);
})();
