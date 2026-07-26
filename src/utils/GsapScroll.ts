import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations(): void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(".fade-up, .fade-left, .fade-right, .scale-in, .stagger-group > *", {
      clearProps: "transform,opacity",
      opacity: 1,
    });
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    return;
  }

  const fadeUps = document.querySelectorAll<HTMLElement>(".fade-up");
  fadeUps.forEach((el) => {
    gsap.fromTo(
      el,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  const fadeLefts = document.querySelectorAll<HTMLElement>(".fade-left");
  fadeLefts.forEach((el) => {
    gsap.fromTo(
      el,
      { x: -60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  const fadeRights = document.querySelectorAll<HTMLElement>(".fade-right");
  fadeRights.forEach((el) => {
    gsap.fromTo(
      el,
      { x: 60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  const staggerGroups = document.querySelectorAll<HTMLElement>(".stagger-group");
  staggerGroups.forEach((group) => {
    const children = group.children;
    gsap.fromTo(
      children,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: group,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  });

  const scaleIns = document.querySelectorAll<HTMLElement>(".scale-in");
  scaleIns.forEach((el) => {
    gsap.fromTo(
      el,
      { scale: 0.88, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
  });
}
