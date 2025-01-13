class GlitchLine {
  constructor() {
    this.reset();
  }

  reset() {
    this.height = Math.random() * 1.5 + 0.5;
    this.width = Math.random() * (canvas.width / 3) + canvas.width / 3;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = Math.random() * canvas.height;
    this.glitchOffset = Math.random() * 5 - 2.5;
    this.opacity = Math.random() * 0.3 + 0.1;
    this.speed = Math.random() * 8 + 3;
    this.glitchChance = 0.05;
  }

  update() {
    this.x += this.speed;

    // Random glitch effect
    if (Math.random() < this.glitchChance) {
      this.glitchOffset = Math.random() * 20 - 10;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    // Reset when line goes off screen
    if (this.x > canvas.width) {
      this.reset();
      this.x = -this.width;
    }
  }

  draw(ctx) {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;

    // Main line
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Glitch effect lines
    ctx.fillStyle = `rgba(200, 220, 255, ${this.opacity * 0.5})`;
    ctx.fillRect(
      this.x + this.glitchOffset,
      this.y,
      this.width * 0.8,
      this.height
    );
  }
}

const canvas = document.getElementById("backgroundEffect");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const lines = [];
const NUMBER_OF_LINES = 15;

function init() {
  lines.length = 0;
  for (let i = 0; i < NUMBER_OF_LINES; i++) {
    lines.push(new GlitchLine());
  }
}

function animate() {
  // Create a gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#0000ff");
  gradient.addColorStop(1, "#0000dd");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add slight darkness overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update and draw lines
  lines.forEach((line) => {
    line.update();
    line.draw(ctx);
  });

  // Add scanline effect
  for (let i = 0; i < canvas.height; i += 4) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, i, canvas.width, 1);
  }

  // Random glitch blocks
  if (Math.random() < 0.05) {
    const numBlocks = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numBlocks; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const width = Math.random() * 100 + 50;
      const height = Math.random() * 30 + 10;
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
      ctx.fillRect(x, y, width, height);
    }
  }

  requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

// Add mouse interaction
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Reduced chance of creating new lines on mouse movement
  if (Math.random() < 0.05) {
    const line = new GlitchLine();
    line.x = mouseX - line.width / 2;
    line.y = mouseY;
    lines.push(line);
    if (lines.length > NUMBER_OF_LINES + 5) {
      lines.shift();
    }
  }
});

init();
animate();
