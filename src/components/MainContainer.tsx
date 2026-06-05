import { useEffect } from "react";
import Lenis from "lenis";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import Landing from "./Landing";
import About from "./About";
import WhatIDo from "./WhatIDo";
import Career from "./Career";
import Work from "./Work";
import TechStackNew from "./TechStackNew";
import CallToAction from "./CallToAction";
import Contact from "./Contact";
import Footer from "./Footer";
import { initScrollAnimations } from "../utils/GsapScroll";
import "./styles/MainContainer.css";

export default function MainContainer() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const timer = setTimeout(() => {
      initScrollAnimations();
    }, 300);

    return () => {
      lenis.destroy();
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
