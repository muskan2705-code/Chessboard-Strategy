(() => {
  const section = document.querySelector('.avalanche-footer');
  const sceneContainer = document.getElementById('scene-container');
  const btnGravity = document.getElementById('btn-gravity');
  const btnExplode = document.getElementById('btn-explode');

  if (!section || !sceneContainer) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const MOBILE_BLOCK_COUNT = 10;
  const DESKTOP_FALLBACK_COUNT = 41;
  const DESKTOP_MATTER_COUNT = 75;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const audioCtx = AudioCtx ? new AudioCtx() : null;

  const TERMS = [
    'Chessboard Strategy', 'Business Consulting', 'Digital Marketing', 'Growth Strategy', 'Go-To-Market',
    'Brand Positioning', 'Marketing Strategy', 'Performance Marketing', 'Social Media Strategy', 'Social Media Ads',
    'Instagram Campaigns', 'LinkedIn Growth', 'YouTube Marketing', 'Facebook Ads', 'Google Ads',
    'Meta Ads', 'Search Engine Optimization', 'SEO Strategy', 'Local SEO', 'Content Marketing',
    'Content Calendar', 'Creative Direction', 'Copywriting Framework', 'Lead Generation', 'Lead Nurturing',
    'Conversion Funnel', 'Sales Funnel', 'Landing Page Optimization', 'Conversion Rate Optimization', 'Email Marketing',
    'WhatsApp Marketing', 'Marketing Automation', 'CRM Setup', 'Lead Scoring', 'Demand Generation',
    'Demand Capture', 'Revenue Growth', 'Revenue Forecasting', 'Pricing Strategy', 'Offer Design',
    'Value Proposition', 'Market Research', 'Competitor Analysis', 'Customer Segmentation', 'ICP Blueprint',
    'Brand Messaging', 'Storytelling', 'Thought Leadership', 'Personal Branding', 'Influencer Partnerships',
    'Community Building', 'Retention Strategy', 'Customer Journey', 'Lifecycle Marketing', 'Remarketing',
    'Re-Engagement Campaigns', 'Attribution Modeling', 'Dashboard Reporting', 'KPI Tracking', 'CAC Optimization',
    'LTV Growth', 'Churn Reduction', 'Upsell Strategy', 'Cross-Sell Strategy', 'Pipeline Management',
    'Sales Enablement', 'Proposal Strategy', 'Discovery Call Framework', 'Business Expansion', 'Market Entry',
    'New Market Launch', 'Omnichannel Marketing', 'Channel Mix', 'Organic Growth', 'Paid Growth',
    'Media Buying', 'Performance Creative', 'A/B Testing', 'Experiment Design', 'Analytics Setup',
    'Google Analytics', 'Tag Manager Setup', 'Pixel Tracking', 'Funnel Analytics', 'Cohort Analysis',
    'Weekly Scorecard', 'Operating Rhythm', 'Execution Roadmap', 'Strategic Roadmap', 'Decision Framework',
    'Operations Alignment', 'Process Optimization', 'Workflow Design', 'SOP Development', 'Team Enablement',
    'Leadership Alignment', 'Accountability System', 'Quarterly Planning', 'Business Model Design', 'Profit Optimization',
    'Cash Flow Planning', 'P&L Clarity', 'Budget Planning', 'Unit Economics', 'Margin Expansion',
    'Client Acquisition', 'Client Retention', 'Brand Awareness', 'Brand Authority', 'Growth Advisory',
    'Boardroom Thinking', 'Execution Excellence', 'Outcome Focused', 'Data-Driven Decisions', 'Scalable Systems',
    'Consulting + Execution', 'Strategy Meets Action', 'Plan to Performance', 'Growth with Clarity', 'Scale with Execution'
  ];
  let hasRendered = false;

  const renderFallback = () => {
    if (hasRendered) return;
    hasRendered = true;
    const count = isMobile ? MOBILE_BLOCK_COUNT : DESKTOP_FALLBACK_COUNT;
    const chosen = TERMS.slice().sort(() => Math.random() - 0.5).slice(0, count);
    const w = section.clientWidth;
    const h = section.clientHeight;

    chosen.forEach((term, i) => {
      const el = document.createElement('div');
      el.className = 'color-body';
      el.textContent = term;
      el.style.width = `${Math.min(280, Math.max(130, term.length * 7.2 + 36))}px`;
      el.style.left = `${Math.random() * Math.max(20, w - 260)}px`;
      el.style.top = `${Math.random() * Math.max(20, h - 80)}px`;
      el.style.opacity = '0.92';
      el.style.background = '#9966FF';
      el.style.borderColor = 'rgba(153, 102, 255, 0.82)';
      el.style.boxShadow = '0 8px 24px rgba(132, 168, 25, 0.42)';
      sceneContainer.appendChild(el);
    });
  };

  const startMatter = () => {
    if (hasRendered) return;
    hasRendered = true;
    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint, Body } = Matter;

    const engine = Engine.create();
    const world = engine.world;
    engine.gravity.y = 1;

    const getSize = () => {
      const r = section.getBoundingClientRect();
      return { width: Math.max(320, Math.floor(r.width)), height: Math.max(320, Math.floor(r.height)) };
    };

    let { width, height } = getSize();

    const render = Render.create({
      element: sceneContainer,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio || 1
      }
    });
    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);

    const bodiesDOM = [];
    let walls = [];

    const tone = () => '#9966FF';

    const setWalls = () => {
      if (walls.length) Composite.remove(world, walls);
      const t = 80;
      walls = [
        Bodies.rectangle(width / 2, -t / 2, width + 300, t, { isStatic: true }),
        Bodies.rectangle(width / 2, height + t / 2, width + 300, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, height / 2, t, height + 300, { isStatic: true }),
        Bodies.rectangle(width + t / 2, height / 2, t, height + 300, { isStatic: true })
      ];
      Composite.add(world, walls);
    };

    const shuffled = TERMS.slice().sort(() => Math.random() - 0.5).slice(0, isMobile ? MOBILE_BLOCK_COUNT : DESKTOP_MATTER_COUNT);

    shuffled.forEach((term, i) => {
      const boxWidth = Math.min(280, Math.max(130, term.length * 7.2 + 36));
      const boxHeight = 40;
      const x = 80 + Math.random() * (width - 160);
      const y = Math.random() * (height * 0.65) - 220;

      const body = Bodies.rectangle(x, y, boxWidth, boxHeight, {
        angle: (Math.random() - 0.5) * 0.3,
        restitution: 0.45,
        friction: 0.02,
        frictionAir: 0.002,
        density: 0.0016
      });

      const el = document.createElement('div');
      el.className = 'color-body';
      el.textContent = term;
      el.style.width = `${boxWidth}px`;
      el.style.background = tone(i);
      el.style.borderColor = 'rgba(153, 102, 255, 0.82)';
      el.style.boxShadow = '0 8px 24px rgba(132, 168, 25, 0.42)';
      sceneContainer.appendChild(el);

      bodiesDOM.push({ body, el });
      Composite.add(world, body);
    });

    const sync = () => {
      for (const { body, el } of bodiesDOM) {
        el.style.transform = `translate(${body.position.x - el.offsetWidth / 2}px, ${body.position.y - el.offsetHeight / 2}px) rotate(${body.angle}rad)`;
      }
      requestAnimationFrame(sync);
    };
    sync();

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Composite.add(world, mouseConstraint);

    let gravityOn = true;
    btnGravity?.addEventListener('click', () => {
      gravityOn = !gravityOn;
      engine.gravity.y = gravityOn ? 1 : 0;
      btnGravity.textContent = gravityOn ? 'Zero Gravity' : 'Restore Gravity';
    });

    btnExplode?.addEventListener('click', () => {
      playExplodeSound();
      for (const { body } of bodiesDOM) {
        const power = 0.05 * body.mass;
        const a = Math.random() * Math.PI * 2;
        Body.applyForce(body, body.position, { x: Math.cos(a) * power, y: Math.sin(a) * power });
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.85);
      }
    });

    setWalls();

    window.addEventListener('resize', () => {
      ({ width, height } = getSize());
      render.canvas.width = width;
      render.canvas.height = height;
      render.options.width = width;
      render.options.height = height;
      setWalls();
    });
  };

  const boot = () => {
    if (prefersReducedMotion) {
      renderFallback();
      return;
    }

    if (typeof Matter !== 'undefined') {
      startMatter();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/matter-js@0.20.0/build/matter.min.js';
    script.onload = () => startMatter();
    script.onerror = () => renderFallback();
    document.head.appendChild(script);
  };

  const playExplodeSound = () => {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    const master = audioCtx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
    master.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    master.connect(audioCtx.destination);

    // Noise burst (impact texture)
    const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.9, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(740, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(220, now + 0.7);
    noiseFilter.Q.value = 0.9;
    noise.connect(noiseFilter).connect(master);
    noise.start(now);
    noise.stop(now + 0.85);

    // Low thump
    const thump = audioCtx.createOscillator();
    const thumpGain = audioCtx.createGain();
    thump.type = 'triangle';
    thump.frequency.setValueAtTime(96, now);
    thump.frequency.exponentialRampToValueAtTime(42, now + 0.5);
    thumpGain.gain.setValueAtTime(0.0001, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.32, now + 0.015);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    thump.connect(thumpGain).connect(master);
    thump.start(now);
    thump.stop(now + 0.6);
  };

  btnExplode?.addEventListener('pointerdown', () => {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }, { once: true });

  boot();

  // If third-party physics never loads for any reason, still show the fallback words.
  window.setTimeout(() => {
    if (!hasRendered) renderFallback();
  }, 2500);
})();






