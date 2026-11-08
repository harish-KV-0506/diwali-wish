"use client";

import { useEffect, useState } from "react";
import { getWish, type DiyaColor, type Wish } from "@/lib/wish-store";

const MAX_NAME_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 500;

function isDiyaColor(value: unknown): value is DiyaColor {
  return value === "saffron" || value === "magenta" || value === "gold" || value === "pink" || value === "purple";
}

function parseSharedWish(value: string): Wish | null {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    const data = parsed as Record<string, unknown>;
    const recipientName = data.recipientName;
    const senderName = data.senderName;
    const message = data.message;
    const diyaColor = data.diyaColor;

    if (
      typeof recipientName !== "string" ||
      recipientName.trim().length === 0 ||
      recipientName.length > MAX_NAME_LENGTH ||
      (senderName !== undefined &&
        (typeof senderName !== "string" || senderName.length > MAX_NAME_LENGTH)) ||
      (message !== undefined &&
        (typeof message !== "string" || message.length > MAX_MESSAGE_LENGTH)) ||
      !isDiyaColor(diyaColor)
    ) {
      return null;
    }

    return {
      id: "shared",
      createdAt: 0,
      recipientName,
      senderName,
      message,
      diyaColor,
    };
  } catch {
    return null;
  }
}

/**
 * Reads a self-contained wish from the URL fragment. Legacy ?wish=<id> links
 * remain available on the browser where their wish was originally created.
 */
export function useWishFromUrl() {
  const [wish, setWish] = useState<Wish | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const shared = new URLSearchParams(window.location.hash.slice(1)).get("wish");
    const legacyId = new URLSearchParams(window.location.search).get("wish");
    setWish(shared ? parseSharedWish(shared) : legacyId ? getWish(legacyId) : null);
    setLoading(false);
  }, []);

  return { wish, loading };
}
