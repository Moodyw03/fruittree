class ComingSoonEffect {
  constructor() {
    this.container = document.body;
    this.logo = document.querySelector(".logo-container");
    this.scrollText = null;
    this.isActive = false;

    this.init();
  }

  init() {
    this.logo.addEventListener("mouseenter", () => this.startEffect());
    this.logo.addEventListener("mouseleave", () => this.stopEffect());
    this.createScrollingText();
  }

  createScrollingText() {
    const container = document.createElement("div");
    container.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50px;
      overflow: hidden;
      z-index: 2;
      opacity: 0;
      transition: opacity 0.2s ease;
      display: flex;
      align-items: center;
      background: rgba(0, 0, 255, 0.2);
    `;

    const text = document.createElement("div");
    text.textContent = "COMING SOON ".repeat(20);
    text.style.cssText = `
      color: rgba(255, 255, 255, 0.9);
      font-family: 'Darker Grotesque', sans-serif;
      font-size: 28px;
      letter-spacing: 4px;
      font-weight: 300;
      white-space: nowrap;
      transform: translateX(100%);
      animation: scrollText 15s linear infinite;
      animation-play-state: paused;
      text-transform: uppercase;
    `;

    const style = document.createElement("style");
    style.textContent = `
      @keyframes scrollText {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
    `;
    document.head.appendChild(style);

    container.appendChild(text);
    this.container.appendChild(container);
    this.scrollText = container;
    this.textElement = text;
  }

  startEffect() {
    if (this.isActive) return;
    this.isActive = true;
    this.scrollText.style.opacity = "1";
    this.textElement.style.animationPlayState = "running";
  }

  stopEffect() {
    this.isActive = false;
    this.scrollText.style.opacity = "0";
    this.textElement.style.animationPlayState = "paused";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ComingSoonEffect();
});
