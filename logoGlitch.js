class LogoGlitch {
  constructor() {
    this.container = document.querySelector(".logo-container");
    this.original = document.querySelector(".main-logo.original");
    this.boundingRect = this.original.getBoundingClientRect();

    // Create multiple glitch images
    this.glitchImages = [];
    this.numGlitchImages = 20;

    // Remove existing glitch images
    document
      .querySelectorAll("[class^='glitch-']")
      .forEach((el) => el.remove());

    // Create new glitch images
    for (let i = 0; i < this.numGlitchImages; i++) {
      const img = this.original.cloneNode(true);
      img.classList.remove("original");
      img.classList.add(`glitch-${i}`);
      img.style.opacity = "0";
      img.style.mixBlendMode = "screen";
      img.style.pointerEvents = "none";
      img.style.position = "absolute";
      img.style.transition =
        "opacity 0.4s ease-in-out, transform 0.6s ease-out";
      this.container.appendChild(img);
      this.glitchImages.push(img);
    }

    this.isGlitching = false;
    this.glitchInterval = null;
    this.init();
  }

  init() {
    // Replace mouseenter/mouseleave with mousemove for precise detection
    this.container.addEventListener("mousemove", (e) =>
      this.handleMouseMove(e)
    );
    this.container.addEventListener("mouseleave", () => this.stopGlitch());

    // Update bounding rect on window resize
    window.addEventListener("resize", () => {
      this.boundingRect = this.original.getBoundingClientRect();
    });
  }

  handleMouseMove(e) {
    const rect = this.original.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if mouse is within the original image bounds
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      if (!this.isGlitching) {
        this.startGlitch();
      }
    } else {
      if (this.isGlitching) {
        this.stopGlitch();
      }
    }
  }

  randomPosition() {
    // Increased range for wider movement to accommodate larger scales
    const x = Math.random() * 1200 - 600; // -600px to 600px
    const y = Math.random() * 300 - 150; // -150px to 150px
    return { x, y };
  }

  randomScale() {
    // Much larger scale variations
    const scales = [1, 1.5, 2, 2.5, 3, 4, 5, 6]; // Increased maximum scale to 6x
    return scales[Math.floor(Math.random() * scales.length)];
  }

  randomColor() {
    // Subtle color variations
    const hue = Math.random() * 20 - 10; // -10 to 10 degrees
    return `hue-rotate(${hue}deg)`;
  }

  applyGlitch() {
    // Randomly show/hide and position glitch images
    this.glitchImages.forEach((img) => {
      if (Math.random() < 0.2) {
        const pos = this.randomPosition();
        const scale = this.randomScale();

        img.style.opacity = Math.random() * 0.4 + 0.1; // Slightly reduced opacity for larger images
        img.style.transform = `
          translate(${pos.x}px, ${pos.y}px)
          scale(${scale})
        `;
        img.style.filter = `
          blur(${Math.random() * 3}px)
          brightness(${1 + Math.random() * 0.5})
          contrast(${1 + Math.random() * 0.3})
          ${this.randomColor()}
        `;
      } else {
        img.style.opacity = "0";
      }
    });

    // Subtle movement of original
    if (Math.random() < 0.05) {
      const smallOffset = Math.random() * 8 - 4;
      this.original.style.opacity = 0.95 + Math.random() * 0.05;
      this.original.style.transform = `translateX(${smallOffset}px)`;
    } else {
      this.original.style.opacity = "1";
      this.original.style.transform = "translateX(0)";
    }
  }

  startGlitch() {
    if (this.isGlitching) return;
    this.isGlitching = true;

    this.glitchInterval = setInterval(() => {
      this.applyGlitch();
    }, 200);

    this.container.classList.add("glitching");
  }

  stopGlitch() {
    if (!this.isGlitching) return;
    this.isGlitching = false;

    clearInterval(this.glitchInterval);

    // Reset all images
    this.glitchImages.forEach((img) => {
      img.style.opacity = "0";
      img.style.transform = "translate(0, 0) scale(1)";
      img.style.filter = "none";
    });

    // Reset original
    this.original.style.opacity = "1";
    this.original.style.transform = "translateX(0)";
    this.container.classList.remove("glitching");
  }
}

// Initialize the glitch effect
document.addEventListener("DOMContentLoaded", () => {
  new LogoGlitch();
});
