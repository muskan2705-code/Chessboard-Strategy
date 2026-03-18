(function () {
  const container = document.getElementById("sliderContainer");
  const track = document.getElementById("sliderTrack");

  if (!container || !track || typeof gsap === "undefined") return;

  class BizzServicesSlider {
    constructor() {
      this.cards = Array.from(track.querySelectorAll(".bb-slider-card"));
      this.expandedCard = null;
      this.timer = null;
      this.delay = 1800;
      this.isAnimating = false;

      if (!this.cards.length) return;

      this.injectLabels();
      this.attachEvents();
      this.startAutoMove();
    }

    injectLabels() {
      this.cards.forEach((card) => {
        if (card.querySelector(".bb-slider-caption")) return;
        const cap = document.createElement("div");
        cap.className = "bb-slider-caption";
        cap.innerHTML = `<h3>${card.dataset.title || "Service"}</h3><p>${card.dataset.desc || ""}</p>`;
        card.appendChild(cap);
        const overlayText = card.querySelector(".hover-overlay span");
        if (overlayText) overlayText.textContent = "Hover to see more";
      });
    }

    getStepWidth() {
      const first = track.querySelector(".bb-slider-card");
      if (!first) return 0;
      const gap = parseFloat(getComputedStyle(track).gap || "10") || 10;
      return first.getBoundingClientRect().width + gap;
    }

    moveNext() {
      if (this.expandedCard || this.isAnimating || document.hidden) return;
      const first = track.querySelector(".bb-slider-card");
      if (!first) return;

      const step = this.getStepWidth();
      if (!step) return;

      this.isAnimating = true;
      gsap.to(track, {
        x: -step,
        duration: 0.62,
        ease: "power2.inOut",
        onComplete: () => {
          track.appendChild(first);
          gsap.set(track, { x: 0 });
          this.isAnimating = false;
        }
      });
    }

    startAutoMove() {
      this.stopAutoMove();
      this.timer = setInterval(() => this.moveNext(), this.delay);
      window.setTimeout(() => this.moveNext(), 350);
    }

    stopAutoMove() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }

    openCard(card) {
      if (this.expandedCard === card) return;
      if (this.expandedCard) this.closeCard(this.expandedCard, false);
      this.expandedCard = card;
      this.stopAutoMove();
      track.classList.add("blurred");
      card.classList.add("expanded");

      gsap.to(card, {
        scale: 1.08,
        y: -8,
        zIndex: 30,
        duration: 0.28,
        ease: "power2.out"
      });
    }

    closeCard(card, clearExpanded = true) {
      if (!card) return;
      card.classList.remove("expanded");
      track.classList.remove("blurred");
      gsap.to(card, {
        scale: 1,
        y: 0,
        zIndex: 1,
        duration: 0.24,
        ease: "power2.out"
      });
      if (clearExpanded) {
        this.expandedCard = null;
        this.startAutoMove();
      }
    }

    toggleCard(card) {
      if (this.expandedCard === card) this.closeCard(card);
      else this.openCard(card);
    }

    attachEvents() {
      this.cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          if (window.innerWidth <= 768) return;
          this.openCard(card);
        });

        card.addEventListener("mouseleave", () => {
          if (window.innerWidth <= 768) return;
          if (this.expandedCard === card) this.closeCard(card);
        });

        card.addEventListener("focusin", () => {
          if (window.innerWidth <= 768) return;
          this.openCard(card);
        });

        card.addEventListener("focusout", () => {
          if (window.innerWidth <= 768) return;
          if (this.expandedCard === card) this.closeCard(card);
        });
      });

      track.addEventListener("click", (e) => {
        if (window.innerWidth > 768) return;
        const card = e.target.closest(".bb-slider-card");
        if (!card) return;
        this.toggleCard(card);
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.expandedCard) this.closeCard(this.expandedCard);
      });

            document.addEventListener("visibilitychange", () => {
        if (document.hidden) this.stopAutoMove();
        else if (!this.expandedCard) this.startAutoMove();
      });

      window.addEventListener("resize", () => {
        gsap.set(track, { x: 0 });
        if (window.innerWidth > 768 && this.expandedCard) {
          this.closeCard(this.expandedCard);
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    new BizzServicesSlider();
  });
})();


