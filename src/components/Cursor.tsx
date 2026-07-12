"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0;
    let mouseY = 0;
    let curX = 0;
    let curY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onEnterPanel = () => cursor.classList.add("expanded");
    const onLeavePanel = () => cursor.classList.remove("expanded");

    gsap.ticker.add(() => {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      gsap.set(cursor, { x: curX, y: curY });
    });

    window.addEventListener("mousemove", onMove);

    const panels = document.querySelectorAll(".panel");
    panels.forEach((p) => {
      p.addEventListener("mouseenter", onEnterPanel);
      p.addEventListener("mouseleave", onLeavePanel);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      gsap.ticker.remove(() => {});
    };
  }, []);

  return <div ref={cursorRef} className="cursor" />;
}
