"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import LineButton from "@/components/LineButton";
import Nav from "@/components/Nav";

const WIPE_DURATION_MS = 1200;

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

// Reusable mask+zoom hook for a single image container
function useMaskZoom(maskRef: React.RefObject<HTMLDivElement | null>, imgRef: React.RefObject<HTMLImageElement | null>, delay = 0) {
  useEffect(() => {
    const mask = maskRef.current;
    const img = imgRef.current;
    if (!mask || !img) return;
    img.style.transition = "none";
    img.style.transform = "scale(1.12)";
    const trigger = () => {
      mask.style.transition = "transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)";
      mask.style.transform = "translateX(101%)";
      img.style.transition = "transform 1.4s cubic-bezier(0.25, 1, 0.5, 1)";
      img.style.transform = "scale(1)";
    };
    if (delay > 0) {
      const t = setTimeout(trigger, delay);
      return () => clearTimeout(t);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        trigger();
      },
      { threshold: 0.2 }
    );
    if (mask.parentElement) observer.observe(mask.parentElement);
    return () => observer.disconnect();
  }, []);
}

const team = [
  { name: "James Okafor", role: "Chief Executive Officer", image: "/portraits/brock-wegner-eVFS823apQI-unsplash.jpg", bio: "James joined Reverb in 1998 as a structural composites engineer and has led the company since 2011. Under his leadership Reverb expanded into six new markets and tripled its engineering headcount." },
  { name: "Sarah Mitchell", role: "Head of Engineering", image: "/portraits/rachel-mcdermott-0fN7Fxv1eWA-unsplash.jpg", bio: "Sarah oversees all applied engineering programmes across aerospace, defense, and civil infrastructure. She holds patents in high-tensile fiber bonding and spent 12 years at the Advanced Materials Lab in Stuttgart before joining Reverb." },
  { name: "Daniel Reeves", role: "Director of Materials Science", image: "/portraits/jack-finnigan-rriAI0nhcbc-unsplash.jpg", bio: "Daniel leads the research division responsible for every new alloy and polymer compound Reverb brings to market. His team operates a dedicated test facility running over 4,000 simulated load cycles per week." },
  { name: "Amara Nwosu", role: "VP of Aerospace Partnerships", image: "/portraits/wadi-lissa-PaLmMJNVTm0-unsplash.jpg", bio: "Amara manages strategic relationships with Reverb's aerospace clients across North America and Europe, ensuring material specifications align with evolving flight certification standards." },
  { name: "Lena Hoffmann", role: "Chief Materials Chemist", image: "/portraits/hamidreza-ghasemi-zMMVg2eO2OQ-unsplash.jpg", bio: "Lena leads polymer synthesis research at Reverb's Frankfurt facility. Her team developed the proprietary bonding compound now used in three major defense programmes across NATO member states." },
  { name: "Marcus Tang", role: "Head of Production Engineering", image: "/portraits/ike-J6n7FWxaa2E-unsplash.jpg", bio: "Marcus oversees the full production floor across Reverb's four manufacturing sites. He introduced the continuous-load testing protocol that raised the company's QA pass rate to 99.7%." },
  { name: "Priya Desai", role: "Director of Civil Infrastructure", image: "/portraits/tekimax-0OczC2-oFsA-unsplash.jpg", bio: "Priya leads Reverb's civil engineering division, specialising in structural reinforcement for bridges, tunnels, and high-rise foundations across Asia-Pacific and the Middle East." },
];

const R = 216, CX = 252, CY = 252;
const LAT_FRACS = [-0.6, -0.3, 0, 0.3, 0.6];
const LON_COUNT = 5;

function GlobeIcon() {
  useEffect(() => {
    const T = 7;
    for (let i = 0; i < LON_COUNT; i++) {
      const el = document.getElementById(`about-globe-lon-${i}`);
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
        <ellipse key={i} id={`about-globe-lon-${i}`} cx={CX} cy={CY} rx={0} ry={R} stroke="#0a0a0a" strokeWidth="1.2" strokeOpacity="0.6" />
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
    const letters = wrap.querySelectorAll<HTMLSpanElement>(".about-footer-letter");
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
        {"Reverb.".split("").map((char, i) => <span key={i} className="about-footer-letter">{char}</span>)}
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

const CARD_W = 380;
const CARD_GAP = 24;
const CARD_STEP = CARD_W + CARD_GAP;
const PANEL_W = 640;

const MOCK_EXPERIENCE = [
  "James joined Reverb in 1998 as a structural composites engineer and has led the company as Chief Executive Officer since 2011. Under his leadership, Reverb expanded into six new markets, tripled its engineering headcount, and established partnerships across the aerospace, civil infrastructure, and defence sectors on four continents.",
  "Before taking the executive role, James spent seven years as VP of Structural Engineering, overseeing a cross-disciplinary team of 80 engineers and directing some of Reverb's most complex defence programmes in the US, UK, and Germany. He developed the high-tensile bonding techniques now protected by four active patents and built the foundational QA testing protocol still in use across all Reverb production sites.",
  "James holds a doctorate in materials science from Imperial College London and completed postdoctoral research at the Advanced Structures Institute, where he published six peer-reviewed papers on load distribution in asymmetric composites. He serves on the advisory board of the European Composites Forum and is a fellow of the Institute of Structural Engineers.",
];

// Inline expand panel that opens after a card in the flex track
function TeamExpandPanel({ member, onClose }: { member: typeof team[0]; onClose: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const isClosing = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    gsap.set(wrap, { width: 0 });
    gsap.set(inner, { clipPath: "inset(0 100% 0 0)" });

    gsap.to(wrap, {
      width: PANEL_W,
      duration: 0.65,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.to(inner, { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "power3.out" });
      },
    });
  }, []);

  const handleClose = () => {
    if (isClosing.current) return;
    isClosing.current = true;
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) { onClose(); return; }
    gsap.to(inner, { clipPath: "inset(0 100% 0 0)", duration: 0.3, ease: "power3.in" });
    gsap.to(wrap, { width: 0, duration: 0.55, ease: "power3.inOut", delay: 0.2, onComplete: onClose });
  };

  return (
    <div ref={wrapRef} style={{ flexShrink: 0, overflow: "hidden", alignSelf: "flex-start", marginLeft: -CARD_GAP }}>
      <div ref={innerRef} style={{ width: PANEL_W, background: "#00ff00", clipPath: "inset(0 100% 0 0)", position: "relative" }}>
        {/* Close */}
        <button
          onClick={handleClose}
          style={{ position: "absolute", top: 24, right: 24, width: 36, height: 36, background: "rgba(0,0,0,0.1)", border: "none", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 2L3 7l6 5" />
          </svg>
        </button>

        {/* Content */}
        <div style={{ padding: "48px 48px 64px", overflowY: "auto", maxHeight: "calc(380px * 4 / 3)", scrollbarWidth: "none" }}>
          <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: 20 }}>Leadership Profile</div>
          <h3 style={{ fontSize: 36, fontWeight: 500, color: "#0a0a0a", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 8 }}>{member.name}</h3>
          <div style={{ fontSize: 16, color: "rgba(0,0,0,0.55)", marginBottom: 40 }}>{member.role}</div>

          <div style={{ borderTop: "1px solid rgba(0,0,0,0.12)", paddingTop: 32, display: "flex", flexDirection: "column", gap: 24 }}>
            {MOCK_EXPERIENCE.map((para, i) => (
              <p key={i} style={{ fontSize: 17, lineHeight: 1.75, color: "rgba(0,0,0,0.75)", margin: 0 }}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual carousel card
function TeamCard({ member, openIndex, cardIndex, onOpen, registerRefs }: {
  member: typeof team[0];
  openIndex: number | null;
  cardIndex: number;
  onOpen: (i: number) => void;
  registerRefs: (i: number, mask: HTMLDivElement | null, img: HTMLImageElement | null) => void;
}) {
  const maskRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const isOpen = openIndex === cardIndex;

  useEffect(() => {
    registerRefs(cardIndex, maskRef.current, imgRef.current);
    if (imgRef.current) {
      imgRef.current.style.transition = "none";
      imgRef.current.style.transform = "scale(1.12)";
    }
  }, []);

  return (
    <div style={{ flexShrink: 0, width: CARD_W, display: "flex", flexDirection: "column", gap: 20, transition: "opacity 0.3s ease", opacity: openIndex !== null && !isOpen ? 0.4 : 1 }}>
      <div
        onClick={() => onOpen(cardIndex)}
        style={{ position: "relative", overflow: "hidden", borderRadius: 4, aspectRatio: "3/4", cursor: "pointer" }}
      >
        <img
          ref={imgRef}
          src={member.image}
          alt={member.name}
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "grayscale(100%)", pointerEvents: "none", transition: "transform 0.4s ease" }}
        />
        <div ref={maskRef} style={{ position: "absolute", inset: 0, background: "#0a0a0a", transform: "translateX(0%)", willChange: "transform" }} />
        {/* Hover overlay */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.3s ease", zIndex: 1 }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,0,0,0.2)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0)")}
        />
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 500, color: "#ffffff", marginBottom: 4 }}>{member.name}</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>{member.role}</div>
        <LineButton onClick={() => onOpen(cardIndex)}>Read more</LineButton>
      </div>
    </div>
  );
}

function TeamCarousel() {
  const [active, setActive] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const isDragging = useRef(false);
  const maskRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const hasRevealed = useRef(false);

  const registerRefs = useCallback((i: number, mask: HTMLDivElement | null, img: HTMLImageElement | null) => {
    maskRefs.current[i] = mask;
    imgRefs.current[i] = img;
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasRevealed.current) return;
      hasRevealed.current = true;
      observer.disconnect();
      maskRefs.current.forEach((mask, i) => {
        const img = imgRefs.current[i];
        if (!mask || !img) return;
        setTimeout(() => {
          mask.style.transition = "transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)";
          mask.style.transform = "translateX(101%)";
          img.style.transition = "transform 1.4s cubic-bezier(0.25, 1, 0.5, 1)";
          img.style.transform = "scale(1)";
        }, i * 80);
      });
    }, { threshold: 0.15 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleOpen = useCallback((i: number) => {
    if (openIndex === i) {
      setOpenIndex(null);
      return;
    }
    setOpenIndex(i);
    // Scroll so the card + panel are visible
    setTimeout(() => {
      trackRef.current?.scrollTo({ left: i * CARD_STEP, behavior: "smooth" });
    }, 50);
  }, [openIndex]);

  const scrollTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(team.length - 1, idx));
    setActive(clamped);
    trackRef.current?.scrollTo({ left: clamped * CARD_STEP, behavior: "smooth" });
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX;
    startScroll.current = trackRef.current?.scrollLeft ?? 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    trackRef.current.scrollLeft = startScroll.current - (e.pageX - startX.current);
  };
  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = e.pageX - startX.current;
    if (Math.abs(delta) > 40) scrollTo(active + (delta < 0 ? 1 : -1));
    else scrollTo(active);
  };

  // Build flex items: cards with panel injected after openIndex card
  const items: React.ReactNode[] = [];
  team.forEach((member, i) => {
    items.push(
      <TeamCard key={member.name} member={member} openIndex={openIndex} cardIndex={i} onOpen={handleOpen} registerRefs={registerRefs} />
    );
    if (openIndex === i) {
      items.push(
        <TeamExpandPanel key={`panel-${i}`} member={member} onClose={() => setOpenIndex(null)} />
      );
    }
  });

  return (
    <section ref={sectionRef} style={{ margin: "0 0 160px" }}>
      <div style={{ paddingLeft: 64, paddingRight: 64, maxWidth: 1200, margin: "0 auto 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", margin: 0 }}>
          Leadership
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {team.map((_, i) => (
              <button key={i} onClick={() => scrollTo(i)} style={{ width: active === i ? 20 : 6, height: 6, borderRadius: 3, background: active === i ? "#ffffff" : "rgba(255,255,255,0.2)", border: "none", padding: 0, cursor: "pointer", transition: "width 0.3s ease, background 0.3s ease" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ dir: -1, label: "←" }, { dir: 1, label: "→" }].map(({ dir, label }) => (
              <button key={dir} onClick={() => scrollTo(active + dir)} disabled={dir < 0 ? active === 0 : active === team.length - 1} style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#ffffff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: (dir < 0 ? active === 0 : active === team.length - 1) ? 0.25 : 1, transition: "opacity 0.2s ease" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ display: "flex", gap: CARD_GAP, paddingLeft: 64, paddingRight: 64, overflowX: "auto", cursor: "grab", userSelect: "none", scrollbarWidth: "none", alignItems: "flex-start" }}
      >
        {items}
      </div>
    </section>
  );
}

const STATS = [
  { end: 1984, suffix: "", label: ["Year", "founded"] },
  { end: 6, suffix: "", label: ["Continents", "served"] },
  { end: 340, suffix: "+", label: ["Active client", "partnerships"] },
  { end: 99.7, suffix: "%", label: ["Production", "uptime"] },
];

function StatCounter({ end, suffix, label, delay }: { end: number; suffix: string; label: string[]; delay: number }) {
  const numRef = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = numRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasRun.current) return;
      hasRun.current = true;
      observer.disconnect();

      const isDecimal = end % 1 !== 0;
      const duration = 1800;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * end;
        el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current).toString();
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = isDecimal ? end.toFixed(1) : end.toString();
      };

      setTimeout(() => requestAnimationFrame(tick), delay);
    }, { threshold: 0.3 });

    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} style={{ padding: "48px 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      <div style={{ fontSize: 82, fontWeight: 400, letterSpacing: "-0.04em", color: "#ffffff", lineHeight: 1, marginBottom: 16 }}>
        <span ref={numRef}>0</span>{suffix}
      </div>
      <div style={{ fontSize: 20, fontWeight: 400, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>
        {label[0]}<br />{label[1]}
      </div>
    </div>
  );
}

function StatGrid() {
  return (
    <section style={{ paddingLeft: 64, paddingRight: 64, maxWidth: 1200, margin: "0 auto 120px" }}>
      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
        {STATS.map((s, i) => (
          <StatCounter key={i} end={s.end} suffix={s.suffix} label={s.label} delay={i * 120} />
        ))}
      </div>
    </section>
  );
}

export default function AboutPage() {
  const heroMaskRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);
  useScrollReveal();
  useMaskZoom(heroMaskRef, heroImgRef, WIPE_DURATION_MS + 100);

  useEffect(() => {
    document.body.style.background = "#0a0a0a";
    return () => { document.body.style.background = ""; };
  }, []);

  return (
    <>
    <Nav />
    <main style={{ background: "#0a0a0a", color: "#ffffff", minHeight: "100vh", fontFamily: "var(--font-instrument-sans), sans-serif" }}>

      {/* Hero text */}
      <section style={{ paddingTop: 180, paddingBottom: 48, paddingLeft: 64, paddingRight: 64, maxWidth: 1200, margin: "0 auto" }}>
        <div data-reveal data-delay="0.05" style={{ display: "inline-flex", alignItems: "center", padding: "7px 16px", background: "#1a1a1a", borderRadius: 100, fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 32 }}>
          About us
        </div>
        <h1 data-reveal data-delay="0.1" style={{ fontSize: "clamp(56px, 8vw, 100px)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#ffffff", marginBottom: 0 }}>
          Built on four<br />decades of precision.
        </h1>
      </section>

      {/* Intro text */}
      <section style={{ paddingLeft: 64, paddingRight: 64, maxWidth: 1200, margin: "0 auto 120px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div data-reveal data-delay="0.0" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <p style={{ fontSize: 24, fontWeight: 400, lineHeight: 1.5, color: "#ffffff" }}>
              Reverb was founded in 1984 by a group of materials engineers who believed the world's most critical infrastructure deserved better than what existed. Not incremental improvement — a fundamental rethinking of how synthetic fibers and metal alloys are designed, tested, and brought to market.
            </p>
            <p style={{ fontSize: 24, fontWeight: 400, lineHeight: 1.5, color: "#ffffff" }}>
              Forty years later, that conviction still drives every decision we make.
            </p>
          </div>
          <div data-reveal data-delay="0.15" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "rgba(255,255,255,0.65)" }}>
              We operate at the intersection of chemistry, metallurgy, and applied engineering — a space where most companies pick one discipline and stop. We didn't. Our integrated approach means a single team can take a material from molecular design to full-scale production without ever losing sight of the end use case.
            </p>
            <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "rgba(255,255,255,0.65)" }}>
              That's how you build a bridge that doesn't flex when it shouldn't. A fuselage that holds at 40,000 feet. A vest that stops what it's supposed to stop. We don't build the final product — we make sure it works.
            </p>
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section style={{ paddingLeft: 64, paddingRight: 64, maxWidth: 1200, margin: "0 auto 120px" }}>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 80 }}>
          <p data-reveal data-delay="0.05" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, lineHeight: 1.25, letterSpacing: "-0.02em", color: "#00ff00", maxWidth: 900 }}>
            "We are not in the business of materials. We are in the business of outcomes. Our clients measure success in structural integrity, load cycles, and service life — so we do too."
          </p>
          <p data-reveal data-delay="0.15" style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 32, letterSpacing: "0.04em" }}>
            James Okafor — Chief Executive Officer, Reverb
          </p>
        </div>
      </section>

      {/* What we do */}
      <section style={{ paddingLeft: 64, paddingRight: 64, maxWidth: 1200, margin: "0 auto 120px" }}>
        <h2 data-reveal data-delay="0" style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 64 }}>
          What we do
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
          {[
            { title: "Chemical Synthetic Fibers", body: "Proprietary polymer chains engineered for tensile strength beyond natural limits. Used in structural reinforcement, ballistic protection, and deep-sea cabling where failure is not an option." },
            { title: "Precision Metal Alloys", body: "Custom compositions developed for specific load, temperature, and corrosion profiles. From aerospace fasteners to marine hull plating, every alloy is formulated for its exact operating environment." },
            { title: "Applied Engineering", body: "Our engineering division works embedded with clients to translate material properties into real-world performance. We don't hand off a data sheet — we stay until the structure is validated." },
          ].map(({ title, body }, i) => (
            <div key={title} data-reveal data-delay={`${i * 0.1}`} style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 40, paddingRight: 40 }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: "#ffffff", marginBottom: 20, lineHeight: 1.3 }}>{title}</div>
              <p style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.7, color: "rgba(255,255,255,0.5)" }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team carousel */}
      <TeamCarousel />

      {/* Stats */}
      <StatGrid />

      <FooterSection />
    </main>
    </>
  );
}
