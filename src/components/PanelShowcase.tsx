"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const panels = [
  {
    id: 1,
    number: "1",
    category: "Laboratory",
    title: "Discovery Industry Solutions",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
    color: "#f5f5f5",
  },
  {
    id: 2,
    number: "2",
    category: "Engineering",
    title: "Chemical Synthetic Fibers Metal",
    image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80",
    color: "#e8e8e8",
  },
  {
    id: 3,
    number: "3",
    category: "Lab Production",
    title: "Racks Exhibition System",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    color: "#f0f0f0",
  },
  {
    id: 4,
    number: "4",
    category: "Project 3D",
    title: "Analysis Product Sketch",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80",
    color: "#ebebeb",
  },
];

const BASE_FLEX = 25;
const ACTIVE_FLEX = 45;
const INACTIVE_FLEX = (100 - ACTIVE_FLEX) / (panels.length - 1);

export default function PanelShowcase() {
  const [activePanel, setActivePanel] = useState<number | null>(null);
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax on scroll
    const onScroll = () => {
      const scrollY = window.scrollY;
      numberRefs.current.forEach((el, i) => {
        if (!el) return;
        const speed = 0.06 + i * 0.01;
        gsap.set(el, { y: scrollY * speed });
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animate number shift on hover
  useEffect(() => {
    numberRefs.current.forEach((el, i) => {
      if (!el) return;
      const isActive = activePanel === panels[i].id;
      gsap.to(el, {
        x: isActive ? -20 : 0,
        duration: 0.75,
        ease: "power3.out",
      });
    });
  }, [activePanel]);

  const getFlexValue = (panelId: number) => {
    if (activePanel === null) return `${BASE_FLEX}%`;
    return activePanel === panelId
      ? `${ACTIVE_FLEX}%`
      : `${INACTIVE_FLEX}%`;
  };

  return (
    <div ref={containerRef} className="panels-container">
      {panels.map((panel, i) => (
        <div
          key={panel.id}
          className={`panel${activePanel === panel.id ? " active" : ""}`}
          style={{
            flex: `0 0 ${getFlexValue(panel.id)}`,
            background: panel.color,
          }}
          onMouseEnter={() => setActivePanel(panel.id)}
          onMouseLeave={() => setActivePanel(null)}
        >
          {/* Background image */}
          <div className="panel-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={panel.image} alt={panel.title} loading="lazy" />
          </div>

          {/* Giant number */}
          <div
            ref={(el) => { numberRefs.current[i] = el; }}
            className="panel-number"
          >
            {panel.number}
          </div>

          {/* Category pill */}
          <div className="panel-pill">
            {panel.category}
          </div>

          {/* Project info (fades in on hover) */}
          <div className="panel-info">
            <div className="panel-info-inner">
              <p className="panel-title">{panel.title}</p>
              <div className="panel-arrow">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="#0a0a0a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8h10M8 3l5 5-5 5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
