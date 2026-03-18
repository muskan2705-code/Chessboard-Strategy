(() => {
  function revealWithoutAnimation() {
    const container = document.querySelector(".chessboard-header");
    if (!container) return;
    container.classList.remove("is--hidden");
  }

  function initChessboardLoadingAnimation() {
    const container = document.querySelector(".chessboard-header");
    if (!container) return;
    if (typeof gsap === "undefined") {
      revealWithoutAnimation();
      return;
    }

    const loadingLetter = container.querySelectorAll(".chessboard__letter");
    const box = container.querySelectorAll(".chessboard-loader__box");
    const growingImage = container.querySelectorAll(".chessboard__growing-image");
    const headingStart = container.querySelectorAll(".chessboard__h1-start");
    const headingEnd = container.querySelectorAll(".chessboard__h1-end");
    const coverImageExtra = container.querySelectorAll(".chessboard__cover-image-extra");
    const headerLetter = container.querySelectorAll(".chessboard__letter-white, .chessboard-welcome");
    const navLinks = container.querySelectorAll(".chessboard-nav a, .osmo-credits__p");
    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onStart: () => {
        container.classList.remove("is--hidden");
      },
    });

    if (loadingLetter.length) {
      tl.from(loadingLetter, { yPercent: 100, stagger: 0.025, duration: 1.25 });
    }

    if (box.length) {
      tl.fromTo(box, { width: "0em" }, { width: "1em", duration: 1.25 }, "< 1.25");
    }

    if (growingImage.length) {
      tl.fromTo(growingImage, { width: "0%" }, { width: "100%", duration: 1.25 }, "<");
    }

    if (headingStart.length) {
      tl.fromTo(headingStart, { x: "0em" }, { x: "-0.05em", duration: 1.25 }, "<");
    }

    if (headingEnd.length) {
      tl.fromTo(headingEnd, { x: "0em" }, { x: "0.05em", duration: 1.25 }, "<");
    }

    if (coverImageExtra.length) {
      tl.fromTo(
        coverImageExtra,
        { opacity: 1 },
        { opacity: 0, duration: 0.05, ease: "none", stagger: 0.5 },
        "-=0.05"
      );
    }

    if (growingImage.length) {
      tl.to(
        growingImage,
        { left: "50%", xPercent: -50, width: "120vw", height: "100dvh", duration: 2 },
        "< 1.25"
      );
    }

    if (box.length) {
      tl.to(box, { width: "120vw", duration: 2 }, "<");
    }

    if (headerLetter.length) {
      tl.from(
        headerLetter,
        { yPercent: 100, duration: 1.25, ease: "expo.out", stagger: 0.025 },
        "< 1.2"
      );
    }

    if (navLinks.length) {
      tl.from(
        navLinks,
        { yPercent: 100, duration: 1.25, ease: "expo.out", stagger: 0.1 },
        "<"
      );
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealWithoutAnimation();
      return;
    }
    initChessboardLoadingAnimation();
  });
})();
