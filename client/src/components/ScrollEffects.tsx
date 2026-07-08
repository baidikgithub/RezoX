"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollEffects() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-on-scroll").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 34 }, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%" }
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return null;
}
