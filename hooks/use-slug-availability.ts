"use client";

import { useState, useEffect } from "react";
import { checkSlugAvailability } from "@/app/actions/organization";

export function useSlugAvailability(slug: string) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (!slug) {
      setIsAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsValidating(true);
      try {
        const result = await checkSlugAvailability(slug);
        setIsAvailable(result.success && result.available);
      } catch (e) {
        setIsAvailable(null);
      } finally {
        setIsValidating(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [slug]);

  return { isAvailable, isValidating };
}
