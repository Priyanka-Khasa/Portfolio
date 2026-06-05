import { useEffect, useRef } from "react";
import { aboutData } from "../data/portfolio";
import { splitTextIntoSpans } from "../utils/splitText";
import { runInitialFX } from "../utils/initialFX";
import "./styles/Landing.css";

export default function Landing() {
  const hasAnimated = useRef(false);

  useEffect(() => {
    splitTextIntoSpans(".landing-headline");
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      setTimeout(() => runInitialFX(), 100);
    }
  }, []);

  return (
    <section className="landing" id="landing">
      <div className="landing-bg-glow" />
      <div className="landing-particles">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="landing-particle" style={{
            left: `${(i * 6.25) % 100}%`,
            top: `${(i * 13 + 10) % 90}%`,
            animationDelay: `${(i * 0.4) % 6}s`,
            animationDuration: `${4 + (i % 4) * 1.5}s`,
          }} />
        ))}
      </div>

      <div className="landing-layout">
        <div className="landing-left">
          <span className="landing-eyebrow">
            <span className="eyebrow-dot" />
            Available for work
          </span>

          <h1 className="landing-headline">
            {aboutData.name}
          </h1>

          <p className="landing-sub">
            <span className="sub-role">{aboutData.role}</span>
            <span className="sub-divider">—</span>
            crafting digital experiences that move people.
          </p>

          <div className="landing-cta">
            <button
              className="cta-primary"
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
              <span className="stat-number">3+</span>
              <span className="stat-label">Years Coding</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Projects Built</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">∞</span>
              <span className="stat-label">Ideas Brewing</span>
            </div>
          </div>
        </div>

        <div className="landing-right">
          <div className="landing-image-container">
            <div className="image-glow" />
            <img
              src="/images/main1.png"
              alt="Priyanka Khasa"
              className="hero-img"
              loading="eager"
            />
            <div className="image-tag">
              <span className="tag-icon">✦</span>
              Frontend Developer
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
