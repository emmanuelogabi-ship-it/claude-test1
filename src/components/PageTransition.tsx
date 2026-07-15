"use client";

import { useLayoutEffect, useRef } from "react";

export default function PageTransition() {
  const greenRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const green = greenRef.current;
    if (!green) return;

    const covered = sessionStorage.getItem("wipeEntry") === "covered";
    if (covered) {
      sessionStorage.removeItem("wipeEntry");
      // Start fully covering the screen, then sweep off right
      green.style.transition = "none";
      green.style.transform = "translateX(0%)";
      void green.getBoundingClientRect();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          green.style.transition = "transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)";
          green.style.transform = "translateX(100%)";
          setTimeout(() => { green.style.display = "none"; }, 1200);
        });
      });
    } else {
      // Normal entry: sweep in from left then off to right
      green.style.transition = "none";
      green.style.transform = "translateX(-100%)";
      void green.getBoundingClientRect();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          green.style.transition = "transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)";
          green.style.transform = "translateX(100%)";
          setTimeout(() => { green.style.display = "none"; }, 1200);
        });
      });
    }
  }, []);

  return (
    <div ref={greenRef} style={{ position: "fixed", inset: 0, background: "#11FF00", zIndex: 9999, pointerEvents: "none", willChange: "transform" }} />
  );
}
