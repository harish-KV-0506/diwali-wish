"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  createWish,
  buildWishUrl,
  type DiyaColor,
} from "@/lib/wish-store";
import {
  Copy,
  Share2,
  Sparkles,
  Link as LinkIcon,
  ExternalLink,
  CheckCircle2,
  Flame,
} from "lucide-react";

const DIYA_COLORS: { id: DiyaColor; label: string; flame: string; glow: string; bowl: string }[] = [
  { id: "saffron", label: "Saffron", flame: "#ffb300", glow: "#ff8a00", bowl: "#9c4a1c" },
  { id: "magenta", label: "Magenta", flame: "#ff4081", glow: "#e91e63", bowl: "#6a1b9a" },
  { id: "gold", label: "Gold", flame: "#ffd54f", glow: "#ffb300", bowl: "#7a3a1a" },
  { id: "pink", label: "Rose Pink", flame: "#ff80ab", glow: "#f50057", bowl: "#8e2444" },
  { id: "purple", label: "Royal Purple", flame: "#b388ff", glow: "#6a1b9a", bowl: "#4a148c" },
];

const MESSAGES = [
  "May the festival of lights brighten your life with joy, prosperity, and endless happiness. Happy Diwali!",
  "Wishing that this Diwali brings you success, peace, and warmth. Let every diya you light chase a worry away.",
  "Like the diyas that glow on this moonless night, may your year be filled with light, love, and laughter.",
  "On this Diwali, may the divine light bring peace to your home, success to your work, and joy to your heart.",
];

export default function WishGenerator() {
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState(MESSAGES[0]);
  const [diyaColor, setDiyaColor] = useState<DiyaColor>("saffron");
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!recipientName.trim()) {
      toast({
        title: "A name is needed",
        description: "Tell us who you're wishing — Diwali is personal.",
        variant: "destructive",
      });
      return;
    }
    const wish = createWish({
      recipientName: recipientName.trim(),
      senderName: senderName.trim() || undefined,
      message: message.trim() || undefined,
      diyaColor,
    });
    const url = buildWishUrl(wish.id);
    setGeneratedUrl(url);
    setCopied(false);
    toast({
      title: "Your wish link is ready!",
      description: "Copy and send it to make someone's Diwali glow.",
    });
  };

  const handleCopy = async () => {
    if (!generatedUrl) return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      toast({ title: "Link copied!", description: "Paste it anywhere to share." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Couldn't copy automatically",
        description: "Select the link and copy manually.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!generatedUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Happy Diwali! 🪔",
          text: `${senderName ? senderName + " wishes you " : "Someone wishes you "}a glowing Diwali — open this:`,
          url: generatedUrl,
        });
      } catch {
        // user cancelled — silent
      }
    } else {
      handleCopy();
    }
  };

  const openLink = () => {
    if (generatedUrl) window.open(generatedUrl, "_blank");
  };

  const selectedColor = DIYA_COLORS.find((c) => c.id === diyaColor) ?? DIYA_COLORS[0];

  return (
    <div id="create-wish" className="relative w-full px-4 py-20 md:py-28">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8">
        {/* Heading */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd54f]/30 bg-[#ffd54f]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#ffd54f]">
            <Sparkles className="h-3 w-3" /> Send a Wish
          </div>
          <h2
            className="text-4xl font-bold leading-tight md:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="gradient-text-mandala">Light Up Someone's Diwali</span>
          </h2>
          <p className="max-w-2xl text-base text-[#fff4e6]/80 md:text-lg">
            Enter a name, choose a diya color, and we'll generate a private link —
            opening it shows them a personalized animated greeting. Magic, delivered.
          </p>
        </div>

        <div className="grid w-full gap-6 md:grid-cols-[1fr_1fr]">
          {/* Form */}
          <div className="glass-festive flex flex-col gap-5 rounded-3xl p-6 md:p-8">
            <div className="flex flex-col gap-2">
              <Label htmlFor="recipient" className="text-sm font-semibold uppercase tracking-wider text-[#ffd54f]">
                Recipient's Name <span className="text-[#ff4081]">*</span>
              </Label>
              <Input
                id="recipient"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Priya, Arjun, Mom…"
                className="border-[#ffd54f]/25 bg-[#15001f]/60 text-[#fff4e6] placeholder:text-[#fff4e6]/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="sender" className="text-sm font-semibold uppercase tracking-wider text-[#ffd54f]">
                Your Name (optional)
              </Label>
              <Input
                id="sender"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="From…"
                className="border-[#ffd54f]/25 bg-[#15001f]/60 text-[#fff4e6] placeholder:text-[#fff4e6]/40"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold uppercase tracking-wider text-[#ffd54f]">
                Choose a Diya
              </Label>
              <div className="grid grid-cols-5 gap-2">
                {DIYA_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setDiyaColor(c.id)}
                    className={`group relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                      diyaColor === c.id
                        ? "border-[#ffd54f] scale-105 pulse-glow"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ background: `radial-gradient(circle at 50% 60%, ${c.glow}40, ${c.bowl})` }}
                    aria-label={c.label}
                  >
                    {/* Mini diya */}
                    <span
                      className="absolute left-1/2 top-[55%] h-3 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full flicker"
                      style={{ background: c.flame, boxShadow: `0 0 12px ${c.flame}` }}
                    />
                    <span className="absolute bottom-1.5 left-1/2 h-1.5 w-6 -translate-x-1/2 rounded-b-full" style={{ background: c.bowl }} />
                    <span className="sr-only">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="message" className="text-sm font-semibold uppercase tracking-wider text-[#ffd54f]">
                Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="resize-none border-[#ffd54f]/25 bg-[#15001f]/60 text-[#fff4e6] placeholder:text-[#fff4e6]/40"
              />
              <div className="flex flex-wrap gap-2">
                {MESSAGES.map((m, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMessage(m)}
                    className="rounded-full border border-[#ffd54f]/20 bg-[#6a1b9a]/20 px-3 py-1 text-xs text-[#fff4e6]/70 hover:border-[#ffd54f]/60 hover:text-[#ffd54f]"
                  >
                    Template {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              className="btn-shimmer mt-2 h-12 w-full bg-gradient-to-r from-[#ff8a00] via-[#e91e63] to-[#ff4081] text-base font-bold uppercase tracking-wider text-[#15001f] hover:brightness-110"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Wish Link
            </Button>
          </div>

          {/* Preview + result */}
          <div className="glass-festive flex flex-col gap-5 rounded-3xl p-6 md:p-8">
            <div className="text-sm font-semibold uppercase tracking-wider text-[#ffd54f]">
              Live Preview
            </div>
            {/* Preview card — shows what recipient will see */}
            <div
              className="relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl p-6 text-center"
              style={{
                background: `radial-gradient(circle at 50% 30%, ${selectedColor.glow}30, ${selectedColor.bowl}40)`,
                border: `1px solid ${selectedColor.flame}40`,
              }}
            >
              {/* Big diya */}
              <div className="relative my-2">
                <div
                  className="mx-auto h-12 w-3 flicker rounded-full"
                  style={{
                    background: selectedColor.flame,
                    boxShadow: `0 0 24px ${selectedColor.flame}, 0 0 60px ${selectedColor.glow}`,
                  }}
                />
                <div
                  className="mx-auto -mt-1 h-3 w-10 rounded-b-full"
                  style={{ background: selectedColor.bowl }}
                />
              </div>
              <div className="text-xs uppercase tracking-[0.3em] text-[#ffd54f]/70">
                Shubh Deepavali
              </div>
              <div className="text-2xl font-bold md:text-3xl" style={{ fontFamily: "var(--font-display)", color: selectedColor.flame }}>
                <span className="glow-text-soft">
                  {recipientName.trim() ? `Dear ${recipientName.trim()},` : "Dear Friend,"}
                </span>
              </div>
              <p className="text-sm text-[#fff4e6]/85">
                {message || "Your message will appear here."}
              </p>
              <div className="text-sm text-[#ffd54f]/80">
                {senderName.trim() ? `— With love, ${senderName.trim()}` : "— With love"}
              </div>
            </div>

            {/* Generated link card */}
            <AnimatePresence>
              {generatedUrl && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-3 overflow-hidden rounded-2xl border border-[#ffd54f]/30 bg-[#15001f]/70 p-4"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#ffd54f]">
                    <CheckCircle2 className="h-4 w-4" />
                    Your private wish link
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-[#2d0a2e]/60 px-3 py-2">
                    <LinkIcon className="h-4 w-4 shrink-0 text-[#ffd54f]/70" />
                    <code className="flex-1 truncate text-xs text-[#fff4e6]/80">{generatedUrl}</code>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      className="border-[#ffd54f]/30 bg-transparent text-[#ffd54f] hover:bg-[#ffd54f]/10 hover:text-[#ffd54f]"
                    >
                      {copied ? <CheckCircle2 className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="border-[#ff4081]/30 bg-transparent text-[#ff4081] hover:bg-[#ff4081]/10 hover:text-[#ff4081]"
                    >
                      <Share2 className="mr-1 h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      onClick={openLink}
                      className="bg-gradient-to-r from-[#ff8a00] to-[#e91e63] text-[#15001f] hover:brightness-110"
                    >
                      <ExternalLink className="mr-1 h-4 w-4" />
                      Open
                    </Button>
                  </div>
                  <p className="text-xs text-[#fff4e6]/50">
                    🔒 The link works on this device. Send it on WhatsApp, Instagram, or however you share.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Helper hint */}
            {!generatedUrl && (
              <div className="flex items-start gap-3 rounded-2xl border border-[#ffd54f]/15 bg-[#6a1b9a]/10 p-4 text-sm text-[#fff4e6]/70">
                <Flame className="mt-0.5 h-5 w-5 shrink-0 text-[#ff8a00]" />
                <p>
                  Tip: pick the recipient's favorite color for the diya —
                  it personalizes the entire experience they'll see when they open the link.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
