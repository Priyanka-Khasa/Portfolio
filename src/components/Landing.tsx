import { useEffect, useRef } from "react";
import { aboutData, imageSizes, mainImages } from "../data/portfolio";
import { splitTextIntoSpans } from "../utils/splitText";
import { runInitialFX } from "../utils/initialFX";
import "./styles/Landing.css";

const photoNotes = ["Builder", "Curious", "Focused", "Creative"];

export default function Landing() {
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    splitTextIntoSpans(".landing-headline");
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      window.setTimeout(() => runInitialFX(), 60);
    }
  }, []);

  return (
    <section className="landing" id="landing">
      <div className="landing-bg-glow" />
      <div className="landing-grid-texture" />
      <div className="landing-kinetic-text" aria-hidden="true">
        <span>AI BUILDER</span>
        <span>VISION</span>
        <span>ANDROID</span>
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
            <span className="sub-divider">—</span>
            building useful AI products and thoughtful digital experiences.
          </p>

          <div className="landing-cta">
            <button
              className="cta-primary magnetic-btn"
              onClick={() => document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" })}
            >
              <span>View My Work</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

        <div className="landing-right" aria-label="Portrait collage of Priyanka Khasa">
          <div className="hero-collage">
            <div className="collage-accent collage-accent-top">Designing with purpose</div>
            {mainImages.map((src, index) => (
              <figure className={`collage-photo collage-photo-${index + 1}`} key={src}>
                <img
                  src={src}
                  alt={`Priyanka Khasa portrait ${index + 1}`}
                  width={imageSizes[src]?.width}
                  height={imageSizes[src]?.height}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding={index < 2 ? "sync" : "async"}
                />
                <figcaption>{photoNotes[index]}</figcaption>
              </figure>
            ))}
            <div className="collage-monogram" aria-hidden="true">PK</div>
            <div className="collage-accent collage-accent-bottom">
              <span className="collage-status-dot" /> Available for opportunities
            </div>
          </div>
        </div>
      </div>

      <div className="landing-scroll-hint">
        <span>Scroll to explore</span>
        <span className="scroll-line" />
      </div>

      <div className="landing-vertical-text">PORTFOLIO / 2026</div>
    </section>
  );
}
