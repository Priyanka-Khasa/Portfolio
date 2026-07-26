import { useEffect } from "react";
import Lenis from "lenis";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import Landing from "./Landing";
import About from "./About";
import ImageStrip from "./ImageStrip";
import WhatIDo from "./WhatIDo";
import Career from "./Career";
import Work from "./Work";
import TechStackNew from "./TechStackNew";
import CallToAction from "./CallToAction";
import Contact from "./Contact";
import Footer from "./Footer";
import { initScrollAnimations } from "../utils/GsapScroll";
import "./styles/MainContainer.css";
import "./styles/AestheticRefresh.css";

export default function MainContainer() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    if (reduceMotion) {
      initScrollAnimations();
      return;
    }

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const timer = setTimeout(() => {
      initScrollAnimations();
    }, 300);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="main-container">
      <Navbar />
      <SocialIcons />
      <main>
        <Landing />
        <About />
        <ImageStrip />
        <WhatIDo />
        <Career />
        <Work />
        <TechStackNew />
        <CallToAction />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
