"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import Nav from "@/components/Nav";

const WIPE_DURATION_MS = 1200;

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    els.forEach((el) => { el.style.opacity = "0"; el.style.transform = "translateX(-32px)"; el.style.transition = "none"; });
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay ?? "0";
            el.style.transition = `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(0.25, 1, 0.5, 1) ${delay}s`;
            el.style.opacity = "1"; el.style.transform = "translateX(0)";
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.12 });
      els.forEach((el) => observer.observe(el));
    }, WIPE_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);
}

const R = 216, CX = 252, CY = 252;
const LAT_FRACS = [-0.6, -0.3, 0, 0.3, 0.6];
const LON_COUNT = 5;

function GlobeIcon() {
  useEffect(() => {
    const T = 7;
    for (let i = 0; i < LON_COUNT; i++) {
      const el = document.getElementById(`p3d-globe-lon-${i}`);
      if (!el) return;
      gsap.fromTo(el, { attr: { rx: 0 } }, { attr: { rx: R }, duration: T / 2, delay: -(i / LON_COUNT) * T, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }
  }, []);
  return (
    <svg width="504" height="504" viewBox="0 0 504 504" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx={CX} cy={CY} r={R} stroke="#0a0a0a" strokeWidth="2" />
      {LAT_FRACS.map((f, i) => { const cy = CY + f * R; const rx = R * Math.sqrt(1 - f * f); return <ellipse key={i} cx={CX} cy={cy} rx={rx} ry={Math.max(rx * 0.18, 6)} stroke="#0a0a0a" strokeWidth={f === 0 ? "2" : "1.2"} strokeOpacity={f === 0 ? "1" : "0.55"} />; })}
      {Array.from({ length: LON_COUNT }, (_, i) => <ellipse key={i} id={`p3d-globe-lon-${i}`} cx={CX} cy={CY} rx={0} ry={R} stroke="#0a0a0a" strokeWidth="1.2" strokeOpacity="0.6" />)}
    </svg>
  );
}

function FooterSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);
  useEffect(() => {
    const wrap = wrapRef.current; if (!wrap) return;
    const letters = wrap.querySelectorAll<HTMLSpanElement>(".p3d-footer-letter");
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
        {"Reverb.".split("").map((char, i) => <span key={i} className="p3d-footer-letter">{char}</span>)}
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: 48, marginBottom: 8, alignItems: "flex-start" }}>
        {[{ city: "London", lines: ["12 Broadgate Circle", "London EC2M 2QS", "United Kingdom"] }, { city: "New York", lines: ["340 Madison Avenue", "New York, NY 10173", "United States"] }, { city: "Tokyo", lines: ["2-7-3 Marunouchi", "Chiyoda, Tokyo 100-0005", "Japan"] }].map(({ city, lines }) => (
          <div key={city} style={{ fontSize: 13, fontWeight: 400, lineHeight: 1.7, color: "#0a0a0a", opacity: 0.7 }}>
            <div style={{ fontWeight: 600, marginBottom: 4, opacity: 1 }}>{city}</div>
            {lines.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        ))}
      </div>
    </footer>
  );
}

export default function Project3DPage() {
  const heroMaskRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  const bodyMaskRef = useRef<HTMLDivElement>(null);
  const bodyImgRef = useRef<HTMLImageElement>(null);
  const fullMaskRef = useRef<HTMLDivElement>(null);
  const fullImgRef = useRef<HTMLImageElement>(null);
  useScrollReveal();

  useEffect(() => {
    const mask = heroMaskRef.current; const img = heroImgRef.current; if (!mask || !img) return;
    img.style.transition = "none"; img.style.transform = "scale(1.12)";
    const timer = setTimeout(() => { mask.style.transition = "transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)"; mask.style.transform = "translateX(101%)"; img.style.transition = "transform 1.4s cubic-bezier(0.25, 1, 0.5, 1)"; img.style.transform = "scale(1)"; }, WIPE_DURATION_MS + 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mask = bodyMaskRef.current; const img = bodyImgRef.current; if (!mask || !img) return;
    img.style.transition = "none"; img.style.transform = "scale(1.12)";
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) return; observer.disconnect(); mask.style.transition = "transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)"; mask.style.transform = "translateX(101%)"; img.style.transition = "transform 1.4s cubic-bezier(0.25, 1, 0.5, 1)"; img.style.transform = "scale(1)"; }, { threshold: 0.2 });
    if (mask.parentElement) observer.observe(mask.parentElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mask = fullMaskRef.current; const img = fullImgRef.current; if (!mask || !img) return;
    img.style.transition = "none"; img.style.transform = "scale(1.12)";
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) return; observer.disconnect(); mask.style.transition = "transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)"; mask.style.transform = "translateX(101%)"; img.style.transition = "transform 1.4s cubic-bezier(0.25, 1, 0.5, 1)"; img.style.transform = "scale(1)"; }, { threshold: 0.2 });
    if (mask.parentElement) observer.observe(mask.parentElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => { document.body.style.background = "#0a0a0a"; return () => { document.body.style.background = ""; }; }, []);

  return (
    <>
    <Nav />
    <main style={{ background: "#0a0a0a", color: "#ffffff", minHeight: "100vh", fontFamily: "var(--font-instrument-sans), sans-serif" }}>

      <section style={{ paddingTop: 160, paddingBottom: 80, paddingLeft: 64, paddingRight: 64, maxWidth: 1200, margin: "0 auto" }}>
        <h1 data-reveal data-delay="0.1" style={{ fontSize: "100px", fontWeight: 400, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#ffffff", marginBottom: 28 }}>
          Analysis<br/>Product Sketch
        </h1>
        <div data-reveal data-delay="0.2" style={{ display: "inline-flex", alignItems: "center", padding: "7px 16px", background: "#1a1a1a", borderRadius: 100, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
          Project 3D
        </div>
      </section>

      <section style={{ paddingLeft: 64, paddingRight: 64, maxWidth: 1200, margin: "0 auto 80px" }}>
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 4, aspectRatio: "16/9" }}>
          <img ref={heroImgRef} src="/images/4.jpg" alt="Project 3D" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
          <span style={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)", fontSize: "clamp(280px, 36vw, 560px)", fontWeight: 400, lineHeight: 1, letterSpacing: "-0.05em", color: "#ffffff", userSelect: "none" }}>4</span>
          <div ref={heroMaskRef} style={{ position: "absolute", inset: 0, background: "#0a0a0a", transform: "translateX(0%)", willChange: "transform" }} />
        </div>
      </section>

      <section style={{ paddingLeft: 64, paddingRight: 64, maxWidth: 1200, margin: "0 auto 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <p data-reveal data-delay="0.1" style={{ fontSize: 24, fontWeight: 400, lineHeight: 1.5, color: "#ffffff" }}>
              From initial sketch to final analysis, we bridge the gap between concept and production. Our 3D design and analysis pipeline turns ideas into manufacturable realities with precision that eliminates guesswork.
            </p>
            <p data-reveal data-delay="0.2" style={{ fontSize: 24, fontWeight: 400, lineHeight: 1.5, color: "#ffffff" }}>
              Every surface is tested virtually before it is built physically — reducing waste, accelerating timelines, and improving outcomes.
            </p>
            <p data-reveal data-delay="0.3" style={{ fontSize: 24, fontWeight: 400, lineHeight: 1.5, color: "#ffffff" }}>
              Finite element analysis, fluid simulation, and topology optimisation run concurrently so that every design decision is backed by data before a single prototype is cut.
            </p>
            <p data-reveal data-delay="0.4" style={{ fontSize: 24, fontWeight: 400, lineHeight: 1.5, color: "#ffffff" }}>
              Our design team works embedded within your engineering workflow, speaking the language of tolerances, materials, and manufacturing constraints from day one.
            </p>
          </div>
          <div style={{ position: "relative", overflow: "hidden", borderRadius: 4, height: 1020 }}>
            <img ref={bodyImgRef} src="/images/2.jpg" alt="Project 3D detail" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div ref={bodyMaskRef} style={{ position: "absolute", inset: 0, background: "#0a0a0a", transform: "translateX(0%)", willChange: "transform" }} />
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 80 }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "21/9", overflow: "hidden" }}>
          <img ref={fullImgRef} src="/images/3.jpg" alt="Full width" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div ref={fullMaskRef} style={{ position: "absolute", inset: 0, background: "#0a0a0a", transform: "translateX(0%)", willChange: "transform" }} />
        </div>
      </section>

      <section style={{ paddingLeft: 64, paddingRight: 64, maxWidth: 1200, margin: "0 auto 120px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
          <div data-reveal data-delay="0" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#ffffff" }}>
              We have delivered concept-to-production programmes across consumer electronics, medical devices, industrial equipment, and architectural hardware — each one on time, within tolerance, and ready for the line.
            </p>
            <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#ffffff" }}>
              If your product has to be right the first time, this is where the process starts.
            </p>
          </div>
          <div data-reveal data-delay="0.15" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#ffffff" }}>
              The result: fewer revisions, faster sign-off, and products that perform exactly as designed. Our integrated pipeline removes the gap between design intent and manufacturing reality.
            </p>
            <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#ffffff" }}>
              Precision is not a stage in the process. It is the process, from the first line drawn to the last tolerance signed off.
            </p>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
    </>
  );
}
