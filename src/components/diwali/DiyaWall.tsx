"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flame, Sparkles, Users } from "lucide-react";
import { addDiya, getDiyaCount } from "@/lib/wish-store";

type Diya = {
  id: number;
  flame: string;
  glow: string;
  bowl: string;
  angle: number;
  delay: number;
};

const PALETTE = [
  { flame: "#ffb300", glow: "#ff8a00", bowl: "#9c4a1c" },
  { flame: "#ff4081", glow: "#e91e63", bowl: "#6a1b9a" },
  { flame: "#ffd54f", glow: "#ffb300", bowl: "#7a3a1a" },
  { flame: "#ff80ab", glow: "#f50057", bowl: "#8e2444" },
  { flame: "#b388ff", glow: "#6a1b9a", bowl: "#4a148c" },
];

export default function DiyaWall() {
  const [diyas, setDiyas] = useState<Diya[]>([]);
  const [count, setCount] = useState(0);
  const [justLit, setJustLit] = useState(false);

  useEffect(() => {
    setCount(getDiyaCount());
  }, []);

  const lightDiya = () => {
    const newCount = addDiya();
    setCount(newCount);
    const palette = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const angle = Math.random() * 360;
    const diya: Diya = {
      id: newCount,
      ...palette,
      angle,
      delay: Math.random() * 0.3,
    };
    setDiyas((d) => [...d, diya].slice(-40));
    setJustLit(true);
    setTimeout(() => setJustLit(false), 600);
  };

  return (
    <section id="light-a-diya" className="relative w-full px-4 py-20 md:py-28">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8">
        {/* Heading */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ff4081]/30 bg-[#ff4081]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#ff4081]">
            <Flame className="h-3 w-3" /> Light a Diya
          </div>
          <h2
            className="text-4xl font-bold leading-tight md:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="gradient-text-mandala">Light Up the Wall</span>
          </h2>
          <p className="max-w-2xl text-base text-[#fff4e6]/80 md:text-lg">
            Every diya you light joins a glowing wall — a small act of spreading light.
            Tap the button to add yours. The counter remembers across visits.
          </p>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-6 rounded-2xl border border-[#ffd54f]/25 bg-[#15001f]/60 px-6 py-3">
          <div className="flex items-center gap-2 text-[#ffd54f]">
            <Flame className="h-5 w-5 flicker" />
            <span className="text-2xl font-bold glow-text-soft">{count}</span>
            <span className="text-xs uppercase tracking-wider text-[#fff4e6]/60">lit by you</span>
          </div>
          <div className="h-8 w-px bg-[#ffd54f]/20" />
          <div className="flex items-center gap-2 text-[#ff4081]">
            <Users className="h-4 w-4" />
            <span className="text-sm text-[#fff4e6]/70">Spreading light, one diya at a time</span>
          </div>
        </div>

        {/* The diya wall — radial display */}
        <div className="relative aspect-square w-full max-w-[520px] overflow-hidden rounded-3xl border border-[#ffd54f]/20 bg-gradient-to-b from-[#2d0a2e]/40 to-[#15001f]/80">
          {/* Radial guides */}
          <div className="absolute inset-1/4 rounded-full border border-dashed border-[#ffd54f]/15" />
          <div className="absolute inset-[15%] rounded-full border border-dashed border-[#ffd54f]/10" />
          <div className="absolute inset-[35%] rounded-full border border-dashed border-[#ffd54f]/10" />

          {/* Central prompt when empty */}
          {diyas.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
              <Flame className="h-10 w-10 text-[#ffd54f]/40" />
              <p className="text-sm text-[#fff4e6]/50">No diyas lit yet.</p>
              <p className="text-xs text-[#fff4e6]/40">Be the first to light one ✨</p>
            </div>
          )}

          {/* Rendered diyas in concentric positions */}
          <AnimatePresence>
            {diyas.map((d, i) => {
              const ring = Math.floor(i / 12);
              const inRing = i % 12;
              const angle = (inRing / 12) * Math.PI * 2 + ring * 0.3;
              const radius = 30 + ring * 18; // percent from center
              const left = 50 + Math.cos(angle) * radius;
              const top = 50 + Math.sin(angle) * radius;
              return (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: d.delay }}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <div
                    className="h-4 w-1.5 flicker rounded-full"
                    style={{
                      background: d.flame,
                      boxShadow: `0 0 10px ${d.flame}, 0 0 24px ${d.glow}`,
                      animationDelay: `${d.delay}s`,
                    }}
                  />
                  <div
                    className="-mt-0.5 h-1.5 w-4 rounded-b-full"
                    style={{ background: d.bowl }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <Button
          onClick={lightDiya}
          className={`btn-shimmer h-14 rounded-full px-10 bg-gradient-to-r from-[#ff8a00] via-[#e91e63] to-[#ff4081] text-base font-bold uppercase tracking-wider text-[#15001f] hover:brightness-110 ${
            justLit ? "scale-110" : ""
          } transition-transform`}
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Light a Diya
        </Button>
        <p className="text-xs text-[#fff4e6]/50">
          Each tap adds one diya. The counter persists on this device.
        </p>
      </div>
    </section>
  );
}
