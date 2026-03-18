(() => {
  const slider = document.getElementById('aboutTeamSlider');
  const track = document.getElementById('aboutTeamTrack');
  const prev = document.getElementById('aboutTeamPrev');
  const next = document.getElementById('aboutTeamNext');

  if (!slider || !track || !prev || !next) return;

  const slides = Array.from(track.querySelectorAll('.about-team-slide'));
  if (!slides.length) return;

  let index = 0;
  let timer = null;
  const delay = 3000;

  const render = () => {
    track.style.transform = `translateX(-${index * 100}%)`;
  };

  const goTo = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    render();
  };

  const start = () => {
    stop();
    timer = setInterval(() => goTo(index + 1), delay);
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  prev.addEventListener('click', () => {
    goTo(index - 1);
    start();
  });

  next.addEventListener('click', () => {
    goTo(index + 1);
    start();
  });

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  window.addEventListener('resize', render);

  render();
  start();
})();
