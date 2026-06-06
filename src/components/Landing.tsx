import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { aboutData, mainImages } from "../data/portfolio";
import { splitTextIntoSpans } from "../utils/splitText";
import { runInitialFX } from "../utils/initialFX";
import "./styles/Landing.css";

const GLOWS = [
  "rgba(24, 40, 37, 0.34)",
  "rgba(154, 103, 53, 0.32)",
  "rgba(197, 135, 61, 0.28)",
  "rgba(99, 64, 35, 0.28)",
];

export default function Landing() {
  const hasAnimated = useRef(false);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    splitTextIntoSpans(".landing-headline");
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      setTimeout(() => runInitialFX(), 100);
    }
  }, []);

  const goTo = (next: number) => {
    if (transitioning || next === active) return;
    setTransitioning(true);
    setPrev(active);
    setActive(next);

    gsap.to(glowRef.current, {
      background: `radial-gradient(circle, ${GLOWS[next]} 0%, transparent 70%)`,
      duration: 0.9,
      ease: "power2.inOut",
    });

    setTimeout(() => {
      setPrev(null);
      setTransitioning(false);
    }, 700);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const next = (active + 1) % mainImages.length;
      goTo(next);
    }, 3400);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, transitioning]);

  useEffect(() => {
    if (counterRef.current) {
      gsap.fromTo(
        counterRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
      );
    }
  }, [active]);

  const handleDotClick = (i: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    goTo(i);
  };

  return (
    <section className="landing" id="landing">
      <div className="landing-bg-glow" />
      <div className="landing-particles">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="landing-particle"
            style={{
              left: `${(i * 5.1) % 100}%`,
              top: `${(i * 13 + 10) % 90}%`,
              animationDelay: `${(i * 0.38) % 6}s`,
              animationDuration: `${4 + (i % 4) * 1.5}s`,
            }}
          />
        ))}
      </div>

      <div className="landing-layout">
        <div className="landing-left">
          <span className="landing-eyebrow">
            <span className="eyebrow-dot" />
            Google Ambassador / Hackathon Finalist / Builder
          </span>

          <h1 className="landing-headline">{aboutData.name}</h1>

          <p className="landing-sub">
            <span className="sub-role">{aboutData.role}</span>
            <span className="sub-divider">-</span>
            crafting intelligent products with a soft editorial glow.
          </p>

          <div className="landing-cta">
            <button
              className="cta-primary magnetic-btn"
              onClick={() => document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" })}
            >
              <span>View My Work</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className="cta-secondary"
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Let's Talk
            </button>
          </div>

          <div className="landing-stats">
            <div className="stat-item">
              <span className="stat-number">8.65</span>
              <span className="stat-label">B.Tech CGPA</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">30fps</span>
              <span className="stat-label">AI Tracking</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">4+</span>
              <span className="stat-label">Flagship Builds</span>
            </div>
          </div>
        </div>

        <div className="landing-right">
          <div className="hero-carousel-wrap">
            <div className="hero-glow-orb" ref={glowRef} />
            <div className="hero-img-stack">
              {mainImages.map((src, i) => (
                <div
                  key={src}
                  className={`hero-img-slide ${i === active ? "active" : i === prev ? "prev" : "behind"}`}
                >
                  <img src={src} alt={`Priyanka Khasa ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} />
                </div>
              ))}
            </div>

            <div className="hero-counter">
              <span className="hero-counter-num" ref={counterRef}>0{active + 1}</span>
              <span className="hero-counter-total">/ 0{mainImages.length}</span>
            </div>

            <div className="image-tag">
              <span className="tag-icon">*</span>
              AI + Full-Stack Engineer
            </div>

            <div className="hero-dots">
              {mainImages.map((_, i) => (
                <button
                  key={i}
                  className={`hero-dot ${i === active ? "active" : ""}`}
                  onClick={() => handleDotClick(i)}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>

            <div className="hero-thumbs">
              {mainImages.map((src, i) => (
                <button
                  key={i}
                  className={`hero-thumb ${i === active ? "active" : ""}`}
                  onClick={() => handleDotClick(i)}
                  aria-label={`Photo ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="landing-scroll-hint">
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>Scroll</span>
      </div>

      <div className="landing-vertical-text">PORTFOLIO</div>
    </section>
  );
}
