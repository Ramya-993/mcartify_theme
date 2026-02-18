"use client";
import { useEffect } from "react";

/**
 * Injects a global <style> tag to apply font-family using --font-primary and --font-secondary.
 * This ensures dynamic font variables are used everywhere, without modifying theme.css.
 */
export function FontGlobalStyle() {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      body { font-family: var(--font-secondary); }
      h1, h2, h3, h4, h5, h6 { font-family: var(--font-primary); }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return null;
}
