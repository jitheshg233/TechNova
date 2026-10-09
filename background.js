/**
 * ========================================================
 * NOVADECK — LIVE MOVING WALLPAPER & UI ANIMATION ENGINE
 * File: background.js
 * 
 * Features:
 * 1. Fullscreen interactive canvas live wallpaper:
 *    - Floating particles with dynamic connecting lines (constellation mesh)
 *    - Reactive mouse repulsion, cursor connection lines, and parallax depth
 *    - Adapts to active stage mood (Learn, Quiz, Results) & Dark/Light theme
 *    - Low-power mobile throttling and 60 FPS delta-time physics
 *    - Page Visibility API tab pause & prefers-reduced-motion compliance
 * 2. IntersectionObserver reveal-on-scroll coordinator
 * ========================================================
 */

(function () {
  "use strict";

  /* ========================================================
     CONFIGURATION OBJECT
     Tweak speed, particle density, interaction radius & colors here!
     ======================================================== */
  const WALLPAPER_CONFIG = {
    // Particle count: automatically halved on screens < 768px for mobile battery efficiency
    particleCountDesktop: 70,
    particleCountMobile: 32,

    // Movement & physics
    baseSpeed: 0.55,                // Base velocity multiplier (pixels per frame)
    maxSpeed: 1.1,                  // Maximum velocity cap
    connectionDistanceDesktop: 125, // Maximum distance to draw connecting line
    connectionDistanceMobile: 85,   // Mobile line distance cap
    lineWidth: 1.0,                 // Line stroke thickness

    // Mouse interactivity
    mouseRadius: 140,               // Radius of cursor interaction zone
    mouseRepelStrength: 0.85,       // Strength of particle repulsion from cursor
    mouseConnectEnabled: true,      // Draw connecting lines between cursor and nearby nodes
    parallaxStrength: 0.035,        // Subtle camera parallax offset based on cursor position

    // Visual styles
    particleRadiusMin: 1.8,
    particleRadiusMax: 3.4,
    nodeGlowHalo: true,             // Draw soft radial aura around larger nodes

    // Themes & Stage Mood Colors
    palettes: {
      dark: {
        backgroundTop: "#080a14",
        backgroundBottom: "#0e122b",
        // Stage 1 (Learn): Electric Purple & Cyan
        moodLearn: ["#8b5cf6", "#06b6d4", "#6366f1", "#a78bfa", "#38bdf8"],
        // Stage 2 (Quiz): Cyan, Neon Indigo & Pink
        moodQuiz: ["#06b6d4", "#6366f1", "#ec4899", "#818cf8", "#f43f5e"],
        // Stage 3 (Results): Golden Amber, Emerald & Cosmic Purple
        moodResults: ["#f59e0b", "#10b981", "#8b5cf6", "#fbbf24", "#34d399"],
        lineColorRgb: "139, 92, 246",       // RGB for distance-alpha line calculations
        mouseLineColorRgb: "6, 182, 212"    // RGB for cursor-to-node line
      },
      light: {
        backgroundTop: "#f8fafc",
        backgroundBottom: "#eef2ff",
        moodLearn: ["#7c3aed", "#0891b2", "#4f46e5", "#8b5cf6", "#0284c7"],
        moodQuiz: ["#0891b2", "#4f46e5", "#db2777", "#6366f1", "#e11d48"],
        moodResults: ["#d97706", "#059669", "#7c3aed", "#f59e0b", "#10b981"],
        lineColorRgb: "99, 102, 241",
        mouseLineColorRgb: "8, 145, 178"
      }
    }
  };

  /* Expose configuration globally for live runtime console tweaking */
  window.NovaDeckWallpaperConfig = WALLPAPER_CONFIG;

  /* ========================================================
     CLASS: InteractiveConstellationWallpaper
     ======================================================== */
  class InteractiveConstellationWallpaper {
    constructor() {
      this.canvas = null;
      this.ctx = null;
      this.particles = [];
      this.animId = null;
      this.lastTimestamp = 0;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for mobile efficiency

      // State
      this.isPaused = false;
      this.prefersReducedMotion = false;
      this.currentTheme = "dark";
      this.currentMood = "mood-learn";

      // Mouse tracking with smooth damping
      this.mouse = {
        x: -9999,
        y: -9999,
        targetX: -9999,
        targetY: -9999,
        active: false,
        parallaxX: 0,
        parallaxY: 0
      };

      this.init();
    }

    init() {
      // Find or create canvas
      this.canvas = document.getElementById("wallpaper-canvas");
      if (!this.canvas) {
        this.canvas = document.createElement("canvas");
        this.canvas.id = "wallpaper-canvas";
        this.canvas.className = "wallpaper-canvas";
        this.canvas.setAttribute("aria-hidden", "true");
        document.body.prepend(this.canvas);
      }

      this.ctx = this.canvas.getContext("2d", { alpha: false });
      if (!this.ctx) return;

      // Check user accessibility preference
      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.prefersReducedMotion = motionQuery.matches;
      motionQuery.addEventListener("change", (e) => {
        this.prefersReducedMotion = e.matches;
        if (this.prefersReducedMotion) {
          this.renderStaticFrame();
        } else {
          this.startLoop();
        }
      });

      // Bind events
      this.handleResize = this.handleResize.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseLeave = this.handleMouseLeave.bind(this);
      this.handleVisibilityChange = this.handleVisibilityChange.bind(this);

      window.addEventListener("resize", this.handleResize, { passive: true });
      window.addEventListener("mousemove", this.handleMouseMove, { passive: true });
      window.addEventListener("mouseleave", this.handleMouseLeave, { passive: true });
      document.addEventListener("visibilitychange", this.handleVisibilityChange);

      // Observe theme & stage changes
      this.detectThemeAndMood();
      this.observeDOMChanges();

      // Configure resolution & spawn particles
      this.resizeCanvas();
      this.spawnParticles();

      if (this.prefersReducedMotion) {
        this.renderStaticFrame();
      } else {
        this.startLoop();
      }
    }

    detectThemeAndMood() {
      const themeAttr = document.documentElement.getAttribute("data-theme");
      this.currentTheme = themeAttr === "light" ? "light" : "dark";

      const auroraEl = document.getElementById("aurora-bg");
      if (auroraEl) {
        if (auroraEl.classList.contains("mood-quiz")) {
          this.currentMood = "mood-quiz";
        } else if (auroraEl.classList.contains("mood-results")) {
          this.currentMood = "mood-results";
        } else {
          this.currentMood = "mood-learn";
        }
      }
    }

    observeDOMChanges() {
      // Watch for data-theme on <html>
      const themeObserver = new MutationObserver(() => {
        this.detectThemeAndMood();
        this.refreshParticleColors();
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"]
      });

      // Watch for mood changes on #aurora-bg
      const auroraEl = document.getElementById("aurora-bg");
      if (auroraEl) {
        const moodObserver = new MutationObserver(() => {
          this.detectThemeAndMood();
          this.refreshParticleColors();
        });
        moodObserver.observe(auroraEl, {
          attributes: true,
          attributeFilter: ["class"]
        });
      }
    }

    getActiveColors() {
      const themePalette = WALLPAPER_CONFIG.palettes[this.currentTheme] || WALLPAPER_CONFIG.palettes.dark;
      let colors;
      if (this.currentMood === "mood-quiz") {
        colors = themePalette.moodQuiz;
      } else if (this.currentMood === "mood-results") {
        colors = themePalette.moodResults;
      } else {
        colors = themePalette.moodLearn;
      }
      return {
        bgTop: themePalette.backgroundTop,
        bgBottom: themePalette.backgroundBottom,
        particles: colors,
        lineRgb: themePalette.lineColorRgb,
        mouseLineRgb: themePalette.mouseLineColorRgb
      };
    }

    refreshParticleColors() {
      const active = this.getActiveColors();
      for (const p of this.particles) {
        p.color = active.particles[Math.floor(Math.random() * active.particles.length)];
      }
    }

    resizeCanvas() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);

      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;

      this.ctx.scale(this.dpr, this.dpr);
    }

    handleResize() {
      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(() => {
        this.resizeCanvas();
        this.spawnParticles();
        if (this.prefersReducedMotion) {
          this.renderStaticFrame();
        }
      }, 150);
    }

    handleMouseMove(e) {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
      this.mouse.active = true;

      // Parallax target (normalized from center -1 to 1)
      const centerX = this.width / 2;
      const centerY = this.height / 2;
      this.mouse.parallaxX = ((e.clientX - centerX) / centerX) * 20 * WALLPAPER_CONFIG.parallaxStrength;
      this.mouse.parallaxY = ((e.clientY - centerY) / centerY) * 20 * WALLPAPER_CONFIG.parallaxStrength;
    }

    handleMouseLeave() {
      this.mouse.active = false;
      this.mouse.targetX = -9999;
      this.mouse.targetY = -9999;
      this.mouse.parallaxX = 0;
      this.mouse.parallaxY = 0;
    }

    handleVisibilityChange() {
      if (document.hidden) {
        this.isPaused = true;
        if (this.animId) {
          cancelAnimationFrame(this.animId);
          this.animId = null;
        }
      } else {
        this.isPaused = false;
        this.lastTimestamp = performance.now();
        if (!this.prefersReducedMotion) {
          this.startLoop();
        }
      }
    }

    spawnParticles() {
      const isMobile = this.width < 768;
      const targetCount = isMobile
        ? WALLPAPER_CONFIG.particleCountMobile
        : WALLPAPER_CONFIG.particleCountDesktop;

      const active = this.getActiveColors();
      this.particles = [];

      for (let i = 0; i < targetCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 0.7 + 0.3) * WALLPAPER_CONFIG.baseSpeed;
        const radius = Math.random() * (WALLPAPER_CONFIG.particleRadiusMax - WALLPAPER_CONFIG.particleRadiusMin) + WALLPAPER_CONFIG.particleRadiusMin;

        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          originX: Math.random() * this.width,
          originY: Math.random() * this.height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: radius,
          baseRadius: radius,
          color: active.particles[Math.floor(Math.random() * active.particles.length)],
          alpha: Math.random() * 0.45 + 0.35,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
    }

    startLoop() {
      if (this.animId || this.isPaused || this.prefersReducedMotion) return;
      this.lastTimestamp = performance.now();
      const loop = (timestamp) => {
        // Delta time computation (capped at 60Hz delta to prevent position jumping)
        const dt = Math.min((timestamp - this.lastTimestamp) / 16.666, 2.0);
        this.lastTimestamp = timestamp;

        this.update(dt);
        this.draw();

        if (!this.isPaused && !this.prefersReducedMotion) {
          this.animId = requestAnimationFrame(loop);
        } else {
          this.animId = null;
        }
      };
      this.animId = requestAnimationFrame(loop);
    }

    update(dt) {
      // Smooth mouse lerp
      if (this.mouse.active) {
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.15;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.15;
      } else {
        this.mouse.x = -9999;
        this.mouse.y = -9999;
      }

      const isMobile = this.width < 768;
      const maxConnDist = isMobile
        ? WALLPAPER_CONFIG.connectionDistanceMobile
        : WALLPAPER_CONFIG.connectionDistanceDesktop;
      const mouseRadius = WALLPAPER_CONFIG.mouseRadius;

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        // Normal drift
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Subtle pulsing
        p.pulsePhase += p.pulseSpeed * dt;
        p.radius = p.baseRadius + Math.sin(p.pulsePhase) * 0.6;

        // Subtle parallax displacement
        const targetOffsetX = this.mouse.parallaxX * (p.baseRadius * 0.6);
        const targetOffsetY = this.mouse.parallaxY * (p.baseRadius * 0.6);
        p.x += targetOffsetX * 0.05;
        p.y += targetOffsetY * 0.05;

        // Cursor repulsion
        if (this.mouse.active) {
          const dx = p.x - this.mouse.x;
          const dy = p.y - this.mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouseRadius && dist > 0.001) {
            const force = (1 - dist / mouseRadius) * WALLPAPER_CONFIG.mouseRepelStrength;
            const nx = dx / dist;
            const ny = dy / dist;
            p.x += nx * force * 5.0 * dt;
            p.y += ny * force * 5.0 * dt;
          }
        }

        // Screen boundary wrapping with soft padding
        const pad = 20;
        if (p.x < -pad) p.x = this.width + pad;
        if (p.x > this.width + pad) p.x = -pad;
        if (p.y < -pad) p.y = this.height + pad;
        if (p.y > this.height + pad) p.y = -pad;
      }
    }

    draw() {
      const active = this.getActiveColors();
      const ctx = this.ctx;

      // 1. Draw rich background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
      bgGrad.addColorStop(0, active.bgTop);
      bgGrad.addColorStop(1, active.bgBottom);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, this.width, this.height);

      // 2. Draw connecting lines between close particles
      const isMobile = this.width < 768;
      const maxConnDist = isMobile
        ? WALLPAPER_CONFIG.connectionDistanceMobile
        : WALLPAPER_CONFIG.connectionDistanceDesktop;
      const maxConnDistSq = maxConnDist * maxConnDist;

      ctx.lineWidth = WALLPAPER_CONFIG.lineWidth;

      for (let i = 0; i < this.particles.length; i++) {
        const p1 = this.particles[i];

        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxConnDistSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxConnDist) * 0.22;
            ctx.strokeStyle = `rgba(${active.lineRgb}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // 3. Draw connecting line to mouse cursor if within range
        if (WALLPAPER_CONFIG.mouseConnectEnabled && this.mouse.active) {
          const mdx = p1.x - this.mouse.x;
          const mdy = p1.y - this.mouse.y;
          const mDist = Math.hypot(mdx, mdy);
          if (mDist < WALLPAPER_CONFIG.mouseRadius) {
            const mAlpha = (1 - mDist / WALLPAPER_CONFIG.mouseRadius) * 0.38;
            ctx.strokeStyle = `rgba(${active.mouseLineRgb}, ${mAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(this.mouse.x, this.mouse.y);
            ctx.stroke();
          }
        }
      }

      // 4. Draw particle nodes & glowing halos
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        // Soft halo on larger nodes
        if (WALLPAPER_CONFIG.nodeGlowHalo && p.baseRadius >= 2.4) {
          const haloGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.8);
          haloGrad.addColorStop(0, p.color);
          haloGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.globalAlpha = p.alpha * 0.35;
          ctx.fillStyle = haloGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core dot
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(p.radius, 1), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
    }

    renderStaticFrame() {
      // For users with prefers-reduced-motion: draw a single calm frame
      this.update(1.0);
      this.draw();
    }
  }

  /* ========================================================
     INTERSECTION OBSERVER REVEAL-ON-SCROLL & STAGGER ENGINE
     ======================================================== */
  class UIAnimationCoordinator {
    constructor() {
      this.observer = null;
      this.init();
    }

    init() {
      // 1. Initialize Reveal on Scroll Observer
      if ("IntersectionObserver" in window) {
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                // Stop observing once animated
                this.observer.unobserve(entry.target);
              }
            });
          },
          {
            root: null,
            rootMargin: "0px 0px -40px 0px",
            threshold: 0.12
          }
        );

        this.attachScrollTargets();
      }

      // 2. Add dynamic button ripple enhancement & magnetic hover
      this.attachButtonEnhancements();

      // 3. Re-scan targets on stage switches
      this.observeStageSwitches();
    }

    attachScrollTargets() {
      // Select elements across all stages for scroll reveal
      const selectors = [
        ".learn-hero",
        ".deck-hud",
        ".learn-controls-row",
        ".quiz-unlock-box",
        ".quiz-hud-bar",
        ".quiz-main-card",
        ".results-header-box",
        ".radial-gauge-wrapper",
        ".matrix-card",
        ".category-breakdown-section",
        ".analysis-card-box",
        ".mistakes-review-section",
        ".results-cta-actions"
      ];

      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          if (!el.classList.contains("revealed")) {
            el.classList.add("reveal-on-scroll");
            if (this.observer) {
              this.observer.observe(el);
            }
          }
        });
      });
    }

    attachButtonEnhancements() {
      // Magnetic hover tilt effect on main interactive CTAs
      const ctas = document.querySelectorAll(".control-btn, .launch-quiz-btn, .results-btn, .nav-btn");
      ctas.forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          btn.style.transform = `translate(${x * 0.08}px, ${y * 0.08 - 2}px)`;
        });

        btn.addEventListener("mouseleave", () => {
          btn.style.transform = "";
        });
      });
    }

    observeStageSwitches() {
      // Re-observe newly displayed stage contents when pills or buttons are clicked
      const stageContainer = document.querySelector(".stage-viewport");
      if (stageContainer) {
        const stageObserver = new MutationObserver(() => {
          setTimeout(() => {
            this.attachScrollTargets();
          }, 60);
        });
        stageObserver.observe(stageContainer, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["class"]
        });
      }
    }
  }

  /* ========================================================
     BOOTSTRAP ON DOM READY
     ======================================================== */
  function startEnhancements() {
    // Instantiate Live Moving Wallpaper
    window.novaDeckWallpaper = new InteractiveConstellationWallpaper();

    // Instantiate UI Animation Coordinator
    window.novaDeckAnimationCoordinator = new UIAnimationCoordinator();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startEnhancements);
  } else {
    startEnhancements();
  }
})();
