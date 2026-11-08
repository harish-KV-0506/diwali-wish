"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flame, ChevronDown, Sparkles, Heart, Share2, Github } from "lucide-react";
import { useWishFromUrl } from "@/hooks/use-wish";
import MandalaBackground from "@/components/diwali/MandalaBackground";
import StoryScroll from "@/components/diwali/StoryScroll";
import WishGenerator from "@/components/diwali/WishGenerator";
import DiyaWall from "@/components/diwali/DiyaWall";
import RangoliMaker from "@/components/diwali/RangoliMaker";
import MusicToggle from "@/components/diwali/MusicToggle";
import FireworksLayer from "@/components/diwali/FireworksLayer";
import WishView from "@/components/diwali/WishView";

// 3D hero is dynamically loaded (no SSR — Three.js needs window)
const Hero3D = dynamic(() => import("@/components/diwali/Hero3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-[#ffd54f]/70">
        <div className="h-12 w-1.5 flicker rounded-full bg-[#ffd54f]" style={{ boxShadow: "0 0 30px #ff8a00" }} />
        <div className="text-xs uppercase tracking-[0.3em]">Lighting the diya…</div>
      </div>
    </div>
  ),
});

function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* 3D scene fills the section as background */}
      <div className="absolute inset-0 -z-0">
        <Hero3D interactive />
      </div>

      {/* Subtle vignette over the 3D so text stays readable */}
      <div
        className="absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(21,0,31,0.2) 30%, rgba(21,0,31,0.7) 100%)",
        }}
      />

      {/* Hero content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-4"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 rounded-full border border-[#ffd54f]/30 bg-[#15001f]/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#ffd54f] backdrop-blur"
        >
          ✦ Festival of Lights · {new Date().getFullYear()} ✦
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.9 }}
          className="text-5xl font-extrabold leading-[0.95] md:text-7xl lg:text-8xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="gradient-text-mandala glow-text">Happy</span>
          <br />
          <span className="gradient-text-mandala glow-text">Diwali</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="max-w-xl text-base text-[#fff4e6]/90 md:text-lg"
        >
          An interactive 3D celebration of light. Discover the ancient story of Diwali,
          craft your own wishes, light a diya, build a rangoli, and launch fireworks —
          all in your browser.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-2 flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            asChild
            className="btn-shimmer h-12 rounded-full bg-gradient-to-r from-[#ff8a00] via-[#e91e63] to-[#ff4081] px-7 text-[#15001f] hover:brightness-110"
          >
            <a href="#create-wish">
              <Sparkles className="mr-2 h-5 w-5" />
              Send a Wish
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-full border-[#ffd54f]/40 bg-[#15001f]/60 text-[#ffd54f] backdrop-blur hover:bg-[#ffd54f]/10 hover:text-[#ffd54f]"
          >
            <a href="#story">
              <Flame className="mr-2 h-5 w-5" />
              Read the Story
            </a>
          </Button>
        </motion.div>

        {/* Quick-jump nav chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs"
        >
          {[
            { label: "The Story", href: "#story", color: "#ffd54f" },
            { label: "Send a Wish", href: "#create-wish", color: "#ff8a00" },
            { label: "Light a Diya", href: "#light-a-diya", color: "#ff4081" },
            { label: "Rangoli Maker", href: "#rangoli", color: "#b388ff" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border px-3 py-1 transition-all hover:scale-105"
              style={{
                borderColor: `${item.color}40`,
                color: item.color,
                background: `${item.color}10`,
              }}
            >
              {item.label}
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.4, 1] }}
        transition={{ delay: 1.3, repeat: Infinity, duration: 2.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#ffd54f]"
      >
        <ChevronDown className="h-7 w-7" />
      </motion.div>
    </section>
  );
}

function NavBar() {
  const links = [
    { label: "Story", href: "#story" },
    { label: "Wish", href: "#create-wish" },
    { label: "Diya", href: "#light-a-diya" },
    { label: "Rangoli", href: "#rangoli" },
  ];
  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-4 py-3 backdrop-blur-md md:px-6">
      <a href="#" className="flex items-center gap-2 text-[#ffd54f]">
        <Flame className="h-5 w-5 flicker" />
        <span
          className="text-base font-bold tracking-wide"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Shubh Deepavali
        </span>
      </a>
      <nav className="hidden items-center gap-1 md:flex">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-[#fff4e6]/70 transition-colors hover:bg-white/5 hover:text-[#ffd54f]"
          >
            {l.label}
          </a>
        ))}
      </nav>
      <a
        href="#create-wish"
        className="rounded-full bg-gradient-to-r from-[#ff8a00] to-[#e91e63] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#15001f] transition-all hover:scale-105"
      >
        Send Wish
      </a>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative mt-auto border-t border-[#ffd54f]/20 bg-[#15001f]/80 px-4 py-10 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
        <div className="flex items-center gap-2 text-[#ffd54f]">
          <Flame className="h-5 w-5 flicker" />
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Shubh Deepavali
          </span>
        </div>
        <p className="max-w-md text-sm text-[#fff4e6]/70">
          Crafted with light, code, and a little bit of magic. May this Diwali
          bring you joy, prosperity, and warmth that lasts all year.
        </p>
        <div className="flex items-center gap-2 text-sm text-[#fff4e6]/60">
          Made with <Heart className="h-4 w-4 fill-[#ff4081] text-[#ff4081]" /> for the Festival of Lights
        </div>
        <div className="flex items-center gap-4 text-xs text-[#fff4e6]/40">
          <span>© {new Date().getFullYear()}</span>
          <span>·</span>
          <span>All diyas lit with love</span>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const { wish, loading } = useWishFromUrl();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If a wish id is in the URL AND we found the wish, show the personalized WishView.
  const showWish = mounted && !loading && wish;

  if (showWish) {
    return (
      <main className="relative min-h-screen">
        <MandalaBackground />
        <WishView
          wish={wish!}
          onBackHome={() => {
            // navigate to root without query
            window.history.pushState({}, "", "/");
            window.location.reload();
          }}
        />
        <FireworksLayer />
        <MusicToggle />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <MandalaBackground />
      <NavBar />
      <HeroSection />
      <StoryScroll />
      <WishGenerator />
      <DiyaWall />
      <RangoliMaker />
      <Footer />
      <FireworksLayer />
      <MusicToggle />
    </main>
  );
}
