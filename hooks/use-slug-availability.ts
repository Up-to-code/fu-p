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
        if ("success" in result && result.success && "available" in result) {
          setIsAvailable(result.available as boolean);
        } else {
          setIsAvailable(false);
        }
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
