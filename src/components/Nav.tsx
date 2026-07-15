"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const links = ["Home", "About us", "Our work", "Download"];
const HREFS: Record<string, string> = { "About us": "/about", "Our work": "/portfolio" };
const PATHS: Record<string, string> = { "Home": "/", "About us": "/about", "Our work": "/portfolio" };
const DURATION = 900;

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 20) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navigateWithWipe = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    const green = (window as any).__wipeOverlay as HTMLDivElement | null;
    if (!green) { router.push(href); return; }
    green.style.transition = "none";
    green.style.transform = "translateX(-100%)";
    green.style.display = "block";
    void green.getBoundingClientRect();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        green.style.transition = `transform ${DURATION}ms cubic-bezier(0.76, 0, 0.24, 1)`;
        green.style.transform = "translateX(0%)";
        setTimeout(() => {
          sessionStorage.setItem("wipeEntry", "covered");
          router.push(href);
        }, DURATION + 50);
      });
    });
  };

  return (
    <>
      <nav ref={navRef} className="floating-nav" style={{ borderRadius: "8px" }}>
        <span className="nav-logo">Reverb.</span>

        {/* Desktop nav links */}
        <div className="nav-links">
          {links.map((l) => {
            const href = HREFS[l];
            return (
              <a
                key={l}
                href={href ?? "#"}
                className="nav-link"
                onClick={href ? navigateWithWipe(href) : undefined}
                style={{ opacity: pathname === (PATHS[l] ?? null) ? 1 : 0.4, transition: "opacity 0.2s ease" }}
              >
                {l}
              </a>
            );
          })}
        </div>

        {/* Desktop CTAs */}
        <div className="nav-ctas">
          <button className="btn-outline">Solutions</button>
          <button className="btn-solid">
            Get Started
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Mobile burger */}
        <button
          className="nav-burger"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className={`burger-bar${open ? " open" : ""}`} />
          <span className={`burger-bar${open ? " open" : ""}`} />
        </button>
      </nav>

      {/* Mobile fullscreen overlay */}
      <div className={`mobile-menu${open ? " mobile-menu--open" : ""}`} ref={menuRef}>
        <nav className="mobile-menu-links">
          {links.map((l) => {
            const href = HREFS[l];
            const isActive = pathname === (PATHS[l] ?? null);
            return (
              <a
                key={l}
                href={href ?? "#"}
                className="mobile-menu-link"
                onClick={href ? navigateWithWipe(href) : (e) => { e.preventDefault(); setOpen(false); }}
                style={{ opacity: isActive ? 1 : 0.35 }}
              >
                {l}
              </a>
            );
          })}
        </nav>
        <div className="mobile-menu-footer">
          <button className="btn-solid" style={{ width: "100%", justifyContent: "center" }}>
            Get Started
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
