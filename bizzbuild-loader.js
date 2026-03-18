(() => {
  function initBizzBuildScrubHero() {
    const hero = document.querySelector('.BizzBuild-header');
    const loader = document.querySelector('.BizzBuild-loader');
    const welcome = document.querySelector('.BizzBuild-title__welcome');
    const brand = document.querySelector('.BizzBuild-title__brand');
    const brandLeft = document.querySelector('.BizzBuild-title__brand-left');
    const brandRight = document.querySelector('.BizzBuild-title__brand-right');
    const sub = document.querySelector('.BizzBuild-title__sub');
    const media = document.querySelector('.BizzBuild-media');
    const mediaStack = document.querySelectorAll('.BizzBuild-media__img:not(.is-main)');
    const brandMid = document.querySelector('.BizzBuild-title__brand-mid');

    if (!hero || !loader || !welcome || !brand || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const getSplitPoint = () => {
      if (!brandMid) {
        return { left: '50%', top: '62%' };
      }
      const brandRect = brand.getBoundingClientRect();
      const midRect = brandMid.getBoundingClientRect();
      const loaderRect = loader.getBoundingClientRect();
      const splitYOffset = Math.min(Math.max(window.innerHeight * 0.04, 22), 40);
      return {
        left: `${midRect.left - loaderRect.left + (midRect.width / 2)}px`,
        top: `${brandRect.top - loaderRect.top + (brandRect.height * 0.9) + splitYOffset}px`
      };
    };

    // initial static state
    gsap.set([welcome, brand, sub, brandLeft, brandRight], { clearProps: 'all' });
    if (media) {
      const splitPoint = getSplitPoint();
      gsap.set(media, {
        autoAlpha: 1,
        left: splitPoint.left,
        top: splitPoint.top,
        xPercent: -50,
        yPercent: -50,
        width: 0,
        height: 0,
        scale: 1
      });
    }
    if (brandMid) gsap.set(brandMid, { width: 0 });
    if (brandLeft) gsap.set(brandLeft, { x: 0 });
    if (brandRight) gsap.set(brandRight, { x: 0 });
    if (mediaStack.length) gsap.set(mediaStack, { opacity: 1 });

    const tl = gsap.timeline({ defaults: { ease: 'none' } });

    const smallW = 28;
    const smallH = Math.min(Math.max(window.innerHeight * 0.09, 56), 92);
    const cardW = Math.min(window.innerWidth * 0.34, 460);
    const cardH = Math.min(window.innerHeight * 0.92, 980);
    const gapW = Math.min(Math.max(window.innerWidth * 0.03, 24), 46);
    const splitPush = Math.min(Math.max(window.innerWidth * 0.018, 10), 24);

    // image reveal + expand (small -> card -> fullscreen), from the exact split point
    if (media) {
      tl.to(
        media,
        {
          width: smallW,
          height: smallH,
          duration: 0.14
        },
        0.02
      );
      if (brandLeft) tl.to(brandLeft, { x: -splitPush, duration: 0.14 }, 0.02);
      if (brandRight) tl.to(brandRight, { x: splitPush, duration: 0.14 }, 0.02);
      if (brandMid) tl.to(brandMid, { width: gapW, duration: 0.14 }, 0.02);
      if (brandLeft) tl.to(brandLeft, { x: 0, duration: 0.22 }, 0.24);
      if (brandRight) tl.to(brandRight, { x: 0, duration: 0.22 }, 0.24);
      if (brandMid) tl.to(brandMid, { width: 0, duration: 0.22 }, 0.24);
      tl.to(
        media,
        {
          width: cardW,
          height: cardH,
          duration: 0.34
        },
        0.16
      );
      tl.to(
        media,
        {
          left: '50%',
          top: '50%',
          xPercent: -50,
          yPercent: -50,
          width: () => window.innerWidth,
          height: () => window.innerHeight,
          borderRadius: 0,
          duration: 0.62
        },
        0.28
      );
    }
    if (mediaStack.length) {
      tl.to(mediaStack, { opacity: 0, duration: 0.2, stagger: 0.14 }, 0.28);
    }

    // Welcome text fades/slides out
    tl.to(welcome, { y: -32, opacity: 0, duration: 1 }, 0);
    tl.to(sub, { y: -18, opacity: 0, duration: 0.9 }, 0);

    // Brand text transforms to top-right corner and scales down
    tl.to(brand, { xPercent: 34, yPercent: -38, scale: 0.44, duration: 1 }, 0.22);

    // ScrollTrigger pin + scrub range
    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: '+=150%',
      pin: true,
      scrub: true,
      anticipatePin: 1,
      animation: tl,
      invalidateOnRefresh: true
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    initBizzBuildScrubHero();
  });
})();
