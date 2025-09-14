"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = {
  text: string;              // ex: "Entrez une URL Figma"
  delay?: number;            // délai avant de démarrer (sec)
  durationPerWord?: number;  // durée d'anim par mot (sec)
  stagger?: number;          // délai entre mots (sec)
  className?: string;        // classes CSS additionnelles
};

export default function AnimatedHeadline({
  text,
  delay = 0.2,
  durationPerWord = 0.45,
  stagger = 0.08,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  // Découpe en mots (en gardant les espaces)
  const words = text.split(" ").map((w, i) => (
    <span key={i} className="word-wrapper inline-block align-baseline mr-[0.25em]">
      <span className="word inline-block will-change-transform opacity-0 translate-y-[0.6em]">
        {w}
      </span>
    </span>
  ));

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return; // respect accessibilité

    const els = containerRef.current?.querySelectorAll(".word");
    if (!els || !els.length) return;

    // Timeline GSAP
    gsap.timeline({ delay })
      .to(els, {
        opacity: 1,
        y: 0,                 // remonte depuis 0.6em (définie en classe)
        duration: durationPerWord,
        ease: "power2.out",
        stagger,              // fait arriver les mots l'un après l'autre
      });

    // cleanup (si démontage)
    return () => gsap.killTweensOf(els);
  }, [delay, durationPerWord, stagger, text]);

  return (
    <h1
      ref={containerRef}
      className={`${className}`}
      aria-label={text} // pour lecteurs d'écran
    >
      {words}
    </h1>
  );
}