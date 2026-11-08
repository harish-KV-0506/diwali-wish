"use client";

/**
 * Shared wishes are encoded into the URL fragment so they work across devices
 * without accounts, a database, or server-side storage. The local store remains
 * available for opening links created by older versions of the site.
 */

export type DiyaColor = "saffron" | "magenta" | "gold" | "pink" | "purple";

export interface Wish {
  id: string;
  recipientName: string;
  senderName?: string;
  message?: string;
  diyaColor: DiyaColor;
  createdAt: number;
  /** globally-incrementing diya-lighting counter, shared by all visitors on this device */
}

const WISH_KEY = "diwali:wishes:v1";
const DIYA_COUNT_KEY = "diwali:diyas-lit:v1";
const RANGOLI_KEY = "diwali:rangoli:v1";

/* ------------------------- wish CRUD ------------------------- */

function readAllWishes(): Record<string, Wish> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(WISH_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAllWishes(map: Record<string, Wish>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WISH_KEY, JSON.stringify(map));
}

export function makeWishId(): string {
  // 8-char base36 id — short & shareable
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export function createWish(input: Omit<Wish, "id" | "createdAt">): Wish {
  const id = makeWishId();
  const wish: Wish = { ...input, id, createdAt: Date.now() };
  const map = readAllWishes();
  map[id] = wish;
  writeAllWishes(map);
  return wish;
}

export function getWish(id: string): Wish | null {
  const map = readAllWishes();
  return map[id] ?? null;
}

export function listWishes(): Wish[] {
  const map = readAllWishes();
  return Object.values(map).sort((a, b) => b.createdAt - a.createdAt);
}

export function deleteWish(id: string) {
  const map = readAllWishes();
  delete map[id];
  writeAllWishes(map);
}

/** Build a shareable, stateless link. The fragment is not sent to the web server. */
export function buildWishUrl(
  wish: Pick<Wish, "recipientName" | "senderName" | "message" | "diyaColor">,
): string {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = `wish=${encodeURIComponent(JSON.stringify(wish))}`;
  return url.toString();
}

/* ------------------------- global diya counter ------------------------- */

export function getDiyaCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(DIYA_COUNT_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) ? n : 0;
}

export function addDiya(): number {
  const next = getDiyaCount() + 1;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(DIYA_COUNT_KEY, String(next));
  }
  return next;
}

/* ------------------------- rangoli persistence ------------------------- */

export interface RangoliCell {
  row: number;
  col: number;
  color: string;
}

export function saveRangoli(cells: RangoliCell[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RANGOLI_KEY, JSON.stringify(cells));
}

export function loadRangoli(): RangoliCell[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RANGOLI_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
