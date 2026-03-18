(function () {
  const section = document.getElementById('waveServices');
  if (!section) return;

  const items = Array.from(section.querySelectorAll('.wave-service-item'));
  const media = Array.from(section.querySelectorAll('.wave-media-card'));
  const path = section.querySelector('#servicesWavePath');
  const progressPath = section.querySelector('#servicesWavePathProgress');
  const svg = section.querySelector('.wave-line-svg');
  const dot = section.querySelector('#servicesWaveDot');
  if (!items.length || !media.length || !path || !progressPath || !svg || !dot) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const total = Math.min(items.length, media.length);
  let pathLength = 0;
  let manualIndex = null;

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function setActive(index) {
    items.forEach((el, i) => el.classList.toggle('is-active', i === index));
    media.forEach((el, i) => el.classList.toggle('is-active', i === index));
  }

  function refreshPath() {
    pathLength = path.getTotalLength();
    progressPath.style.strokeDasharray = String(pathLength);
    progressPath.style.strokeDashoffset = String(pathLength);
  }

  function getProgress() {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const vh = window.innerHeight;

    const start = sectionTop - vh * 0.2;
    const end = sectionTop + sectionHeight - vh * 0.75;
    const scrollY = window.scrollY || window.pageYOffset;

    return clamp((scrollY - start) / Math.max(1, end - start), 0, 1);
  }

  function update() {
    const progress = reduced ? 1 : getProgress();
    const autoIndex = clamp(Math.floor(progress * total), 0, total - 1);
    const index = manualIndex === null ? autoIndex : manualIndex;

    setActive(index);
    progressPath.style.strokeDashoffset = String(pathLength * (1 - progress));

    const pt = path.getPointAtLength(pathLength * progress);
    const vb = svg.viewBox && svg.viewBox.baseVal ? svg.viewBox.baseVal : { width: 120, height: 620 };
    const scaleX = svg.clientWidth / (vb.width || 1);
    const scaleY = svg.clientHeight / (vb.height || 1);
    const wrapRect = dot.offsetParent.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const svgOffsetX = svgRect.left - wrapRect.left;
    const svgOffsetY = svgRect.top - wrapRect.top;

    dot.style.left = `${svgOffsetX + pt.x * scaleX}px`;
    dot.style.top = `${svgOffsetY + pt.y * scaleY}px`;
  }

  function tick() {
    update();
    requestAnimationFrame(tick);
  }

  refreshPath();
  update();
  tick();

  items.forEach((item, i) => {
    item.addEventListener('mouseenter', () => {
      manualIndex = i;
      setActive(i);
    });

    item.addEventListener('focusin', () => {
      manualIndex = i;
      setActive(i);
    });

    item.addEventListener('click', () => {
      manualIndex = i;
      setActive(i);
    });
  });

  section.addEventListener('mouseleave', () => {
    manualIndex = null;
  });

  window.addEventListener('resize', () => {
    refreshPath();
    update();
  });
})();
