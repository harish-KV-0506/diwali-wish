"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  trail?: { x: number; y: number }[];
};

const PALETTES = [
  ["#ffd54f", "#ff8a00", "#ffb300"],
  ["#ff4081", "#e91e63", "#f50057"],
  ["#b388ff", "#6a1b9a", "#9c27b0"],
  ["#fff4cc", "#ffd54f", "#ffffff"],
  ["#ff8a00", "#e91e63", "#ffd54f"],
];

export default function FireworksLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | undefined>(undefined);
  const rocketsRef = useRef<
    { x: number; y: number; vx: number; vy: number; targetY: number; color: string; trail: { x: number; y: number }[] }[]
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const launch = (targetX: number, targetY: number) => {
      // Launch from bottom of screen toward click point
      const startX = targetX + (Math.random() - 0.5) * 80;
      const startY = window.innerHeight + 10;
      const dx = targetX - startX;
      const dy = targetY - startY;
      const dist = Math.hypot(dx, dy);
      const speed = 11 + Math.random() * 4;
      const vx = (dx / dist) * speed;
      const vy = (dy / dist) * speed;
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      rocketsRef.current.push({
        x: startX,
        y: startY,
        vx,
        vy,
        targetY,
        color: palette[0],
        trail: [],
      });
    };

    const explode = (x: number, y: number) => {
      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      const count = 80 + Math.floor(Math.random() * 60);
      const ring = Math.random() > 0.5;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const speed = ring ? 4 + Math.random() * 0.5 : 2 + Math.random() * 5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 70 + Math.random() * 40,
          color: palette[i % palette.length],
          size: 2 + Math.random() * 1.5,
          trail: [],
        });
      }
      // Add some glitter
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 6;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 100 + Math.random() * 60,
          color: "#ffffff",
          size: 1,
        });
      }
    };

    const tick = () => {
      // Fade existing pixels to transparent (preserves trails but doesn't paint over content beneath)
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "source-over";

      // Rockets
      const rockets = rocketsRef.current;
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 8) r.trail.shift();
        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.18; // gravity slows upward motion

        // Draw trail
        for (let j = 0; j < r.trail.length; j++) {
          const t = r.trail[j];
          const alpha = j / r.trail.length;
          ctx.fillStyle = `${r.color}${Math.round(alpha * 200).toString(16).padStart(2, "0")}`;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 2 * alpha, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw rocket head
        ctx.fillStyle = r.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = r.color;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Explode when reaching target or apex
        if (r.y <= r.targetY || r.vy >= 0) {
          explode(r.x, r.y);
          rockets.splice(i, 1);
        }
      }

      // Particles
      const ps = particlesRef.current;
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life++;
        if (p.life > p.maxLife) {
          ps.splice(i, 1);
          continue;
        }
        p.vy += 0.06; // gravity
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;

        const alpha = 1 - p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const handleClick = (e: MouseEvent) => {
      // Don't trigger when clicking on form controls / buttons / inputs
      const target = e.target as HTMLElement;
      if (target.closest("button, input, textarea, a, select, label, [role='button']")) return;
      launch(e.clientX, e.clientY);
    };
    const handleTouch = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, input, textarea, a, select, label, [role='button']")) return;
      const t = e.touches[0];
      if (t) launch(t.clientX, t.clientY);
    };
    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleTouch, { passive: true });

    // Auto-fire a celebratory burst every ~6 seconds for ambient feel
    const autoTimer = window.setInterval(() => {
      if (document.hidden) return;
      const x = window.innerWidth * (0.2 + Math.random() * 0.6);
      const y = window.innerHeight * (0.2 + Math.random() * 0.3);
      launch(x, y);
    }, 7000);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleTouch);
      window.clearInterval(autoTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30"
      aria-hidden="true"
    />
  );
}
