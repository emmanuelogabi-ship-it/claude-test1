"use client";
import { useRef } from "react";
import gsap from "gsap";

interface Props {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
}

export default function LineButton({ children = "View Project", onClick, className, href }: Props) {
  const lineRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  const onEnter = () => {
    gsap.to(lineRef.current, { width: "calc(100% + 48px)", duration: 0.55, ease: "power3.out" });
    gsap.to(arrowRef.current, { x: 48, duration: 0.55, ease: "power3.out" });
  };

  const onLeave = () => {
    gsap.to(lineRef.current, { width: "100%", duration: 0.45, ease: "power3.inOut" });
    gsap.to(arrowRef.current, { x: 0, duration: 0.45, ease: "power3.inOut" });
  };

  const Tag = href ? "a" : "button";
  return (
    <Tag
      className={`line-btn${className ? ` ${className}` : ""}`}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      {...(href ? { href } : {})}
    >
      <span className="line-btn-inner">
        <span className="line-btn-text">{children}</span>
        <span ref={arrowRef} className="line-btn-arrow">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 7h10M7 2l5 5-5 5" />
          </svg>
        </span>
        <span ref={lineRef} className="line-btn-line" />
      </span>
    </Tag>
  );
}
