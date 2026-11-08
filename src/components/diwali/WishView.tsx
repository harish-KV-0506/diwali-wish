"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Share2, Copy, Flame, Home, RefreshCw, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import type { Wish } from "@/lib/wish-store";

// Dynamically import Hero3D to avoid SSR issues with Three.js
const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false, loading: () => null });

const COLOR_MAP: Record<string, { flame: string; glow: string; bowl: string }> = {
  saffron: { flame: "#ffb300", glow: "#ff8a00", bowl: "#9c4a1c" },
  magenta: { flame: "#ff4081", glow: "#e91e63", bowl: "#6a1b9a" },
  gold: { flame: "#ffd54f", glow: "#ffb300", bowl: "#7a3a1a" },
  pink: { flame: "#ff80ab", glow: "#f50057", bowl: "#8e2444" },
  purple: { flame: "#b388ff", glow: "#6a1b9a", bowl: "#4a148c" },
};

export default function WishView({
  wish,
  onBackHome,
}: {
  wish: Wish;
  onBackHome: () => void;
}) {
  const firedRef = useRef(false);
  const [copied, setCopied] = useState(false);
  const colors = COLOR_MAP[wish.diyaColor] ?? COLOR_MAP.saffron;

  // Confetti burst on first mount
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const fireBurst = () => {
      const palette = ["#ffd54f", "#ff8a00", "#e91e63", "#ff4081", "#6a1b9a", "#ffffff"];

      // Burst 1 — center
      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.45 },
        colors: palette,
        scalar: 1.1,
        ticks: 220,
      });

      // Burst 2 — left
      setTimeout(() => {
        confetti({
          particleCount: 100,
          angle: 60,
          spread: 70,
          origin: { x: 0, y: 0.7 },
          colors: palette,
          scalar: 1.2,
        });
      }, 250);

      // Burst 3 — right
      setTimeout(() => {
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 70,
          origin: { x: 1, y: 0.7 },
          colors: palette,
          scalar: 1.2,
        });
      }, 500);

      // Continuous sparkle for 4 seconds
      const end = Date.now() + 4000;
      const interval = window.setInterval(() => {
        if (Date.now() > end) {
          window.clearInterval(interval);
          return;
        }
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.9 },
          colors: palette,
          gravity: 0.7,
          scalar: 0.9,
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.9 },
          colors: palette,
          gravity: 0.7,
          scalar: 0.9,
        });
      }, 280);
    };

    // small delay so the page paints first
    const t = setTimeout(fireBurst, 350);
    return () => clearTimeout(t);
  }, []);

  const shareWish = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Happy Diwali! 🪔",
          text: `You've received a Diwali wish!`,
          url,
        });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch {}
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 3D background — same hero scene but tinted by wish color */}
      <div className="fixed inset-0 -z-10">
        <Hero3D interactive />
      </div>

      {/* Tint overlay */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse at center, transparent 30%, ${colors.bowl}50 100%)`,
        }}
      />

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-16 text-center md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="glass-festive relative max-w-2xl rounded-3xl p-8 md:p-12"
        >
          {/* Glow border */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{ boxShadow: `inset 0 0 60px ${colors.glow}30, 0 0 80px ${colors.glow}20` }}
          />

          {/* Mini diya */}
          <div className="mx-auto mb-2 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="relative"
            >
              <div
                className="mx-auto h-12 w-3 flicker rounded-full"
                style={{
                  background: colors.flame,
                  boxShadow: `0 0 28px ${colors.flame}, 0 0 70px ${colors.glow}`,
                }}
              />
              <div className="mx-auto -mt-1 h-3 w-10 rounded-b-full" style={{ background: colors.bowl }} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.4em]"
            style={{ color: colors.flame }}
          >
            ✦ Shubh Deepavali ✦
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-3 text-4xl font-bold leading-tight md:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="gradient-text-mandala glow-text">
              Dear {wish.recipientName},
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#fff4e6]/90 md:text-lg"
          >
            {wish.message ??
              "May this Diwali burn away your shadows and refill your home with light, laughter, and endless joy."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-6 text-sm font-medium uppercase tracking-wider"
            style={{ color: colors.flame, fontFamily: "var(--font-tangerine)", fontSize: "1.5rem" }}
          >
            {wish.senderName ? `— With love, ${wish.senderName}` : "— With love"}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              onClick={shareWish}
              className="btn-shimmer h-11 bg-gradient-to-r from-[#ff8a00] to-[#e91e63] text-[#15001f] hover:brightness-110"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share this Wish
            </Button>
            <Button
              onClick={copyLink}
              variant="outline"
              className="h-11 border-[#ffd54f]/40 bg-transparent text-[#ffd54f] hover:bg-[#ffd54f]/10 hover:text-[#ffd54f]"
            >
              {copied ? "Copied!" : (<><Copy className="mr-2 h-4 w-4" /> Copy Link</>)}
            </Button>
            <Button
              onClick={onBackHome}
              variant="ghost"
              className="h-11 text-[#fff4e6]/70 hover:bg-white/5 hover:text-[#fff4e6]"
            >
              <Home className="mr-2 h-4 w-4" />
              Explore the Site
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-6 flex items-center justify-center gap-2 text-xs text-[#fff4e6]/50"
          >
            <Sparkles className="h-3 w-3 text-[#ffd54f]" />
            Click anywhere on the page to launch fireworks
            <Sparkles className="h-3 w-3 text-[#ffd54f]" />
          </motion.div>
        </motion.div>

        {/* Extra flourish — flame icon row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="flex items-center gap-3 text-[#ffd54f]/60"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <Flame
              key={i}
              className="h-4 w-4 flicker"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
