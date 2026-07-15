"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import LineButton from "./LineButton";
import MobilePanels from "./MobilePanels";

interface PanelData {
  id: number;
  number: string;
  category: string;
  title: string;
  image: string;
  description: string;
  href?: string;
}

const panels: PanelData[] = [
  {
    id: 1,
    number: "1",
    category: "Laboratory",
    title: "Discovery\nIndustry Solutions",
    image: "/images/1.jpg",
    href: "/laboratory",
    description: "There is a discovery at the root of every breakthrough. A process refined in a laboratory that becomes the backbone of an entire industry. We design the systems that make those discoveries repeatable, scalable, and real.\n\nOur laboratory solutions power research facilities, pharmaceutical plants, and advanced testing environments across the globe. Every instrument calibrated. Every protocol documented. Every result validated against the highest standards of scientific integrity.\n\nWe partner with the world's leading research institutions to build infrastructure that doesn't just support science — it accelerates it. From benchtop to production floor, we are the system behind the system.\n\nPrecision is not a feature we add at the end. It is the principle we start with. Our teams combine deep domain knowledge in analytical chemistry, biology, and materials science with engineering rigour to deliver solutions that hold up under the most demanding conditions imaginable.\n\nWhen accuracy is non-negotiable and repeatability is everything, institutions around the world choose us.",
  },
  {
    id: 2,
    number: "2",
    category: "Engineering",
    title: "Synthetic\nFibers Metal",
    image: "/images/2.jpg",
    href: "/engineering",
    description: "There is a thread running through every skyscraper that defies wind. A fiber reinforcing every bulletproof vest that saves a life. A composite bonding the hull of every vessel that crosses the deepest ocean. A metal alloy inside every bridge that holds a city together.\n\nThat thread, that fiber, that composite, that alloy — it starts with us. We engineer synthetic materials that perform where natural ones fail, built for tensile strength, thermal resistance, and longevity under extreme conditions.\n\nOur materials science division operates at the intersection of chemistry and industrial design, developing proprietary compounds used in aerospace, defense, marine, and civil infrastructure across six continents.\n\nEach formulation is stress-tested through thousands of simulated load cycles before it reaches a production environment. We do not ship a material until we are certain it will outlast the structure around it.\n\nThe result is a portfolio of advanced composites and metal alloys trusted by the engineers who build the things that must never fail.",
  },
  {
    id: 3,
    number: "3",
    category: "Lab Production",
    title: "Racks\nExhibition System",
    image: "/images/3.jpg",
    href: "/lab-production",
    description: "Precision-engineered rack systems designed for the demands of modern exhibition and laboratory environments. Every joint, every surface, every configuration built for performance under pressure.\n\nFrom modular display solutions to heavy-load laboratory shelving, our systems adapt to any environment without compromise. Anodized aluminium profiles, tool-free assembly, and a weight-bearing capacity that exceeds industry standards by a factor of three.\n\nDeployed in museums, trade exhibition halls, cleanroom facilities, and pharmaceutical storage units worldwide — our racks are the silent infrastructure behind every successful presentation and every compliant operation.\n\nConfiguration is entirely modular. A single system can be reconfigured in under an hour to accommodate a new exhibit layout, a change in product line, or a shift in regulatory requirement. No specialist tools. No wasted lead time.\n\nWe design for the real world — where installations change, budgets are tight, and the only acceptable downtime is zero.",
  },
  {
    id: 4,
    number: "4",
    category: "Project 3D",
    title: "Analysis\nProduct Sketch",
    image: "/images/4.jpg",
    href: "/project-3d",
    description: "From initial sketch to final analysis, we bridge the gap between concept and production. Our 3D design and analysis pipeline turns ideas into manufacturable realities with precision that eliminates guesswork.\n\nEvery surface is tested virtually before it is built physically — reducing waste, accelerating timelines, and improving outcomes. Finite element analysis, fluid simulation, and topology optimisation run concurrently so that every design decision is backed by data before a single prototype is cut.\n\nOur design team works embedded within your engineering workflow, speaking the language of tolerances, materials, and manufacturing constraints from day one. The result: fewer revisions, faster sign-off, and products that perform exactly as designed.\n\nWe have delivered concept-to-production programmes across consumer electronics, medical devices, industrial equipment, and architectural hardware — each one on time, within tolerance, and ready for the line.\n\nIf your product has to be right the first time, this is where the process starts.",
  },
];

const COLLAPSED_PX = 40;
const N_COLLAPSED = panels.length - 1; // 3
const EXPANDED_W = `calc(100% - ${COLLAPSED_PX * N_COLLAPSED}px)`;
const COLLAPSED_W = `${COLLAPSED_PX}px`;
const NORMAL_W = "25%";

export default function PanelShowcase() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollBodyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gradientRefs = useRef<(HTMLDivElement | null)[]>([]);
  const expandedIdRef = useRef<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const wipeGreenRef = useRef<HTMLDivElement>(null);

  const navigateWithWipe = (href: string) => {
    const green = wipeGreenRef.current;
    if (!green) { router.push(href); return; }

    gsap.set(green, { xPercent: -100, display: "block" });

    gsap.to(green, {
      xPercent: 0,
      duration: 1.0,
      ease: "power2.inOut",
      onComplete: () => router.push(href),
    });
  };

  // Entrance animation
  useEffect(() => {
    const numbers = Array.from(containerRef.current?.querySelectorAll(".panel-number") ?? []);
    if (!numbers.length) return;

    const run = () => {
      gsap.killTweensOf(numbers);
      gsap.set(numbers, { opacity: 0, x: -60 });
      gsap.to(numbers, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out", stagger: 0.12, delay: 0.2 });
    };

    if (document.hidden) {
      const h = () => { document.removeEventListener("visibilitychange", h); run(); };
      document.addEventListener("visibilitychange", h);
    } else {
      run();
    }
  }, []);

  // Scroll gradient hide
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    scrollBodyRefs.current.forEach((el, i) => {
      if (!el) return;
      const onScroll = () => {
        const grad = gradientRefs.current[i];
        if (!grad) return;
        grad.style.opacity = el.scrollTop > 0 ? "0" : "1";
      };
      el.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => el.removeEventListener("scroll", onScroll));
    });
    return () => cleanups.forEach(fn => fn());
  }, []);

  // Hover animations
  useEffect(() => {
    const panelEls = containerRef.current?.querySelectorAll(".panel");
    if (!panelEls?.length) return;

    panelEls.forEach((panel, i) => {
      const bg = panel.querySelector(".panel-bg-image") as HTMLElement;
      const overlay = panel.querySelector(".panel-overlay") as HTMLElement;
      const number = panel.querySelector(".panel-number") as HTMLElement;
      const pill = panel.querySelector(".panel-pill") as HTMLElement;
      const title = panel.querySelector(".panel-footer-title") as HTMLElement;
      const arrowRect = panel.querySelector(".panel-footer-arrow rect") as SVGElement;
      const arrowPath = panel.querySelector(".panel-footer-arrow path") as SVGElement;

      const onEnter = () => {
        if (expandedIdRef.current !== null) return;
        gsap.to(bg, { opacity: 1, duration: 0.25, ease: "power2.out" });
        gsap.to(overlay, { opacity: 1, duration: 0.25, ease: "power2.out" });
        const panelLeft = (panel as HTMLElement).getBoundingClientRect().left;
        const numLeft = number.getBoundingClientRect().left;
        const currentX = gsap.getProperty(number, "x") as number;
        gsap.to(number, { x: currentX + (panelLeft + 28 - numLeft), color: "#ffffff", duration: 0.3, ease: "power3.out" });
        gsap.to(pill, { backgroundColor: "#ffffff", borderColor: "#ffffff", color: "#0a0a0a", duration: 0.2, ease: "power2.out" });
        gsap.to(title, { color: "#ffffff", duration: 0.2, ease: "power2.out" });
        gsap.to(arrowRect, { attr: { fill: "#ffffff" }, duration: 0.2 });
        gsap.to(arrowPath, { attr: { fill: "#0a0a0a" }, duration: 0.2 });
      };

      const onLeave = () => {
        if (expandedIdRef.current !== null) return;
        gsap.to(bg, { opacity: 0, duration: 0.25, ease: "power2.inOut" });
        gsap.to(overlay, { opacity: 0, duration: 0.25, ease: "power2.inOut" });
        gsap.to(number, { x: 0, color: "#0a0a0a", duration: 0.3, ease: "power3.out" });
        gsap.to(pill, { backgroundColor: "#ffffff", borderColor: "#000000", color: "#0a0a0a", duration: 0.2 });
        gsap.to(title, { color: "#0a0a0a", duration: 0.2 });
        gsap.to(arrowRect, { attr: { fill: "#000000" }, duration: 0.2 });
        gsap.to(arrowPath, { attr: { fill: "#ffffff" }, duration: 0.2 });
      };

      panel.addEventListener("mouseenter", onEnter);
      panel.addEventListener("mouseleave", onLeave);
    });
  }, []);

  const setWidth = (el: HTMLElement, w: string) => {
    el.style.transition = "width 0.65s cubic-bezier(0.87, 0, 0.13, 1)";
    el.style.width = w;
  };

  const setNumberStyle = (panelEl: HTMLElement, collapsed: boolean) => {
    const number = panelEl.querySelector(".panel-number") as HTMLElement;
    const pill = panelEl.querySelector(".panel-pill") as HTMLElement;
    if (collapsed) {
      if (number) {
        number.style.transition = "font-size 0.4s ease, top 0.4s ease, left 0.4s ease, transform 0.4s ease";
        number.style.fontSize = "28px";
        number.style.top = "50%";
        number.style.left = "50%";
        number.style.transform = "translate(-50%, -50%)";
        number.style.letterSpacing = "-0.02em";
        number.style.color = "#0a0a0a";
      }
      if (pill) { pill.style.transition = "opacity 0.2s ease"; pill.style.opacity = "0"; pill.style.pointerEvents = "none"; }
      const footer = panelEl.querySelector(".panel-footer") as HTMLElement;
      if (footer) { footer.style.transition = "opacity 0.2s ease"; footer.style.opacity = "0"; footer.style.pointerEvents = "none"; }
    } else {
      if (number) {
        number.style.transition = "font-size 0.4s ease, top 0.4s ease, left 0.4s ease, transform 0.4s ease";
        number.style.fontSize = "";
        number.style.top = "";
        number.style.left = "";
        number.style.transform = "";
        number.style.letterSpacing = "";
        number.style.color = "";
      }
      if (pill) { pill.style.transition = "opacity 0.3s ease"; pill.style.opacity = "1"; pill.style.pointerEvents = ""; }
      const footer2 = panelEl.querySelector(".panel-footer") as HTMLElement;
      if (footer2) { footer2.style.transition = "opacity 0.3s ease"; footer2.style.opacity = "1"; footer2.style.pointerEvents = ""; }
    }
  };

  const slideContent = (content: HTMLElement, show: boolean, delay = 0) => {
    content.style.transition = `transform ${show ? "0.55s" : "0.35s"} cubic-bezier(0.87, 0, 0.13, 1) ${delay}s`;
    content.style.transform = show ? "translateX(0%)" : "translateX(100%)";
  };

  const setPanelVisuals = (panelEl: HTMLElement, expanded: boolean) => {
    const bg = panelEl.querySelector(".panel-bg-image") as HTMLElement;
    const overlay = panelEl.querySelector(".panel-overlay") as HTMLElement;
    const number = panelEl.querySelector(".panel-number") as HTMLElement;
    const pill = panelEl.querySelector(".panel-pill") as HTMLElement;

    if (expanded) {
      gsap.to(bg, { opacity: 1, duration: 0.4 });
      gsap.to(overlay, { opacity: 1, duration: 0.4 });
      // Move number to right side of image strip
      if (number) {
        number.style.transition = "left 0.5s cubic-bezier(0.87,0,0.13,1), right 0.5s cubic-bezier(0.87,0,0.13,1), color 0.3s ease";
        number.style.left = "auto";
        number.style.right = "640px";
        number.style.color = "#ffffff";
        number.style.transform = "translateY(calc(-50% - 79px))";
      }
      // Hide pill and footer from image strip
      if (pill) { pill.style.transition = "opacity 0.2s ease"; pill.style.opacity = "0"; pill.style.pointerEvents = "none"; }
      const footer = panelEl.querySelector(".panel-footer") as HTMLElement;
      if (footer) { footer.style.transition = "opacity 0.2s ease"; footer.style.opacity = "0"; footer.style.pointerEvents = "none"; }
    } else {
      gsap.to(bg, { opacity: 0, duration: 0.4 });
      gsap.to(overlay, { opacity: 0, duration: 0.4 });
      // Reset number position
      if (number) {
        number.style.transition = "left 0.5s cubic-bezier(0.87,0,0.13,1), right 0.5s ease, color 0.3s ease";
        number.style.left = "-10%";
        number.style.right = "";
        number.style.color = "";
        number.style.transform = "";
      }
      // Restore pill
      if (pill) { pill.style.transition = "opacity 0.3s ease"; pill.style.opacity = "1"; pill.style.pointerEvents = ""; }
    }
  };

  const handleExpand = (panelId: number) => {
    const els = panelRefs.current;

    if (expandedIdRef.current === panelId) {
      // Collapse
      expandedIdRef.current = null;
      setExpandedId(null);
      els.forEach((el, i) => {
        if (!el) return;
        setWidth(el, NORMAL_W);
        setNumberStyle(el, false);
      });
      const content = contentRefs.current[panelId - 1];
      if (content) slideContent(content, false);
      const panelEl = panelRefs.current[panelId - 1];
      if (panelEl) setPanelVisuals(panelEl, false);
    } else {
      const prevId = expandedIdRef.current;
      expandedIdRef.current = panelId;
      setExpandedId(panelId);

      // Collapse prev
      if (prevId !== null) {
        const prevContent = contentRefs.current[prevId - 1];
        if (prevContent) slideContent(prevContent, false);
        const prevPanel = panelRefs.current[prevId - 1];
        if (prevPanel) {
          setPanelVisuals(prevPanel, false);
          setNumberStyle(prevPanel, false);
        }
      }

      // Animate widths via CSS transition
      els.forEach((el, i) => {
        if (!el) return;
        const isExp = panels[i].id === panelId;
        setWidth(el, isExp ? EXPANDED_W : COLLAPSED_W);
        setNumberStyle(el, !isExp);
      });

      // Show image/visuals
      const panelEl = panelRefs.current[panelId - 1];
      if (panelEl) setPanelVisuals(panelEl, true);

      // Slide in content after width starts expanding
      const content = contentRefs.current[panelId - 1];
      if (content) {
        content.style.transition = "none";
        content.style.transform = "translateX(100%)";
        slideContent(content, true, 0.2);

        // Reveal content items
        const items = content.querySelectorAll<HTMLElement>(".exp-item");
        items.forEach(item => {
          item.style.transition = "none";
          item.style.opacity = "0";
          item.style.transform = "translateX(-32px)";
        });
        const t = setTimeout(() => {
          items.forEach((item, j) => {
            item.style.transition = `opacity 0.5s cubic-bezier(0.25,1,0.5,1) ${j * 0.09}s, transform 0.5s cubic-bezier(0.25,1,0.5,1) ${j * 0.09}s`;
            item.style.opacity = "1";
            item.style.transform = "translateX(0)";
          });
        }, 700);
        return () => clearTimeout(t);
      }
    }
  };

  return (
    <>
    <div className="panels-container desktop-panels" ref={containerRef}>
      {panels.map((panel, i) => (
        <div
          key={panel.id}
          ref={el => { panelRefs.current[i] = el; }}
          className="panel"
          style={{ width: NORMAL_W, flex: "none", cursor: "pointer" }}
          onClick={() => handleExpand(panel.id)}
        >
          <div className="panel-bg-image" style={{ backgroundImage: `url(${panel.image})` }} />
          <div className="panel-overlay" />
          <div className="panel-number">{panel.number}</div>
          <div className="panel-pill" style={{ bottom: "246px" }}>{panel.category}</div>

          {/* Footer — title + arrow */}
          <div className="panel-footer">
            <span className="panel-footer-title">{panel.title}</span>
            <button className="panel-footer-arrow" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="14" fill="black" className="panel-footer-arrow rect" />
                <path d="M14.7629 7.58057L13.9071 8.41419L18.4433 12.9665H6.38477V14.1634H18.4433L13.9071 18.6953L14.7629 19.5493L20.7472 13.5649L14.7629 7.58057Z" fill="white" className="panel-footer-arrow path" />
              </svg>
            </button>
          </div>

          {/* Slide-in content panel — covers right ~65% of expanded panel */}
          <div
            ref={el => { contentRefs.current[i] = el; }}
            style={{
              position: "absolute",
              top: 0, right: 0, bottom: 0,
              width: "640px",
              background: "#0a0a0a",
              transform: "translateX(100%)",
              zIndex: 25,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "calc(50vh - 300px)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Sticky header — pill + title */}
            <div style={{ padding: "0 64px 28px", flexShrink: 0, display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="exp-item" style={{ display: "inline-flex", alignItems: "center", padding: "7px 16px", border: "none", borderRadius: 100, fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.6)", background: "#2a2a2a", width: "fit-content" }}>
                {panel.category}
              </div>
              <h2 className="exp-item" style={{ fontSize: 64, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.03em", color: "#ffffff", whiteSpace: "pre-line" }}>
                {panel.title}
              </h2>
            </div>
            {/* Scrollable body */}
            <div ref={el => { scrollBodyRefs.current[i] = el; }} style={{ overflowY: "auto", scrollbarWidth: "none", height: 280, flexShrink: 0, padding: "0 64px 32px", position: "relative" }}>
              <div className="exp-item" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {panel.description.split("\n\n").map((para, j) => (
                  <p key={j} style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.6, color: "rgba(255,255,255,0.5)" }}>{para}</p>
                ))}
              </div>
            </div>
            {/* Static CTA — stays fixed at bottom while text scrolls */}
            <div style={{ padding: "64px 64px 48px", flexShrink: 0 }}>
              <LineButton
                className="exp-item"
                onClick={() => { if (panel.href) navigateWithWipe(panel.href); }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Wipe transition overlay — exit animation */}
      <div ref={wipeGreenRef} style={{ position: "fixed", inset: 0, background: "#11FF00", zIndex: 9999, display: "none", pointerEvents: "none", willChange: "transform" }} />
    </div>

    {/* Mobile layout — hidden on desktop */}
    <div className="mobile-panels-wrapper">
      <MobilePanels wipeRef={wipeGreenRef} />
    </div>

    </>
  );
}
