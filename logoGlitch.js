class LogoGlitch {
  constructor() {
    this.container = document.querySelector(".logo-container");
    this.original = document.querySelector(".main-logo.original");
    this.boundingRect = this.original.getBoundingClientRect();
    this.glitchImages = [];
    this.numGlitchImages = 20;
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.isListening = false;

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

  async initAudio() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);

      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.isListening = true;
      this.startGlitch();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      // Fallback to mouse interaction if mic access fails
      this.initMouseEvents();
    }
  }

  initMouseEvents() {
    this.container.addEventListener("mousemove", (e) =>
      this.handleMouseMove(e)
    );
    this.container.addEventListener("mouseleave", () => this.stopGlitch());
  }

  init() {
    // Add button for mic access
    const micButton = document.createElement("button");
    micButton.textContent = "Enable Audio Reactive";
    micButton.style.cssText = `
      position: absolute;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      padding: 10px 20px;
      background: none;
      border: 1px solid white;
      color: white;
      font-family: 'Darker Grotesque', sans-serif;
      cursor: pointer;
      z-index: 1000;
      transition: opacity 0.3s ease;
    `;
    micButton.addEventListener(
      "mouseenter",
      () => (micButton.style.opacity = "0.7")
    );
    micButton.addEventListener(
      "mouseleave",
      () => (micButton.style.opacity = "1")
    );
    micButton.addEventListener("click", () => this.initAudio());
    document.body.appendChild(micButton);

    window.addEventListener("resize", () => {
      this.boundingRect = this.original.getBoundingClientRect();
    });
  }

  getAudioLevel() {
    if (!this.isListening || !this.analyser) return 0;

    this.analyser.getByteFrequencyData(this.dataArray);
    const average =
      this.dataArray.reduce((a, b) => a + b) / this.dataArray.length;

    // Add threshold to only trigger on actual sound
    const threshold = 20; // Adjust this value to change sensitivity
    if (average < threshold) return 0;

    // Dramatically increase sensitivity above threshold
    return Math.pow((average - threshold) / (255 - threshold), 0.3) * 8; // Increased multiplier
  }

  applyGlitch() {
    const audioLevel = this.getAudioLevel();

    // Only apply effect if there's significant audio
    if (audioLevel === 0) {
      this.resetGlitch();
      return;
    }

    // Increase base intensity significantly
    const intensity = this.isListening ? Math.max(audioLevel, 0.2) * 3 : 0;

    this.glitchImages.forEach((img) => {
      if (Math.random() < 0.4 * intensity) {
        const pos = this.randomPosition(intensity);
        const scale = this.randomScale(intensity);

        img.style.opacity = Math.random() * 0.8 * intensity + 0.3;
        img.style.transform = `
                translate(${pos.x}px, ${pos.y}px)
                scale(${scale})
            `;
        img.style.filter = `
                blur(${Math.random() * 8 * intensity}px)
                brightness(${1 + Math.random() * 2 * intensity})
                contrast(${1 + Math.random() * intensity})
                ${this.randomColor(intensity)}
            `;
      } else {
        img.style.opacity = "0";
      }
    });

    // Move original only with strong audio
    if (audioLevel > 0.3 && Math.random() < 0.15 * intensity) {
      const smallOffset = Math.random() * 20 * intensity - 10 * intensity;
      this.original.style.opacity = 0.8 + Math.random() * 0.2;
      this.original.style.transform = `translateX(${smallOffset}px)`;
    } else {
      this.original.style.opacity = "1";
      this.original.style.transform = "translateX(0)";
    }
  }

  randomPosition(intensity = 1) {
    const x = Math.random() * 2000 * intensity - 1000 * intensity; // Increased range
    const y = Math.random() * 500 * intensity - 250 * intensity; // Increased range
    return { x, y };
  }

  randomScale(intensity = 1) {
    const scales = [1, 2, 3, 4, 6, 8, 10]; // Increased maximum scale
    const maxIndex = Math.floor(scales.length * intensity);
    return scales[Math.floor(Math.random() * maxIndex)];
  }

  randomColor(intensity = 1) {
    const hue = Math.random() * 40 * intensity - 20 * intensity; // Increased color variation
    return `hue-rotate(${hue}deg)`;
  }

  startGlitch() {
    if (this.isGlitching) return;
    this.isGlitching = true;

    const animate = () => {
      if (!this.isGlitching) return;
      this.applyGlitch();
      requestAnimationFrame(animate);
    };
    animate();
  }

  stopGlitch() {
    if (!this.isGlitching) return;
    this.isGlitching = false;

    this.glitchImages.forEach((img) => {
      img.style.opacity = "0";
      img.style.transform = "translate(0, 0) scale(1)";
      img.style.filter = "none";
    });

    this.original.style.opacity = "1";
    this.original.style.transform = "translateX(0)";
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

  // Add new method to reset glitch state
  resetGlitch() {
    this.glitchImages.forEach((img) => {
      img.style.opacity = "0";
      img.style.transform = "translate(0, 0) scale(1)";
      img.style.filter = "none";
    });
    this.original.style.opacity = "1";
    this.original.style.transform = "translateX(0)";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new LogoGlitch();
});
