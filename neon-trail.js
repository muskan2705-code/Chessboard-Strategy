(() => {
  const canvas = document.getElementById("neonTrailCanvas");
  if (!canvas) return;

  // Trail drawing intentionally disabled.
  const ctx = canvas.getContext("2d", { alpha: true });
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
})();
