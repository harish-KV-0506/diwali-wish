"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Chapter = {
  id: string;
  chapter: string;
  title: string;
  body: string;
  emoji: string;
  sceneColor: string;
  accentColor: string;
};

const CHAPTERS: Chapter[] = [
  {
    id: "exile",
    chapter: "Chapter I",
    title: "The Exile of Rama",
    body: "Long ago, in the kingdom of Ayodhya, Prince Rama — eldest son of King Dasharatha — was to be crowned heir. But a queen's old promise changed destiny. Honor-bound, Rama accepted fourteen years of forest exile, accompanied by his wife Sita and his loyal brother Lakshmana. The trio traded palace silk for forest leaves, choosing duty over the throne.",
    emoji: "🏹",
    sceneColor: "#6a1b9a",
    accentColor: "#ffd54f",
  },
  {
    id: "abduction",
    chapter: "Chapter II",
    title: "Sita's Abduction",
    body: "In the deep forest, the demon-king Ravana of Lanka coveted Sita. He sent a golden deer as a ruse; while Rama and Lakshmana gave chase, Ravana came disguised as a wandering sage and carried Sita away in his flying chariot, the Pushpaka Vimana. Across oceans she was borne, into the fortress of Lanka — where she waited, unbroken, for her lord.",
    emoji: "🦌",
    sceneColor: "#e91e63",
    accentColor: "#ff8a00",
  },
  {
    id: "bridge",
    chapter: "Chapter III",
    title: "The Bridge to Lanka",
    body: "Rama and Lakshmana sought the aid of Hanuman and the Vanara army — monkey warriors of immense strength. Together they built a stone bridge across the ocean, the Ram Setu, each inscribed stone floating by Rama's name. Millions of stones, millions of hands, one sacred path — bridging the impossible.",
    emoji: "🐒",
    sceneColor: "#ff8a00",
    accentColor: "#ffd54f",
  },
  {
    id: "victory",
    chapter: "Chapter IV",
    title: "Ravana's Defeat",
    body: "War engulfed Lanka. Rama, armed with the divine bow, faced the ten-headed Ravana in a battle that shook the heavens. With an arrow blessed by the gods, Rama struck the fatal blow. Truth conquered ego. Light pierced the darkness. Sita was freed — her purity proven by fire itself. Righteousness returned victorious.",
    emoji: "⚔️",
    sceneColor: "#f50057",
    accentColor: "#ffd54f",
  },
  {
    id: "return",
    chapter: "Chapter V",
    title: "The Return & The First Diwali",
    body: "On the darkest night of the month — Amavasya — Rama, Sita, and Lakshmana flew home to Ayodhya. The people, joyous, lit rows upon rows of clay lamps — diyas — to guide their king through the night. Every doorstep glowed. The night became brighter than day. That first Festival of Lights — Deepavali — was born. And every year since, we light our lamps: a reminder that light will always conquer darkness, and good will always return home.",
    emoji: "🪔",
    sceneColor: "#ffb300",
    accentColor: "#e91e63",
  },
];

/* Parallax SVG scene illustration per chapter */
function SceneIllustration({ chapter, color, accent }: { chapter: Chapter; color: string; accent: string }) {
  if (chapter.id === "exile") {
    return (
      <svg viewBox="0 0 400 400" className="h-full w-full">
        {/* Forest silhouette */}
        <defs>
          <radialGradient id="exileBg" cx="50%" cy="40%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </radialGradient>
        </defs>
        <rect width="400" height="400" fill="url(#exileBg)" />
        {/* Trees */}
        {[40, 110, 180, 250, 320, 360].map((x, i) => (
          <g key={i}>
            <path d={`M ${x} 400 L ${x} 280`} stroke="#3a1a0a" strokeWidth="6" />
            <circle cx={x} cy="270" r={20 + i % 3 * 6} fill={color} opacity="0.7" />
            <circle cx={x - 8} cy="260" r={14} fill={accent} opacity="0.5" />
            <circle cx={x + 8} cy="280" r={14} fill={accent} opacity="0.5" />
          </g>
        ))}
        {/* Three figures walking — Rama, Sita, Lakshmana */}
        <g transform="translate(180 320)">
          <circle cx="0" cy="-30" r="6" fill="#ffd54f" />
          <rect x="-4" y="-25" width="8" height="22" rx="2" fill="#ff8a00" />
          <circle cx="20" cy="-28" r="5" fill="#fff4cc" />
          <rect x="16" y="-23" width="8" height="20" rx="2" fill="#e91e63" />
          <circle cx="-20" cy="-28" r="5" fill="#ffd54f" />
          <rect x="-24" y="-23" width="8" height="20" rx="2" fill="#ffb300" />
        </g>
        {/* Crescent moon */}
        <circle cx="320" cy="80" r="22" fill={accent} opacity="0.85" />
        <circle cx="330" cy="78" r="20" fill="#15001f" />
      </svg>
    );
  }
  if (chapter.id === "abduction") {
    return (
      <svg viewBox="0 0 400 400" className="h-full w-full">
        <defs>
          <linearGradient id="abBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6a1b9a" stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#abBg)" />
        {/* Pushpaka vimana chariot */}
        <g transform="translate(200 180)">
          <ellipse cx="0" cy="0" rx="60" ry="20" fill={color} />
          <ellipse cx="0" cy="-10" rx="50" ry="14" fill={accent} />
          <rect x="-30" y="-30" width="60" height="20" rx="4" fill="#ffd54f" />
          {/* Ravana's 10 heads */}
          {[-30, -18, -8, 2, 12, 22, 32].map((x, i) => (
            <circle key={i} cx={x} cy={-40} r="5" fill="#f50057" />
          ))}
          {/* Tail flames */}
          <path d="M -60 0 Q -90 -10 -100 5 Q -85 0 -60 10 Z" fill="#ff8a00" opacity="0.7" />
        </g>
        {/* Forest below */}
        {[20, 70, 130, 220, 280, 350].map((x, i) => (
          <path key={i} d={`M ${x} 400 L ${x} 360 L ${x + 20} 360 L ${x + 20} 400`} stroke="#3a1a0a" strokeWidth="2" fill={color} opacity="0.4" />
        ))}
        {/* Stars */}
        {[40, 80, 120, 350, 380].map((x, i) => (
          <circle key={i} cx={x} cy={50 + i * 10} r="1.5" fill="#ffd54f" />
        ))}
      </svg>
    );
  }
  if (chapter.id === "bridge") {
    return (
      <svg viewBox="0 0 400 400" className="h-full w-full">
        <defs>
          <linearGradient id="brBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.3" />
            <stop offset="60%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1a237e" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#brBg)" />
        {/* Sun */}
        <circle cx="200" cy="120" r="30" fill={accent} opacity="0.85" />
        {/* Ocean */}
        <path d="M 0 250 Q 100 240 200 250 T 400 250 L 400 400 L 0 400 Z" fill="#1a237e" opacity="0.6" />
        <path d="M 0 260 Q 100 250 200 260 T 400 260" stroke={accent} strokeWidth="1" fill="none" opacity="0.6" />
        {/* Bridge of stones */}
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={20 + i * 22} y={245 - i % 3 * 3} width="18" height="10" rx="2" fill={["#ffd54f", "#ff8a00", "#e91e63"][i % 3]} opacity="0.85" />
        ))}
        {/* Vanara warriors */}
        {Array.from({ length: 5 }, (_, i) => (
          <g key={i} transform={`translate(${60 + i * 60} 235)`}>
            <circle cx="0" cy="0" r="8" fill="#7a3a1a" />
            <circle cx="0" cy="-2" r="6" fill={accent} opacity="0.7" />
            <rect x="-4" y="6" width="8" height="14" rx="2" fill="#7a3a1a" />
          </g>
        ))}
      </svg>
    );
  }
  if (chapter.id === "victory") {
    return (
      <svg viewBox="0 0 400 400" className="h-full w-full">
        <defs>
          <radialGradient id="viBg" cx="50%" cy="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.2" />
          </radialGradient>
        </defs>
        <rect width="400" height="400" fill="url(#viBg)" />
        {/* Ravana's 10 heads silhouettes */}
        <g transform="translate(280 240)">
          {[-30, -20, -10, 0, 10, 20, 30, -25, 5, 25].map((x, i) => (
            <circle key={i} cx={x} cy={i < 7 ? 0 : -10} r="8" fill="#2d0a2e" stroke={color} strokeWidth="1.5" />
          ))}
          <rect x="-20" y="10" width="40" height="50" fill="#2d0a2e" stroke={color} strokeWidth="1.5" />
        </g>
        {/* Rama's arrow — divine glowing line */}
        <line x1="60" y1="200" x2="270" y2="240" stroke={accent} strokeWidth="3" />
        <polygon points="270,240 258,232 260,246" fill={accent} />
        {/* Burst at impact */}
        <g transform="translate(270 240)">
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={0}
                y1={0}
                x2={Math.cos(a) * 18}
                y2={Math.sin(a) * 18}
                stroke={accent}
                strokeWidth="2"
                opacity="0.8"
              />
            );
          })}
        </g>
        {/* Bow */}
        <path d="M 50 230 Q 40 200 50 170" stroke={color} strokeWidth="4" fill="none" />
        {/* Light rays bursting from impact */}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI;
          return (
            <line
              key={i}
              x1="270"
              y1="240"
              x2={270 + Math.cos(a) * 80}
              y2={240 - Math.sin(a) * 80}
              stroke={accent}
              strokeWidth="1.5"
              opacity="0.4"
            />
          );
        })}
      </svg>
    );
  }
  // return / first diwali
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full">
      <defs>
        <radialGradient id="reBg" cx="50%" cy="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.7" />
          <stop offset="100%" stopColor="#15001f" stopOpacity="0.95" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#reBg)" />
      {/* Ayodhya skyline — temple domes */}
      {[60, 130, 200, 270, 340].map((x, i) => (
        <g key={i}>
          <rect x={x - 18} y="280" width="36" height="80" fill="#2d0a2e" stroke={accent} strokeWidth="1" />
          <path d={`M ${x - 22} 280 L ${x} 240 L ${x + 22} 280 Z`} fill={accent} opacity="0.8" />
          <circle cx={x} cy="240" r="3" fill={accent} />
          {/* lit windows */}
          {[0, 1, 2].map((j) => (
            <rect key={j} x={x - 8 + j * 8} y="300" width="6" height="8" fill={accent} opacity="0.95" />
          ))}
        </g>
      ))}
      {/* Rows of diyas on the ground */}
      {Array.from({ length: 14 }, (_, i) => (
        <g key={i} transform={`translate(${30 + i * 26} 360)`}>
          <ellipse cx="0" cy="0" rx="6" ry="2" fill="#9c4a1c" />
          <path d="M 0 -2 C 2 -6 -2 -6 0 -10 Z" fill={accent} />
          <circle cx="0" cy="-6" r="2" fill="#fff4cc" />
        </g>
      ))}
      {/* Light rays reaching up */}
      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={i}
          x1={50 + i * 60}
          y1="360"
          x2={50 + i * 60}
          y2="120"
          stroke={accent}
          strokeWidth="1.5"
          opacity="0.3"
        />
      ))}
      {/* Stars */}
      {[60, 100, 200, 280, 350].map((x, i) => (
        <circle key={i} cx={x} cy={50 + i * 8} r="2" fill="#fff4cc" />
      ))}
    </svg>
  );
}

function ChapterPanel({ chapter, index }: { chapter: Chapter; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax for illustration only — chapter content uses whileInView for reliable reveal
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const flip = index % 2 === 1;

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center px-4 py-16 md:px-8"
    >
      <motion.div
        initial={{ y: 30 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`glass-festive relative z-10 grid w-full max-w-6xl gap-6 rounded-3xl p-6 md:grid-cols-2 md:p-10 ${
          flip ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* Illustration */}
        <motion.div
          style={{ y }}
          className="relative aspect-square w-full overflow-hidden rounded-2xl"
        >
          <div
            className="absolute inset-0 slow-zoom"
            style={{ background: `radial-gradient(circle, ${chapter.sceneColor}40, transparent)` }}
          />
          <SceneIllustration chapter={chapter} color={chapter.sceneColor} accent={chapter.accentColor} />
          {/* Glow border */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{ boxShadow: `inset 0 0 60px ${chapter.accentColor}40` }}
          />
        </motion.div>

        {/* Text content */}
        <div className="flex flex-col justify-center gap-4">
          <div
            className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]"
            style={{ background: `${chapter.accentColor}25`, color: chapter.accentColor, border: `1px solid ${chapter.accentColor}40` }}
          >
            <span className="text-base">{chapter.emoji}</span>
            {chapter.chapter}
          </div>
          <h3
            className="text-3xl font-bold leading-tight md:text-5xl"
            style={{ fontFamily: "var(--font-display)", color: "#fff4e6" }}
          >
            <span className="glow-text-soft" style={{ color: chapter.accentColor }}>{chapter.title}</span>
          </h3>
          <p className="text-base leading-relaxed text-[#fff4e6]/85 md:text-lg">
            {chapter.body}
          </p>
          {/* Progress dots */}
          <div className="mt-2 flex gap-2">
            {CHAPTERS.map((c, i) => (
              <span
                key={c.id}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === index ? "32px" : "10px",
                  background: i === index ? chapter.accentColor : "rgba(255,244,230,0.3)",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default function StoryScroll() {
  return (
    <div className="relative" id="story">
      {/* Intro heading */}
      <div className="relative flex flex-col items-center gap-4 px-4 py-20 text-center md:py-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd54f]/30 bg-[#ffd54f]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#ffd54f]">
          ✦ The Origin of Deepavali ✦
        </div>
        <h2
          className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="gradient-text-mandala">How Diwali Was Born</span>
        </h2>
        <p className="max-w-2xl text-base text-[#fff4e6]/80 md:text-lg">
          A story older than three thousand years — of duty, devotion, and the eternal victory
          of light over darkness. Scroll to follow the journey.
        </p>
        <div className="mt-4 animate-bounce text-2xl text-[#ffd54f]">↓</div>
      </div>

      {/* Chapters */}
      {CHAPTERS.map((chapter, i) => (
        <ChapterPanel key={chapter.id} chapter={chapter} index={i} />
      ))}

      {/* Closing line */}
      <div className="flex flex-col items-center gap-3 px-4 py-20 text-center">
        <p className="max-w-2xl text-lg italic text-[#fff4e6]/85" style={{ fontFamily: "var(--font-tangerine)", fontSize: "1.6rem" }}>
          “May this Diwali burn away your shadows and refill your home with light.”
        </p>
        <p className="text-sm uppercase tracking-[0.3em] text-[#ffd54f]/70">— Shubh Deepavali</p>
      </div>
    </div>
  );
}
