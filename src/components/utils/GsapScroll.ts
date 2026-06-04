import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function setCharTimeline() {
  if (window.innerWidth <= 768) return;

  // Landing → About: character shifts left, landing text fades up
  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: 1.2,
      invalidateOnRefresh: true,
    },
  });

  tl1
    .to(".landing-container", { opacity: 0, y: "35%", duration: 0.7 }, 0)
    .fromTo(".about-me", { y: "-40%" }, { y: "0%", duration: 1 }, 0)
    .fromTo(".character-model", { x: 0 }, { x: "-22%", duration: 1 }, 0);

  // About → WhatIDo: character slides UP and out of view
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "30% 50%",
      end: "bottom top",
      scrub: 1.5,
      invalidateOnRefresh: true,
    },
  });

  tl2
    .to(".about-section", { opacity: 0, y: "25%", duration: 0.6 }, 0)
    .to(".character-model", {
      y: "-110%",
      x: "0%",
      opacity: 0,
      duration: 1,
      ease: "power2.in",
    }, 0)
    .fromTo(".what-box-in", { display: "none" }, { display: "flex", duration: 0.01 }, 0.99);
}

export function setAllTimeline() {
  // Career timeline animation
  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 55%",
      end: "bottom 25%",
      scrub: 2,
      invalidateOnRefresh: true,
    },
  });

  careerTimeline
    .fromTo(".career-timeline", { maxHeight: "0%", opacity: 0 }, { maxHeight: "100%", opacity: 1, duration: 0.5 }, 0)
    .fromTo(".career-info-box", { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.5 }, 0);

  // Parallax on career section
  if (window.innerWidth > 1024) {
    gsap.fromTo(
      ".career-section",
      { y: 0 },
      {
        y: "12%",
        scrollTrigger: {
          trigger: ".career-section",
          start: "top 80%",
          end: "bottom top",
          scrub: 1.5,
        },
      }
    );
  }
}
