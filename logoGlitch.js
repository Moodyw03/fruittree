class LogoGlitch {
  constructor() {
    this.container = document.querySelector(".logo-container");
    this.original = document.querySelector(".main-logo.original");

    // Create multiple glitch images
    this.glitchImages = [];
    this.numGlitchImages = 15;

    // Remove existing glitch images
    document
      .querySelectorAll(".main-logo.glitch-1, .main-logo.glitch-2")
      .forEach((el) => el.remove());

    // Create new glitch images and position them randomly
    for (let i = 0; i < this.numGlitchImages; i++) {
      const img = this.original.cloneNode(true);
      img.classList.remove("original");
      img.classList.add(`glitch-${i}`);
      img.style.opacity = "0";
      img.style.mixBlendMode = "hard-light";
      img.style.pointerEvents = "none";
      // Position absolutely within container
      img.style.position = "absolute";
      this.container.appendChild(img);
      this.glitchImages.push(img);
    }

    this.isGlitching = false;
    this.glitchInterval = null;
    this.init();
  }

  init() {
    this.container.addEventListener("mouseenter", () => this.startGlitch());
    this.container.addEventListener("mouseleave", () => this.stopGlitch());
  }

  randomPosition() {
    // Generate random position within container bounds
    const x = Math.random() * 200 - 100; // -100px to 100px
    const y = Math.random() * 200 - 100; // -100px to 100px
    return { x, y };
  }

  randomRotation() {
    return Math.random() * 360; // 0 to 360 degrees
  }

  randomScale() {
    return 0.5 + Math.random() * 1; // 0.5 to 1.5
  }

  applyGlitch() {
    // Randomly show/hide and position glitch images
    this.glitchImages.forEach((img) => {
      if (Math.random() < 0.2) {
        // 20% chance to show each image
        const pos = this.randomPosition();
        const rot = this.randomRotation();
        const scale = this.randomScale();

        img.style.opacity = Math.random() * 0.8;
        img.style.transform = `
          translate(${pos.x}px, ${pos.y}px)
          rotate(${rot}deg)
          scale(${scale})
        `;
        img.style.filter = `
          blur(${Math.random() * 2}px)
          brightness(${1 + Math.random()})
          contrast(${1 + Math.random() * 0.5})
        `;
      } else {
        img.style.opacity = "0";
      }
    });

    // Keep original stable with very subtle movement
    this.original.style.transform = `
      translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)
    `;
  }

  startGlitch() {
    if (this.isGlitching) return;
    this.isGlitching = true;

    // Faster interval for more intense effect
    this.glitchInterval = setInterval(() => {
      this.applyGlitch();
    }, 30); // Faster interval for more strobing

    this.container.classList.add("glitching");
  }

  stopGlitch() {
    if (!this.isGlitching) return;
    this.isGlitching = false;

    clearInterval(this.glitchInterval);

    // Reset all images
    this.glitchImages.forEach((img) => {
      img.style.opacity = "0";
      img.style.transform = "translate(0, 0) rotate(0deg) scale(1)";
      img.style.filter = "none";
    });

    // Reset original
    this.original.style.transform = "translate(0, 0)";
    this.container.classList.remove("glitching");
  }
}

// Initialize the glitch effect
document.addEventListener("DOMContentLoaded", () => {
  new LogoGlitch();
});
