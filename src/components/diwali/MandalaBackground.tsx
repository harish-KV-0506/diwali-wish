"use client";

import { useMemo } from "react";

/* Decorative SVG mandala that rotates via CSS .spin-* classes */
function MandalaSVG({
  size = 320,
  colorA = "#ffd54f",
  colorB = "#e91e63",
  colorC = "#ff8a00",
  opacity = 0.4,
}: {
  size?: number;
  colorA?: string;
  colorB?: string;
  colorC?: string;
  opacity?: number;
}) {
  const petals = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * 360;
      return { angle, key: i };
    });
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{ opacity, overflow: "visible" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="petalGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colorA} stopOpacity="0.95" />
          <stop offset="60%" stopColor={colorC} stopOpacity="0.8" />
          <stop offset="100%" stopColor={colorB} stopOpacity="0.4" />
        </radialGradient>
      </defs>

      {/* Outer ring */}
      <circle cx="100" cy="100" r="92" fill="none" stroke={colorA} strokeWidth="0.6" strokeDasharray="2 3" opacity="0.5" />
      <circle cx="100" cy="100" r="84" fill="none" stroke={colorC} strokeWidth="0.4" opacity="0.6" />

      {/* Petals ring 1 */}
      <g>
        {petals.map((p) => (
          <g key={p.key} transform={`rotate(${p.angle} 100 100)`}>
            <path
              d="M 100 22 C 108 38 108 56 100 70 C 92 56 92 38 100 22 Z"
              fill="url(#petalGrad)"
              opacity="0.85"
            />
            <circle cx="100" cy="30" r="1.2" fill={colorA} />
          </g>
        ))}
      </g>

      {/* Petals ring 2 — smaller, reversed color */}
      <g transform="rotate(11.25 100 100)">
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * 360;
          return (
            <g key={i} transform={`rotate(${angle} 100 100)`}>
              <path
                d="M 100 50 C 105 60 105 72 100 82 C 95 72 95 60 100 50 Z"
                fill={colorB}
                opacity="0.7"
              />
            </g>
          );
        })}
      </g>

      {/* Inner lotus */}
      <g>
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * 360;
          return (
            <g key={i} transform={`rotate(${angle} 100 100)`}>
              <path
                d="M 100 70 C 104 78 104 86 100 92 C 96 86 96 78 100 70 Z"
                fill={colorA}
                opacity="0.9"
              />
            </g>
          );
        })}
      </g>

      {/* Center bead */}
      <circle cx="100" cy="100" r="6" fill={colorA} />
      <circle cx="100" cy="100" r="3" fill={colorC} />
    </svg>
  );
}

/* A single twinkling star/diya spark */
function Twinkle({
  left,
  top,
  size = 3,
  delay = 0,
  color = "#ffd54f",
}: {
  left: number;
  top: number;
  size?: number;
  delay?: number;
  color?: string;
}) {
  return (
    <div
      className="twinkle absolute rounded-full"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

/* The full animated background — mandalas + stars + gradient washes */
export default function MandalaBackground() {
  // Generate stable star positions — deterministic to avoid SSR/CSR hydration mismatch
  const stars = useMemo(() => {
    // simple seeded pseudo-random so server and client render identical stars
    let seed = 1337;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: 2 + rand() * 3,
      delay: rand() * 3,
      color: ["#ffd54f", "#ff8a00", "#ff4081", "#e91e63"][i % 4],
    }));
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 10%, rgba(106,27,154,0.55), transparent 50%)," +
            "radial-gradient(ellipse at 80% 30%, rgba(233,30,99,0.35), transparent 50%)," +
            "radial-gradient(ellipse at 50% 90%, rgba(255,138,0,0.3), transparent 50%)," +
            "linear-gradient(180deg, #15001f 0%, #2d0a2e 50%, #15001f 100%)",
        }}
      />

      {/* Rotating mandalas — large, faint, behind everything */}
      <div className="absolute -left-32 -top-32 spin-slow" style={{ opacity: 0.35 }}>
        <MandalaSVG size={520} colorA="#ffd54f" colorB="#e91e63" colorC="#ff8a00" opacity={0.35} />
      </div>
      <div className="absolute -right-40 top-1/3 spin-reverse" style={{ opacity: 0.3 }}>
        <MandalaSVG size={620} colorA="#ff4081" colorB="#ffd54f" colorC="#e91e63" opacity={0.3} />
      </div>
      <div className="absolute left-1/4 -bottom-48 spin-medium" style={{ opacity: 0.28 }}>
        <MandalaSVG size={700} colorA="#ff8a00" colorB="#e91e63" colorC="#ffd54f" opacity={0.28} />
      </div>
      <div className="absolute -right-20 -bottom-32 spin-fast" style={{ opacity: 0.25 }}>
        <MandalaSVG size={400} colorA="#ffd54f" colorB="#ff4081" colorC="#ff8a00" opacity={0.25} />
      </div>

      {/* Twinkling sparks */}
      {stars.map((s) => (
        <Twinkle key={s.id} left={s.left} top={s.top} size={s.size} delay={s.delay} color={s.color} />
      ))}

      {/* Bottom vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(21,0,31,0.6) 100%)" }}
      />
    </div>
  );
}
