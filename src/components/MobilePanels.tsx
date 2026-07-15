"use client";


import { useRouter } from "next/navigation";
import gsap from "gsap";

interface PanelData {
  id: number;
  number: string;
  category: string;
  title: string;
  image: string;
  description: string;
  href?: string;
}

function MobileCard({ panel, wipeRef }: { panel: PanelData; wipeRef: React.RefObject<HTMLDivElement | null> }) {
  const router = useRouter();

  const navigate = () => {
    if (!panel.href) return;
    const green = wipeRef.current;
    if (!green) { router.push(panel.href); return; }
    gsap.set(green, { xPercent: -100, display: "block" });
    gsap.to(green, { xPercent: 0, duration: 1.0, ease: "power2.inOut", onComplete: () => { sessionStorage.setItem("wipeEntry", "covered"); router.push(panel.href!); } });
  };

  // First paragraph of description as preview
  const preview = panel.description.split("\n\n")[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      {/* Image */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${panel.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
        {/* Number */}
        <span style={{ position: "absolute", bottom: "-6%", right: "-2%", fontSize: "clamp(120px, 36vw, 200px)", fontWeight: 400, lineHeight: 0.85, letterSpacing: "-0.05em", color: "#ffffff", userSelect: "none", pointerEvents: "none" }}>
          {panel.number}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "28px 24px 40px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", padding: "5px 14px", background: "#2a2a2a", borderRadius: 100, fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.6)", marginBottom: 20 }}>
          {panel.category}
        </div>
        <h2 style={{ fontSize: "clamp(28px, 7vw, 40px)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#ffffff", marginBottom: 20 }}>
          {panel.title.split("\n").map((line, i) => <span key={i} style={{ display: "block" }}>{line}</span>)}
        </h2>
        <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.65, color: "rgba(255,255,255,0.55)", marginBottom: 32 }}>
          {preview}
        </p>
        {panel.href && (
          <button onClick={navigate} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 500, color: "#ffffff" }}>
              View Project
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 7h10M7 2l5 5-5 5" />
              </svg>
            </span>
            <span style={{ display: "block", width: "100%", height: 1, background: "#00ff00" }} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function MobilePanels({ wipeRef }: { wipeRef: React.RefObject<HTMLDivElement | null> }) {
  const panels: PanelData[] = [
    { id: 1, number: "1", category: "Laboratory", title: "Discovery\nIndustry Solutions", image: "/images/1.jpg", href: "/laboratory", description: "There is a discovery at the root of every breakthrough. A process refined in a laboratory that becomes the backbone of an entire industry. We design the systems that make those discoveries repeatable, scalable, and real.\n\nOur laboratory solutions power research facilities, pharmaceutical plants, and advanced testing environments across the globe." },
    { id: 2, number: "2", category: "Engineering", title: "Synthetic\nFibers Metal", image: "/images/2.jpg", href: "/engineering", description: "There is a thread running through every skyscraper that defies wind. A fiber reinforcing every bulletproof vest that saves a life. A composite bonding the hull of every vessel that crosses the deepest ocean.\n\nThat thread, that fiber, that composite, that alloy — it starts with us." },
    { id: 3, number: "3", category: "Lab Production", title: "Racks\nExhibition System", image: "/images/3.jpg", href: "/lab-production", description: "Precision-engineered rack systems designed for the demands of modern exhibition and laboratory environments. Every joint, every surface, every configuration built for performance under pressure.\n\nFrom modular display solutions to heavy-load laboratory shelving, our systems adapt to any environment without compromise." },
    { id: 4, number: "4", category: "Project 3D", title: "Analysis\nProduct Sketch", image: "/images/4.jpg", href: "/project-3d", description: "From initial sketch to final analysis, we bridge the gap between concept and production. Our 3D design and analysis pipeline turns ideas into manufacturable realities with precision that eliminates guesswork.\n\nEvery surface is tested virtually before it is built physically — reducing waste, accelerating timelines, and improving outcomes." },
  ];

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", paddingTop: 100, paddingBottom: 80 }}>
      {/* Hero label */}
      <div style={{ padding: "0 24px 48px" }}>
        <div style={{ fontSize: "clamp(36px, 10vw, 56px)", fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.04em", color: "#ffffff" }}>
          Discovery<br />Industry<br />Solutions
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {panels.map(panel => (
          <MobileCard key={panel.id} panel={panel} wipeRef={wipeRef} />
        ))}
      </div>
    </div>
  );
}
