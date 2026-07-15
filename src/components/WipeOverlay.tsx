"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Persistent overlay in the root layout — never unmounts between routes.
// Handles ALL green wipe animations so every page entry looks identical:
//   - "covered" entry (prev page triggered exit wipe): starts full-screen, sweeps off right
//   - normal entry (direct load or non-wipe nav): sweeps in from left, then off right
// Pages drive the exit animation via window.__wipeOverlay + sessionStorage flag.
export default function WipeOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isFirst = useRef(true);

  useLayoutEffect(() => {
    (window as any).__wipeOverlay = ref.current;
    return () => { (window as any).__wipeOverlay = null; };
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const sweep = (startX: string) => {
      el.style.transition = "none";
      el.style.transform = startX;
      el.style.display = "block";
      void el.getBoundingClientRect();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = "transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)";
          el.style.transform = "translateX(100%)";
          setTimeout(() => { el.style.display = "none"; }, 1150);
        });
      });
    };

    if (isFirst.current) {
      isFirst.current = false;
      // Initial hard load — normal left-to-right sweep
      sweep("translateX(-100%)");
      return;
    }

    // Client-side route change
    const covered = sessionStorage.getItem("wipeEntry") === "covered";
    sessionStorage.removeItem("wipeEntry");

    // covered: prev page already covered screen, sweep off from centre
    // normal: nav happened without wipe, do the standard sweep in from left
    sweep(covered ? "translateX(0%)" : "translateX(-100%)");
  }, [pathname]);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        background: "#11FF00",
        zIndex: 9999,
        display: "none",
        pointerEvents: "none",
        willChange: "transform",
      }}
    />
  );
}
