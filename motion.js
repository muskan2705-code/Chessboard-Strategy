const items = document.querySelectorAll('.reveal, .stagger-children');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add('is-visible'));
}

const workCards = document.querySelectorAll('.works-carousel .card');
if (workCards.length) {
  workCards.forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', () => {
      const willPop = !card.classList.contains('is-popped');
      workCards.forEach((c) => c.classList.remove('is-popped'));
      if (willPop) card.classList.add('is-popped');
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.works-carousel .card')) {
      workCards.forEach((c) => c.classList.remove('is-popped'));
    }
  });
}

// works-carousel videos autoplay + fallback
const workVideos = document.querySelectorAll('.works-carousel .card-video');
if (workVideos.length) {
  workVideos.forEach((video) => {
    video.muted = true;
    video.defaultMuted = true;
    video.preload = 'auto';
    video.playsInline = true;

    const tryPlay = () => {
      video.play().catch(() => {});
    };

    video.addEventListener('loadedmetadata', () => {
      if (video.duration && video.duration > 1.2) {
        video.currentTime = Math.min(1.2, video.duration * 0.2);
      }
    });

    video.addEventListener('loadeddata', () => {
      video.classList.add('is-ready');
      tryPlay();
    });

    video.addEventListener('error', () => {
      video.classList.add('is-error');
    });

    tryPlay();
  });

  document.addEventListener('pointerdown', () => {
    workVideos.forEach((video) => {
      video.muted = true;
      video.defaultMuted = true;
      video.play().catch(() => {});
    });
  }, { once: true });
}
