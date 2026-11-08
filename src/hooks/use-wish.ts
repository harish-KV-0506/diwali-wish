"use client";

import { useEffect, useState } from "react";
import { getWish, type Wish } from "@/lib/wish-store";

/**
 * Returns the wish id from the `?wish=` query param (if present),
 * plus the loaded Wish object (or null if it doesn't exist / not yet loaded).
 */
export function useWishFromUrl() {
  const [wishId, setWishId] = useState<string | null>(null);
  const [wish, setWish] = useState<Wish | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("wish");
    setWishId(id);
    if (id) {
      const found = getWish(id);
      setWish(found);
    } else {
      setWish(null);
    }
    setLoading(false);
  }, []);

  return { wishId, wish, loading };
}
