"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export interface PanelData {
  id: number;
  number: string;
  category: string;
  title: string;
  image: string;
  description: string;
}

interface Props {
  panel: PanelData;
  allPanels: PanelData[];
  onClose: () => void;
  onSwitch: (panel: PanelData) => void;
}

export default function PanelDetail({ panel, allPanels, onClose, onSwitch }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentItemsRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const others = allPanels.filter((p) => p.id !== panel.id);

  useEffect(() => {
    gsap.killTweensOf([overlayRef.current, closeRef.current]);
    if (contentItemsRef.current) {
      gsap.killTweensOf(contentItemsRef.current.children);
      [...contentItemsRef.current.children].forEach((child) => {
        (child as HTMLElement).style.opacity = "";
        (child as HTMLElement).style.transform = "";
        (child as HTMLElement).style.transition = "";
      });
    }

    gsap.set(overlayRef.current, { clipPath: "inset(0 100% 0 0)" });

    if (contentItemsRef.current) {
      (contentItemsRef.current as HTMLElement).style.opacity = "0";
      (contentItemsRef.current as HTMLElement).style.transform = "translateY(16px)";
      (contentItemsRef.current as HTMLElement).style.transition = "none";
    }
    if (closeRef.current) {
      closeRef.current.style.opacity = "0";
      closeRef.current.style.transition = "none";
    }

    const revealContent = () => {
      if (overlayRef.current) overlayRef.current.style.clipPath = "inset(0 0% 0 0)";
      if (contentItemsRef.current) {
        (contentItemsRef.current as HTMLElement).style.transition = "opacity 0.4s ease, transform 0.4s ease";
        (contentItemsRef.current as HTMLElement).style.opacity = "1";
        (contentItemsRef.current as HTMLElement).style.transform = "translateY(0px)";
      }
      if (closeRef.current) {
        closeRef.current.style.transition = "opacity 0.3s ease";
        closeRef.current.style.opacity = "1";
      }
    };

    gsap.to(overlayRef.current, {
      clipPath: "inset(0 0% 0 0)",
      duration: 0.65,
      ease: "power3.inOut",
      onComplete: revealContent,
    });

    // Fallback: force-reveal content after animation duration + buffer
    // (needed when GSAP RAF pauses in background tabs before onComplete fires)
    const t = setTimeout(revealContent, 900);
    return () => clearTimeout(t);
  }, [panel.id]);

  const handleClose = () => {
    if (contentItemsRef.current) {
      (contentItemsRef.current as HTMLElement).style.transition = "opacity 0.15s ease, transform 0.15s ease";
      (contentItemsRef.current as HTMLElement).style.opacity = "0";
      (contentItemsRef.current as HTMLElement).style.transform = "translateY(-10px)";
    }
    if (closeRef.current) {
      closeRef.current.style.transition = "opacity 0.15s ease";
      closeRef.current.style.opacity = "0";
    }
    gsap.to(overlayRef.current, {
      clipPath: "inset(0 0% 0 100%)",
      duration: 0.5,
      ease: "power3.inOut",
      delay: 0.1,
      onComplete: onClose,
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={overlayRef} className="panel-detail-overlay" style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", overflow: "hidden" }}>

      {/* Left — thumbnail strips for other panels */}
      <div className="panel-detail-thumbstrip" style={{ width: "13%", height: "100%", background: "#111111", display: "flex", flexDirection: "column", flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        {others.map((p) => (
          <button
            key={p.id}
            className="panel-detail-thumbstrip-item"
            style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", padding: "20px 16px 16px", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.06)", outline: "none", cursor: "pointer", opacity: 0.5, overflow: "hidden" }}
            onClick={() => onSwitch(p)}
            onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "0.5")}
            aria-label={`View panel ${p.number}`}
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: "#fff", marginBottom: 10, display: "block" }}>{p.number}</span>
            <div
              style={{ width: "100%", flex: 1, backgroundImage: `url(${p.image})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.8 }}
            />
          </button>
        ))}
      </div>

      {/* Center — active image with big number */}
      <div className="panel-detail-image-col" style={{ position: "relative", width: "37%", height: "100%", flexShrink: 0, overflow: "hidden" }}>
        <div className="panel-detail-image" style={{ position: "absolute", inset: 0, backgroundImage: `url(${panel.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="panel-detail-image-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
        <span className="panel-detail-number" style={{ position: "absolute", top: "50%", left: "-6%", transform: "translateY(calc(-50% - 40px))", fontSize: "clamp(200px, 28vw, 340px)", fontWeight: 400, lineHeight: 0.82, letterSpacing: "-0.05em", color: "#ffffff", pointerEvents: "none", userSelect: "none", zIndex: 2 }}>{panel.number}</span>
      </div>

      {/* Right — dark content */}
      <div className="panel-detail-right" style={{ position: "relative", flex: 1, height: "100%", background: "#0a0a0a", display: "flex", alignItems: "center", overflowY: "auto" }}>
        <button ref={closeRef} className="panel-detail-close" onClick={handleClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M2 2l14 14M16 2L2 16" />
          </svg>
        </button>

        <div ref={contentItemsRef} className="panel-detail-content">
          <div className="panel-detail-pill">{panel.category}</div>
          <h2 className="panel-detail-title">{panel.title.replace("\n", " ")}</h2>
          <div className="panel-detail-body">
            {panel.description.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <button className="panel-detail-cta">
            View Project
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7h10M7 2l5 5-5 5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
