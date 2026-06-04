import { TextSplitter } from "../../utils/textSplitter";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenis } from "../Navbar";
import { setCharTimeline, setAllTimeline } from "./GsapScroll";
import setSplitText from "./splitText";

gsap.registerPlugin(ScrollTrigger);

export function initialFX() {
  // Unlock scrolling
  document.body.style.overflowY = "auto";
  if (lenis) lenis.start();

  // Fade in main content
  const main = document.querySelector("main");
  if (main) main.classList.add("main-active");

  // Animate background
  gsap.to("body", { backgroundColor: "#07091a", duration: 0.4, delay: 0.5 });

  // Animate navbar + icons
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    { opacity: 1, duration: 0.9, ease: "power2.out", delay: 0.1 }
  );

  // Animate hero text — Priyanka, KHASA
  const introElements = [".landing-intro h2", ".landing-intro h1"];
  const introSplit = new TextSplitter(
    introElements.flatMap(s => Array.from(document.querySelectorAll(s))),
    { type: "chars,lines", linesClass: "split-line" }
  );
  gsap.fromTo(
    introSplit.chars,
    { opacity: 0, y: 70, rotateX: -30 },
    { opacity: 1, y: 0, rotateX: 0, duration: 1.1, ease: "power3.out", stagger: 0.022, delay: 0.2 }
  );

  // Animate A — Full Stack Developer (looping)
  const TextProps = { type: "chars,lines", linesClass: "split-h2" };
  const t1 = new TextSplitter(".landing-h2-info", TextProps);
  const t2 = new TextSplitter(".landing-h2-info-1", TextProps);
  const t3 = new TextSplitter(".landing-h2-1", TextProps);
  const t4 = new TextSplitter(".landing-h2-2", TextProps);

  gsap.fromTo(
    t1.chars,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.03, delay: 0.6 }
  );
  gsap.fromTo(
    t3.chars,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.03, delay: 0.8 }
  );

  // Animate info h3
  gsap.fromTo(
    ".landing-info h3",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.5 }
  );

  // Loop animation between two text variants
  loopText(t1, t2);
  loopText(t3, t4);

  // Set up scroll-driven timelines
  setTimeout(() => {
    setCharTimeline();
    setAllTimeline();
    setSplitText();
    ScrollTrigger.refresh();
  }, 300);
}

function loopText(text1: TextSplitter, text2: TextSplitter) {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
  const HOLD = 3.5;
  const HOLD2 = HOLD * 2 + 1;

  tl.fromTo(text2.chars, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.06, delay: HOLD }, 0)
    .to(text1.chars, { y: -60, opacity: 0, duration: 0.8, ease: "power3.in", stagger: 0.04, delay: HOLD }, 0)
    .fromTo(text1.chars, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.06, delay: HOLD2 }, 1)
    .to(text2.chars, { y: -60, opacity: 0, duration: 0.8, ease: "power3.in", stagger: 0.04, delay: HOLD2 }, 1);
}
