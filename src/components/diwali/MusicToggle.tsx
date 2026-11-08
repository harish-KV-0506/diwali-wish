"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Music, Volume2, VolumeX } from "lucide-react";

/**
 * Generates ambient Diwali music programmatically via the Web Audio API.
 * A slow sitar-like drone with shimmering bell tones over a soft tanpura.
 * No audio files needed — everything synthesized.
 */
export default function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  // lazy init audio context (must be triggered by user gesture)
  useEffect(() => {
    setReady(true);
    return () => {
      stopRef.current?.();
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  const startMusic = () => {
    if (!ctxRef.current) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new Ctor();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterRef.current = master;

    // Slow fade-in
    master.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 2);

    /* Tanpura-like drone: low notes C, G, C, E (perfect fifth + octave + major third) */
    const droneFreqs = [130.81, 196.0, 261.63, 329.63];
    droneFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = "sawtooth";
      osc.frequency.value = freq;
      // subtle detune for richness
      osc.detune.value = (i - 1.5) * 4;
      filter.type = "lowpass";
      filter.frequency.value = 600 + i * 200;
      filter.Q.value = 6;
      gain.gain.value = 0.06 / (i + 1);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      osc.start();

      // Slow LFO on the filter for a breathing effect
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.05 + i * 0.02;
      lfoGain.gain.value = 200;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
    });

    /* Sitar-like melody — random plucks from a raga-inspired scale (C major pentatonic) */
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
    const melodyTimer = window.setInterval(() => {
      if (!ctxRef.current || !masterRef.current) return;
      const ctx2 = ctxRef.current;
      const freq = scale[Math.floor(Math.random() * scale.length)];

      const osc = ctx2.createOscillator();
      const gain = ctx2.createGain();
      const filter = ctx2.createBiquadFilter();
      osc.type = "triangle";
      osc.frequency.value = freq;
      filter.type = "bandpass";
      filter.frequency.value = freq * 2;
      filter.Q.value = 4;

      // Pluck envelope
      const now = ctx2.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterRef.current);
      osc.start(now);
      osc.stop(now + 2.0);
    }, 1400);

    /* Shimmering bell — occasional high tinkle */
    const bellTimer = window.setInterval(() => {
      if (!ctxRef.current || !masterRef.current) return;
      if (Math.random() > 0.5) return;
      const ctx2 = ctxRef.current;
      const freq = 1046.5 + Math.random() * 800; // high C and up
      const osc = ctx2.createOscillator();
      const gain = ctx2.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const now = ctx2.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
      osc.connect(gain);
      gain.connect(masterRef.current);
      osc.start(now);
      osc.stop(now + 2.6);
    }, 3200);

    stopRef.current = () => {
      window.clearInterval(melodyTimer);
      window.clearInterval(bellTimer);
      if (masterRef.current && ctxRef.current) {
        const m = masterRef.current;
        const t = ctxRef.current.currentTime;
        m.gain.cancelScheduledValues(t);
        m.gain.setValueAtTime(m.gain.value, t);
        m.gain.linearRampToValueAtTime(0, t + 0.8);
      }
      // hard stop after fade
      window.setTimeout(() => {
        try {
          ctxRef.current?.suspend();
        } catch {}
      }, 900);
    };
  };

  const toggle = () => {
    if (playing) {
      stopRef.current?.();
      stopRef.current = null;
      setPlaying(false);
    } else {
      startMusic();
      setPlaying(true);
    }
  };

  if (!ready) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
      <Button
        onClick={toggle}
        size="icon"
        variant="outline"
        aria-label={playing ? "Stop Diwali music" : "Play Diwali music"}
        className={`h-12 w-12 rounded-full border-2 backdrop-blur-md transition-all ${
          playing
            ? "border-[#ffd54f] bg-[#ff8a00]/20 text-[#ffd54f] pulse-glow"
            : "border-[#ffd54f]/40 bg-[#15001f]/70 text-[#ffd54f]/80 hover:border-[#ffd54f] hover:text-[#ffd54f]"
        }`}
      >
        {playing ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </Button>
      <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-[#ffd54f]/70">
        <Music className="h-3 w-3" />
        {playing ? "Now Playing" : "Music"}
      </div>
    </div>
  );
}
