(() => {
  const hero = document.getElementById('wordScrubHero');
  const headline = hero?.querySelector('.hero-dynamic-headline');
  const slotA = document.getElementById('heroWordSlotA');
  const slotB = document.getElementById('heroWordSlotB');

  if (!hero || !headline || !slotA || !slotB) return;

  const wordsA = ['clarity', 'strategy', 'vision', 'focus', 'systems'];
  const wordsB = ['execution', 'speed', 'process', 'growth', 'results'];
  const colorsA = ['#c9a7ff', '#b98dff', '#a775ff', '#9560f4', '#d8b8ff'];
  const colorsB = ['#e7d4ff', '#d2b1ff', '#bc90ff', '#ab73ff', '#9360e8'];
  const cycleDelayMs = 1800;
  const charDelayA = 65;
  const charDelayB = 95;
  const lineBStartOffsetMs = 220;

  const makeWord = (color) => {
    const el = document.createElement('span');
    el.className = 'hero-word';
    el.textContent = '';
    if (color) el.style.setProperty('--hero-word-color', color);
    return el;
  };

  const setInitial = (slot, color) => {
    const el = makeWord(color);
    slot.innerHTML = '';
    slot.appendChild(el);
  };

  const alignFixedLabels = () => {
    const fixedNodes = hero.querySelectorAll('.hero-line-fixed');
    if (!fixedNodes.length) return;

    fixedNodes.forEach((node) => {
      node.style.width = 'auto';
    });

    let max = 0;
    fixedNodes.forEach((node) => {
      max = Math.max(max, node.offsetWidth);
    });

    fixedNodes.forEach((node) => {
      node.style.width = `${Math.ceil(max)}px`;
    });
  };

  const lockSlotWidth = (slot, words, color) => {
    let max = 0;
    words.forEach((w) => {
      const probe = makeWord(color);
      probe.textContent = w;
      probe.style.visibility = 'hidden';
      probe.style.pointerEvents = 'none';
      slot.appendChild(probe);
      max = Math.max(max, probe.offsetWidth);
      probe.remove();
    });
    slot.style.width = `${Math.ceil(max + 4)}px`;
  };

  let typingTimers = [];
  const clearTypingTimers = () => {
    typingTimers.forEach((id) => clearTimeout(id));
    typingTimers = [];
  };

  const typeWord = (slot, text, color, charDelay, done) => {
    slot.innerHTML = '';
    const el = makeWord(color);
    el.classList.add('is-current');
    slot.appendChild(el);

    let i = 0;
    const tick = () => {
      el.textContent = text.slice(0, i + 1);
      i += 1;
      if (i < text.length) {
        const timer = setTimeout(tick, charDelay);
        typingTimers.push(timer);
      } else if (typeof done === 'function') {
        done();
      }
    };

    tick();
  };

  setInitial(slotA, colorsA[0]);
  setInitial(slotB, colorsB[0]);
  alignFixedLabels();
  lockSlotWidth(slotA, wordsA, colorsA[0]);
  lockSlotWidth(slotB, wordsB, colorsB[0]);

  let step = 0;
  let cycleTimer = null;

  const runStep = () => {
    const total = Math.min(wordsA.length, wordsB.length);
    const next = step % total;
    typeWord(slotA, wordsA[next], colorsA[next], charDelayA);
    const timer = setTimeout(() => {
      typeWord(slotB, wordsB[next], colorsB[next], charDelayB);
    }, lineBStartOffsetMs);
    typingTimers.push(timer);
    step = (step + 1) % total;
  };

  const startAuto = (immediate = true) => {
    clearTypingTimers();
    if (cycleTimer) clearInterval(cycleTimer);
    if (immediate) runStep();
    cycleTimer = setInterval(runStep, cycleDelayMs);
  };

  const stopAuto = () => {
    clearTypingTimers();
    if (cycleTimer) {
      clearInterval(cycleTimer);
      cycleTimer = null;
    }
  };

  startAuto();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  headline.style.cursor = 'pointer';
  headline.setAttribute('role', 'button');
  headline.setAttribute('tabindex', '0');
  headline.setAttribute('aria-label', 'Change headline words');

  headline.addEventListener('click', () => {
    runStep();
    startAuto(false);
  });

  headline.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      runStep();
      startAuto(false);
    }
  });
})();

