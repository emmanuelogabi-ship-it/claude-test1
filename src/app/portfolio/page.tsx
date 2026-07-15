"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import LineButton from "@/components/LineButton";
import Nav from "@/components/Nav";

const WIPE_DURATION_MS = 1200;

const R = 216, CX = 252, CY = 252;
const LAT_FRACS = [-0.6, -0.3, 0, 0.3, 0.6];
const LON_COUNT = 5;

function GlobeIcon() {
  useEffect(() => {
    const T = 7;
    for (let i = 0; i < LON_COUNT; i++) {
      const el = document.getElementById(`portfolio-globe-lon-${i}`);
      if (!el) return;
      gsap.fromTo(el, { attr: { rx: 0 } }, { attr: { rx: R }, duration: T / 2, delay: -(i / LON_COUNT) * T, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }
  }, []);
  return (
    <svg width="504" height="504" viewBox="0 0 504 504" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx={CX} cy={CY} r={R} stroke="#0a0a0a" strokeWidth="2" />
      {LAT_FRACS.map((f, i) => {
        const cy = CY + f * R; const rx = R * Math.sqrt(1 - f * f);
        return <ellipse key={i} cx={CX} cy={cy} rx={rx} ry={Math.max(rx * 0.18, 6)} stroke="#0a0a0a" strokeWidth={f === 0 ? "2" : "1.2"} strokeOpacity={f === 0 ? "1" : "0.55"} />;
      })}
      {Array.from({ length: LON_COUNT }, (_, i) => (
        <ellipse key={i} id={`portfolio-globe-lon-${i}`} cx={CX} cy={CY} rx={0} ry={R} stroke="#0a0a0a" strokeWidth="1.2" strokeOpacity="0.6" />
      ))}
    </svg>
  );
}

function FooterSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const letters = wrap.querySelectorAll<HTMLSpanElement>(".pf-footer-letter");
    letters.forEach(l => { l.style.display = "inline-block"; l.style.opacity = "0"; l.style.transform = "translateY(60px)"; l.style.transition = "none"; });
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasRun.current) {
        hasRun.current = true; observer.disconnect();
        letters.forEach((l, i) => gsap.to(l, { opacity: 1, y: 0, duration: 0.7, delay: i * 0.09, ease: "power3.out" }));
      }
    }, { threshold: 0.3 });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);
  return (
    <footer style={{ margin: "0px 64px 64px", borderRadius: 16, background: "#00ff00", padding: "80px 64px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 640, boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -120, right: -120, pointerEvents: "none" }}><GlobeIcon /></div>
      <div ref={wrapRef} style={{ fontSize: "clamp(80px, 14vw, 180px)", fontWeight: 800, letterSpacing: "-0.05em", color: "#0a0a0a", lineHeight: 0.85, overflow: "hidden" }}>
        {"Reverb.".split("").map((char, i) => <span key={i} className="pf-footer-letter">{char}</span>)}
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: 48, marginBottom: 8, alignItems: "flex-start" }}>
        {[
          { city: "London", lines: ["12 Broadgate Circle", "London EC2M 2QS", "United Kingdom"] },
          { city: "New York", lines: ["340 Madison Avenue", "New York, NY 10173", "United States"] },
          { city: "Tokyo", lines: ["2-7-3 Marunouchi", "Chiyoda, Tokyo 100-0005", "Japan"] },
        ].map(({ city, lines }) => (
          <div key={city} style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.7, color: "#0a0a0a", opacity: 0.7 }}>
            <div style={{ fontWeight: 600, marginBottom: 4, opacity: 1 }}>{city}</div>
            {lines.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        ))}
      </div>
    </footer>
  );
}

const projects = [
  { number: "1", category: "Laboratory", title: "Discovery\nIndustry Solutions", image: "/images/1.jpg", href: "/laboratory" },
  { number: "2", category: "Engineering", title: "Synthetic\nFibers Metal", image: "/images/2.jpg", href: "/engineering" },
  { number: "3", category: "Lab Production", title: "Racks\nExhibition System", image: "/images/3.jpg", href: "/lab-production" },
  { number: "4", category: "Project 3D", title: "Analysis\nProduct Sketch", image: "/images/4.jpg", href: "/project-3d" },
];

function ProjectRow({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const hasRevealed = useRef(false);
  const isEven = index % 2 === 1;

  useEffect(() => {
    const row = rowRef.current;
    const img = imgRef.current;
    const text = textRef.current;
    const num = numRef.current;
    if (!row || !img || !text || !num) return;

    // Initial hidden state
    img.style.clipPath = "inset(0 100% 0 0)";
    text.style.opacity = "0";
    text.style.transform = "translateX(-24px)";
    text.style.transition = "none";
    num.style.opacity = "0";
    num.style.transition = "none";

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasRevealed.current) return;
      hasRevealed.current = true;
      observer.disconnect();

      // Image wipe
      gsap.to(img, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.inOut" });

      // Number rise
      gsap.to(num, { opacity: 1, duration: 0.7, delay: 0.3, ease: "power3.out" });

      // Text slide in
      setTimeout(() => {
        text.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.25,1,0.5,1)";
        text.style.opacity = "1";
        text.style.transform = "translateX(0)";
      }, 500);
    }, { threshold: 0.15 });

    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  const imageCol = (
    <div style={{ position: "relative", width: "62%", flexShrink: 0, aspectRatio: "16/10", overflow: "hidden" }}>
      <div ref={imgRef} style={{ position: "absolute", inset: 0, backgroundImage: `url(${project.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <span ref={numRef} style={{
        position: "absolute",
        top: "50%",
        right: "-2%",
        transform: "translateY(-50%)",
        fontSize: 460,
        fontWeight: 400,
        lineHeight: 0.85,
        letterSpacing: "-0.05em",
        color: "#ffffff",
        pointerEvents: "none",
        userSelect: "none",
        zIndex: 2,
        opacity: 0,
      }}>{project.number}</span>
    </div>
  );

  const textCol = (
    <div ref={textRef} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px" }}>
      <div style={{ display: "inline-flex", alignItems: "center", padding: "7px 16px", background: "#2a2a2a", borderRadius: 100, fontSize: 13, fontWeight: 400, color: "rgba(255,255,255,0.6)", marginBottom: 24, alignSelf: "flex-start" }}>
        {project.category}
      </div>
      <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.03em", color: "#ffffff", marginBottom: 32 }}>
        {project.title.split("\n").map((line, i) => <span key={i} style={{ display: "block" }}>{line}</span>)}
      </h2>
      <LineButton href={project.href}>View Project</LineButton>
    </div>
  );

  return (
    <div ref={rowRef} style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 120 }}>
      {isEven ? <>{textCol}{imageCol}</> : <>{imageCol}{textCol}</>}
    </div>
  );
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateX(-32px)";
      el.style.transition = "none";
    });
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              const delay = el.dataset.delay ?? "0";
              el.style.transition = `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s`;
              el.style.opacity = "1";
              el.style.transform = "translateX(0)";
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.1 }
      );
      els.forEach((el) => observer.observe(el));
    }, WIPE_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);
}

export default function PortfolioPage() {
  useScrollReveal();

  useEffect(() => {
    document.body.style.background = "#0a0a0a";
    return () => { document.body.style.background = ""; };
  }, []);

  return (
    <>
    <Nav />
    <main style={{ background: "#0a0a0a", color: "#ffffff", minHeight: "100vh", fontFamily: "var(--font-instrument-sans), sans-serif" }}>

      {/* Hero */}
      <section style={{ paddingTop: 180, paddingBottom: 48, paddingLeft: 64, paddingRight: 64, maxWidth: 1200, margin: "0 auto" }}>
        <div data-reveal data-delay="0.05" style={{ display: "inline-flex", alignItems: "center", padding: "7px 16px", background: "#1a1a1a", borderRadius: 100, fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 32 }}>
          Our Work
        </div>
        <h1 data-reveal data-delay="0.1" style={{ fontSize: "clamp(56px, 8vw, 100px)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#ffffff", marginBottom: 0 }}>
          Engineering that<br />outlasts the build.
        </h1>
      </section>


      {/* Project rows */}
      <section style={{ paddingLeft: 0, paddingRight: 0 }}>
        {projects.map((project, i) => (
          <ProjectRow key={i} project={project} index={i} />
        ))}
      </section>

      <FooterSection />
    </main>
    </>
  );
}
