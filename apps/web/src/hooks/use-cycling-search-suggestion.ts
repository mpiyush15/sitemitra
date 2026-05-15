"use client";

import { useEffect, useState } from "react";
import { TOP_SEARCHES } from "@/lib/constants";

export const SEARCH_SUGGESTIONS = TOP_SEARCHES.map((item) => item.label);

export function useCyclingSearchSuggestion(active: boolean) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const rotate = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % SEARCH_SUGGESTIONS.length);
        setVisible(true);
      }, 280);
    }, 2800);

    return () => {
      window.clearInterval(rotate);
    };
  }, [active]);

  return {
    index,
    visible: active && visible,
    label: SEARCH_SUGGESTIONS[index],
  };
}

export function getSearchSuggestionHref(label: string) {
  return TOP_SEARCHES.find((item) => item.label === label)?.href ?? "/listings";
}
