"use client";

import { useEffect, useRef } from "react";

export default function PageTransition() {
  const greenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const green = greenRef.current;
    if (!green) return;

    green.style.transition = "none";
    green.style.transform = "translateX(-100%)";
    void green.getBoundingClientRect();

    // Double rAF ensures the browser has committed the starting position
    // before starting the transition, preventing the initial flash/glitch
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        green.style.transition = "transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)";
        green.style.transform = "translateX(100%)";
        setTimeout(() => { green.style.display = "none"; }, 1200);
      });
    });
  }, []);

  return (
    <div ref={greenRef} style={{ position: "fixed", inset: 0, background: "#11FF00", zIndex: 9999, pointerEvents: "none", willChange: "transform" }} />
  );
}
