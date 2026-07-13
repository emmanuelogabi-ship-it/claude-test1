"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import PageTransition from "@/components/PageTransition";

// Wipe transition duration — must match PageTransition.tsx
const WIPE_DURATION_MS = 1200;

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");

    // Set initial hidden state immediately so nothing flashes before wipe ends
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateX(-32px)";
      el.style.transition = "none";
    });

    // Start observing only after the wipe has fully swept off screen
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
        { threshold: 0.12 }
      );

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
      const el = document.getElementById(`globe-lon-${i}`);
      if (!el) return;
      gsap.fromTo(
        el,
        { attr: { rx: 0 } },
        {
          attr: { rx: R },
          duration: T / 2,
          delay: -(i / LON_COUNT) * T,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }
      );
    }
  }, []);

  return (
    <svg width="504" height="504" viewBox="0 0 504 504" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer circle */}
      <circle cx={CX} cy={CY} r={R} stroke="#0a0a0a" strokeWidth="2" />
      {/* Latitude lines */}
      {LAT_FRACS.map((f, i) => {
        const cy = CY + f * R;
        const rx = R * Math.sqrt(1 - f * f);
        return (
          <ellipse
            key={i}
            cx={CX} cy={cy}
            rx={rx} ry={Math.max(rx * 0.18, 6)}
            stroke="#0a0a0a"
            strokeWidth={f === 0 ? "2" : "1.2"}
            strokeOpacity={f === 0 ? "1" : "0.55"}
          />
        );
      })}
      {/* Longitude lines (GSAP-animated rx) */}
      {Array.from({ length: LON_COUNT }, (_, i) => (
        <ellipse
          key={i}
          id={`globe-lon-${i}`}
          cx={CX} cy={CY}
          rx={0} ry={R}
          stroke="#0a0a0a"
          strokeWidth="1.2"
          strokeOpacity="0.6"
        />
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

    const letters = wrap.querySelectorAll<HTMLSpanElement>(".footer-letter");

    // Set initial state — hidden below
    letters.forEach((l) => {
      l.style.display = "inline-block";
      l.style.opacity = "0";
      l.style.transform = "translateY(60px)";
      l.style.transition = "none";
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          observer.disconnect();

          letters.forEach((l, i) => {
            gsap.to(l, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: i * 0.09,
              ease: "power3.out",
            });
          });
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  return (
    <footer data-reveal style={{ margin: "64px", borderRadius: 16, background: "#00ff00", padding: "80px 64px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 640, boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
      {/* Globe: center sits at top-right corner so exactly 50% is visible */}
      <div style={{ position: "absolute", top: -120, right: -120, pointerEvents: "none" }}>
        <GlobeIcon />
      </div>
      <div ref={wrapRef} style={{ fontSize: "clamp(80px, 14vw, 180px)", fontWeight: 800, letterSpacing: "-0.05em", color: "#0a0a0a", lineHeight: 0.85, overflow: "hidden" }}>
        {"Reverb.".split("").map((char, i) => (
          <span key={i} className="footer-letter">{char}</span>
        ))}
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

export default function EngineeringPage() {
  const router = useRouter();
  const wipeGreenRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  useScrollReveal();

  useEffect(() => {
    document.body.style.background = "#0a0a0a";
    return () => { document.body.style.background = ""; };
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const setNavColors = (glass: boolean) => {
      const links = nav.querySelectorAll<HTMLElement>("a");
      const outline = nav.querySelector<HTMLElement>(".btn-outline-eng");
      const solid = nav.querySelector<HTMLElement>(".btn-solid-eng");

      links.forEach(l => { l.style.color = glass ? "#ffffff" : "#0a0a0a"; });
      if (outline) {
        outline.style.color = glass ? "#ffffff" : "#0a0a0a";
        outline.style.borderColor = glass ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)";
      }
      if (solid) {
        solid.style.background = glass ? "#ffffff" : "#0a0a0a";
        solid.style.color = glass ? "#0a0a0a" : "#ffffff";
      }
    };

    let isGlass = false;
    const onScroll = () => {
      const shouldBeGlass = window.scrollY > 80;
      if (shouldBeGlass === isGlass) return;
      isGlass = shouldBeGlass;
      if (shouldBeGlass) {
        nav.style.background = "rgba(17, 255, 0, 0.12)";
        nav.style.backdropFilter = "blur(24px) saturate(180%)";
        (nav.style as any).webkitBackdropFilter = "blur(24px) saturate(180%)";
        nav.style.boxShadow = "0 1px 0 rgba(255,255,255,0.08)";
        nav.style.border = "1px solid rgba(255,255,255,0.12)";
      } else {
        nav.style.background = "#00ff00";
        nav.style.backdropFilter = "none";
        (nav.style as any).webkitBackdropFilter = "none";
        nav.style.boxShadow = "none";
        nav.style.border = "none";
      }
      setNavColors(shouldBeGlass);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    const green = wipeGreenRef.current;
    if (!green) { router.push("/"); return; }

    const DURATION = 900; // ms — wipe sweep duration

    green.style.transition = "none";
    green.style.transform = "translateX(-100%)";
    green.style.display = "block";
    void green.getBoundingClientRect(); // force reflow

    // Double rAF ensures the browser commits the starting position
    // before the transition begins, preventing first-frame glitch
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        green.style.transition = `transform ${DURATION}ms cubic-bezier(0.76, 0, 0.24, 1)`;
        green.style.transform = "translateX(0%)";
        // Navigate only after wipe fully covers the screen
        setTimeout(() => router.push("/"), DURATION + 50);
      });
    });
  };

  return (
    <main style={{ background: "#0a0a0a", color: "#ffffff", minHeight: "100vh", fontFamily: "var(--font-instrument-sans), sans-serif" }}>
      <PageTransition />

      {/* Wipe exit overlay */}
      <div ref={wipeGreenRef} style={{ position: "fixed", inset: 0, background: "#11FF00", zIndex: 9999, display: "none", pointerEvents: "none", willChange: "transform" }} />

      {/* Nav */}
      <nav ref={navRef} style={{ position: "fixed", top: 32, left: "50%", transform: "translateX(-50%)", zIndex: 1000, width: "calc(100% - 48px)", maxWidth: 1000, background: "#00ff00", borderRadius: 8, padding: "14px 24px", display: "flex", alignItems: "center", transition: "background 0.4s ease, backdrop-filter 0.4s ease, border 0.4s ease" }}>
        <a href="/" onClick={goHome} style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0a0a", textDecoration: "none", flexShrink: 0 }}>Reverb.</a>
        <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "center" }}>
          {["Home", "About us", "Portfolio", "Download"].map(l => (
            <a key={l} href={l === "Home" ? "/" : "#"} onClick={l === "Home" ? goHome : undefined} style={{ padding: "8px 18px", fontSize: 14, fontWeight: 500, color: "#0a0a0a", borderRadius: 2, textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-outline-eng" style={{ padding: "9px 20px", fontSize: 14, fontWeight: 500, border: "1.5px solid rgba(0,0,0,0.3)", borderRadius: 4, background: "transparent", color: "#0a0a0a", cursor: "pointer", transition: "color 0.4s ease, border-color 0.4s ease" }}>Solutions</button>
          <button className="btn-solid-eng" style={{ padding: "9px 20px", fontSize: 14, fontWeight: 500, background: "#0a0a0a", color: "#fff", borderRadius: 4, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "background 0.4s ease, color 0.4s ease" }}>Get Started →</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 160, paddingBottom: 80, paddingLeft: 64, paddingRight: 64, maxWidth: 1200, margin: "0 auto" }}>
        <div data-reveal data-delay="0.1" style={{ display: "inline-flex", alignItems: "center", padding: "7px 16px", background: "#1a1a1a", borderRadius: 100, fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 28 }}>
          Engineering
        </div>
        <h1 data-reveal data-delay="0.2" style={{ fontSize: "100px", fontWeight: 400, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#ffffff" }}>
          Chemical Synthetic<br/>Fibers Metal
        </h1>
      </section>

      {/* Main image + body */}
      <section style={{ paddingLeft: 64, paddingRight: 64, maxWidth: 1200, margin: "0 auto 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
          {/* Primary image */}
          <div data-reveal data-delay="0" style={{ position: "relative", overflow: "hidden", borderRadius: 4, aspectRatio: "4/5" }}>
            <img src="/images/2.jpg" alt="Engineering" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
            <span style={{ position: "absolute", bottom: 24, right: 24, fontSize: "clamp(80px, 12vw, 160px)", fontWeight: 400, lineHeight: 1, letterSpacing: "-0.05em", color: "#ffffff", userSelect: "none" }}>2</span>
          </div>

          {/* Body text + secondary image */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32, paddingTop: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <p data-reveal data-delay="0.1" style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#ffffff" }}>
                There is a thread running through every skyscraper that defies wind. A fiber reinforcing every bulletproof vest that saves a life. A composite bonding the hull of every vessel that crosses the deepest ocean. A metal alloy inside every bridge that holds a city together.
              </p>
              <p data-reveal data-delay="0.2" style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#ffffff" }}>
                That thread, that fiber, that composite, that alloy — it starts with us.
              </p>
              <p data-reveal data-delay="0.3" style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#ffffff" }}>
                At Reverb, we don't just manufacture materials. We engineer the invisible infrastructure of modern civilization. Our chemical synthetic fibers and precision metal solutions are found in industries that cannot afford to fail — aerospace, defense, automotive, construction, medical, and marine.
              </p>
            </div>
            <div data-reveal data-delay="0.15" style={{ position: "relative", overflow: "hidden", borderRadius: 4, aspectRatio: "4/3" }}>
              <img src="/images/3.jpg" alt="Engineering detail" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Full-width image */}
      <section data-reveal style={{ marginBottom: 80 }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "21/9", overflow: "hidden" }}>
          <img src="/images/1.jpg" alt="Full width" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "grayscale(30%)" }} />
        </div>
      </section>

      {/* Two-column text */}
      <section style={{ paddingLeft: 64, paddingRight: 64, maxWidth: 1200, margin: "0 auto 120px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
          <div data-reveal data-delay="0" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#ffffff" }}>
              There is a thread running through every skyscraper that defies wind. A fiber reinforcing every bulletproof vest that saves a life. A composite bonding the hull of every vessel that crosses the deepest ocean. A metal alloy inside every bridge that holds a city together.
            </p>
            <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#ffffff" }}>
              That thread, that fiber, that composite, that alloy — it starts with us.
            </p>
            <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#ffffff" }}>
              At Reverb, we don't just manufacture materials. We engineer the invisible infrastructure of modern civilization.
            </p>
          </div>
          <div data-reveal data-delay="0.15" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#ffffff" }}>
              We are the company behind the company. The name you'll never see on the finished product, but without which the finished product would not exist.
            </p>
            <p style={{ fontSize: 18, fontWeight: 400, lineHeight: 1.65, color: "#ffffff" }}>
              We have spent decades at the intersection of chemistry, metallurgy, and applied materials science. And in that intersection, we've found something most companies never do: the ability to solve problems that don't yet have solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterSection />

    </main>
  );
}
