import gsap from "gsap";

export function runInitialFX(): void {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(".navbar", { y: -80, opacity: 0, duration: 0.9, delay: 0.2 })
    .from(
      ".landing-eyebrow",
      { y: 40, opacity: 0, duration: 0.7 },
      "-=0.5"
    )
    .from(
      ".landing-headline .char",
      { y: "110%", opacity: 0, duration: 0.75, stagger: 0.025 },
      "-=0.4"
    )
    .from(
      ".landing-sub",
      { y: 30, opacity: 0, duration: 0.7 },
      "-=0.3"
    )
    .from(
      ".landing-cta",
      { y: 20, opacity: 0, duration: 0.6 },
      "-=0.4"
    )
    .from(
      ".hero-carousel-wrap",
      { scale: 1.08, opacity: 0, duration: 1.1 },
      "-=0.9"
    )
    .from(
      ".social-icons",
      { x: -20, opacity: 0, duration: 0.6 },
      "-=0.5"
    );
}
