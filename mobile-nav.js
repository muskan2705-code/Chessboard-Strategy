(() => {
  const MOBILE_BREAKPOINT = 768;

  const closeMenu = (wrap, button) => {
    wrap.classList.remove('is-mobile-open');
    button.setAttribute('aria-expanded', 'false');
  };

  const initMobileNav = (wrap, index) => {
    const nav = wrap.querySelector('nav');
    const list = nav?.querySelector('.nav-links');
    if (!nav || !list) return;
    if (wrap.querySelector('.nav-toggle')) return;

    const navId = `site-mobile-nav-${index + 1}`;
    nav.id = nav.id || navId;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nav-toggle';
    button.setAttribute('aria-label', 'Toggle navigation menu');
    button.setAttribute('aria-controls', nav.id);
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = '<span></span><span></span><span></span>';

    wrap.insertBefore(button, nav);

    button.addEventListener('click', () => {
      const willOpen = !wrap.classList.contains('is-mobile-open');
      wrap.classList.toggle('is-mobile-open', willOpen);
      button.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    list.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
          closeMenu(wrap, button);
        }
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu(wrap, button);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        closeMenu(wrap, button);
      }
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.site-header .nav-wrap').forEach(initMobileNav);
  });
})();
