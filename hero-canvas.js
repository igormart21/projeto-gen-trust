(function () {
  const shell = document.getElementById("inicio");
  const canvas = document.getElementById("heroCanvas");
  if (!shell || !canvas || !canvas.getContext) return;

  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const mouse = { x: null, y: null, radius: 195 };
  let animationFrameId = 0;
  let particles = [];
  let helixPhase = 0;
  let logicW = 0;
  let logicH = 0;

  const COL = {
    accent: "185, 241, 93",
    gold: "214, 180, 126",
    dim: "120, 140, 170"
  };

  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      if (this.x > logicW || this.x < 0) this.directionX = -this.directionX;
      if (this.y > logicH || this.y < 0) this.directionY = -this.directionY;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size && distance > 0.001) {
          const fx = dx / distance;
          const fy = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= fx * force * 4;
          this.y -= fy * force * 4;
        }
      }

      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  function particleDensity() {
    const area = logicW * logicH;
    const divisor = logicW < 720 ? 12000 : 8200;
    return Math.max(52, Math.min(185, Math.floor(area / divisor)));
  }

  function initParticles() {
    particles = [];
    if (logicW < 1 || logicH < 1) return;
    const n = particleDensity();
    for (let i = 0; i < n; i++) {
      const size = Math.random() * 1.6 + 0.6;
      const x = Math.random() * (logicW - size * 2) + size;
      const y = Math.random() * (logicH - size * 2) + size;
      const directionX = (Math.random() - 0.5) * 0.35;
      const directionY = (Math.random() - 0.5) * 0.35;
      const useGold = Math.random() > 0.62;
      const alpha = 0.35 + Math.random() * 0.45;
      const color = useGold
        ? `rgba(${COL.gold}, ${alpha})`
        : `rgba(${COL.accent}, ${alpha})`;
      particles.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }

  function drawHelix() {
    const cx = logicW * 0.78;
    const amp = Math.min(58, logicW * 0.055);
    const w = 0.017;
    const t = helixPhase;

    ctx.save();
    ctx.lineWidth = 1.2;
    ctx.lineCap = "round";

    for (let strand = 0; strand < 2; strand++) {
      ctx.beginPath();
      const phase = strand * Math.PI + t;
      for (let y = -40; y < logicH + 40; y += 5) {
        const x = cx + Math.sin(y * w + phase) * amp;
        if (y === -40) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle =
        strand === 0 ? `rgba(${COL.accent}, 0.3)` : `rgba(${COL.gold}, 0.24)`;
      ctx.stroke();
    }

    ctx.globalAlpha = 0.14;
    for (let y = 0; y < logicH + 40; y += 22) {
      const x1 = cx + Math.sin(y * w + t) * amp;
      const x2 = cx + Math.sin(y * w + t + Math.PI) * amp;
      ctx.beginPath();
      ctx.moveTo(x1, y);
      ctx.lineTo(x2, y);
      ctx.strokeStyle = `rgba(${COL.accent}, 0.85)`;
      ctx.stroke();
    }
    ctx.restore();
  }

  function connect() {
    const threshold = Math.min(logicW, logicH) * 0.14;
    const thresholdSq = threshold * threshold;

    for (let a = 0; a < particles.length; a++) {
      let links = 0;
      for (let b = a + 1; b < particles.length && links < 6; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distSq = dx * dx + dy * dy;
        if (distSq > thresholdSq) continue;

        const distance = Math.sqrt(distSq);
        const opacity = Math.max(0, 0.68 * (1 - distance / threshold));

        let stroke = `rgba(${COL.dim}, ${opacity * 0.35})`;
        if (mouse.x !== null && mouse.y !== null) {
          const mx = (particles[a].x + particles[b].x) / 2 - mouse.x;
          const my = (particles[a].y + particles[b].y) / 2 - mouse.y;
          const dMouse = Math.sqrt(mx * mx + my * my);
          if (dMouse < mouse.radius * 1.1) {
            stroke = `rgba(245, 248, 255, ${opacity * 0.55})`;
          } else if ((a + b) % 3 === 0) {
            stroke = `rgba(${COL.accent}, ${opacity * 0.45})`;
          } else {
            stroke = `rgba(${COL.gold}, ${opacity * 0.35})`;
          }
        } else if ((a + b) % 4 === 0) {
          stroke = `rgba(${COL.accent}, ${opacity * 0.4})`;
        }

        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
        links++;
      }
    }
  }

  function resize() {
    const rect = shell.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    logicW = Math.max(1, Math.floor(rect.width));
    logicH = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(logicW * dpr);
    canvas.height = Math.floor(logicH * dpr);
    canvas.style.width = `${logicW}px`;
    canvas.style.height = `${logicH}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function clear() {
    ctx.fillStyle = "rgba(6, 8, 12, 0.94)";
    ctx.fillRect(0, 0, logicW, logicH);
  }

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    helixPhase += 0.016;
    clear();
    drawHelix();
    for (let i = 0; i < particles.length; i++) particles[i].update();
    connect();
  }

  function setMouseFromEvent(event) {
    const rect = shell.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  }

  function onPointerMove(event) {
    setMouseFromEvent(event);
  }

  function onPointerLeave() {
    mouse.x = null;
    mouse.y = null;
  }

  function stopLoop() {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
  }

  function startLoop() {
    if (prefersReducedMotion) return;
    stopLoop();
    animationFrameId = requestAnimationFrame(animate);
  }

  const ro = new ResizeObserver(() => {
    resize();
    if (!prefersReducedMotion) startLoop();
  });

  ro.observe(shell);
  shell.addEventListener("pointermove", onPointerMove);
  shell.addEventListener("pointerleave", onPointerLeave);

  resize();

  if (prefersReducedMotion) {
    clear();
    drawHelix();
    for (let i = 0; i < particles.length; i++) particles[i].draw();
    connect();
  } else {
    startLoop();
  }

  window.addEventListener(
    "pagehide",
    () => {
      ro.disconnect();
      shell.removeEventListener("pointermove", onPointerMove);
      shell.removeEventListener("pointerleave", onPointerLeave);
      stopLoop();
    },
    { once: true }
  );
})();
