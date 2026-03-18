(() => {
  const cfg = {
    radius: 6,
    glow: 25,
    color: "rgba(34,211,238,1)",
    trailAlpha: 0.08,
    ease: 0.12, // smoothness (lower = smoother)
  };

  const canvas = document.getElementById("neonTrailCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let dpr = 1, w = 0, h = 0;
  let raf;

  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let dot = { x: mouse.x, y: mouse.y };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawDot(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, cfg.radius, 0, Math.PI * 2);
    ctx.fillStyle = cfg.color;
    ctx.shadowBlur = cfg.glow;
    ctx.shadowColor = cfg.color;
    ctx.fill();
  }

  function animate() {
    // smooth trailing effect
    dot.x += (mouse.x - dot.x) * cfg.ease;
    dot.y += (mouse.y - dot.y) * cfg.ease;

    // fade background
    ctx.fillStyle = `rgba(0,0,0,${cfg.trailAlpha})`;
    ctx.fillRect(0, 0, w, h);

    drawDot(dot.x, dot.y);

    raf = requestAnimationFrame(animate);
  }

  window.addEventListener("pointermove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("resize", resize);

  resize();
  animate();
})();
