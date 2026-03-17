(() => {
  const cfg = {
    maxPoints: 48,
    minDist: 4,
    lineWidth: 1.8,
    glowBlur: 10,
    fadeAlpha: 0.07,
    colorA: "rgba(34,211,238,0.9)",
    colorB: "rgba(129,140,248,0.9)"
  };

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(hover: none), (pointer: coarse)").matches;
  if (reduced || coarse) return;

  const canvas = document.getElementById("neonTrailCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  let dpr = 1;
  let w = 0;
  let h = 0;
  let raf = 0;
  let running = true;
  const points = [];

  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function addPoint(x, y) {
    const p = { x, y };
    const last = points[points.length - 1];
    if (!last || dist(last, p) >= cfg.minDist) {
      points.push(p);
      if (points.length > cfg.maxPoints) points.shift();
    }
  }

  function drawTrail() {
    if (points.length < 2) return;

    const first = points[0];
    const last = points[points.length - 1];
    const grad = ctx.createLinearGradient(first.x, first.y, last.x, last.y);
    grad.addColorStop(0, cfg.colorA);
    grad.addColorStop(1, cfg.colorB);

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = cfg.lineWidth;
    ctx.strokeStyle = grad;
    ctx.shadowBlur = cfg.glowBlur;
    ctx.shadowColor = "rgba(56,189,248,0.35)";
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.stroke();
    ctx.restore();
  }

  function frame() {
    if (!running) return;

    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = `rgba(0,0,0,${cfg.fadeAlpha})`;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    drawTrail();
    raf = requestAnimationFrame(frame);
  }

  window.addEventListener("pointermove", (e) => addPoint(e.clientX, e.clientY), { passive: true });
  window.addEventListener("pointerleave", () => { points.length = 0; });
  window.addEventListener("resize", resize, { passive: true });

  document.addEventListener("visibilitychange", () => {
    running = document.visibilityState === "visible";
    cancelAnimationFrame(raf);
    if (running) raf = requestAnimationFrame(frame);
  });

  resize();
  raf = requestAnimationFrame(frame);
})();
