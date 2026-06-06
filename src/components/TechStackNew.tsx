import { techStack } from "../data/portfolio";
import Marquee from "react-fast-marquee";
import "./styles/TechStackNew.css";

const categoryColors: Record<string, string> = {
  Frontend:  "var(--accent-violet)",
  Backend:   "var(--accent-teal)",
  Language:  "var(--accent-gold)",
  Database:  "var(--accent-rose)",
  Design:    "#f472b6",
  Animation: "var(--accent-violet)",
  Tool:      "var(--text-muted)",
};

export default function TechStackNew() {
  return (
    <section className="techstack section" id="techstack">
      <div className="section-inner">
        <div className="techstack-header fade-up">
          <div className="techstack-header-text">
            <div className="section-tag">Tech Stack</div>
            <h2 className="section-heading">
              Tools of the <span className="gradient-text">Trade</span>
            </h2>
            <p className="techstack-sub">
              Technologies I work with daily to build fast, beautiful products.
            </p>
          </div>
          <div className="techstack-header-img">
            <div className="techstack-img-frame">
              <img src="/images/main_image4.jpeg" alt="Tech visual" loading="lazy" />
              <div className="techstack-img-overlay" />
            </div>
            <div className="techstack-img-tag">
              <span className="techstack-tag-num">{techStack.length}</span>
              Technologies
            </div>
          </div>
        </div>
      </div>

      <div className="tech-marquee-wrap fade-up">
        <Marquee speed={38} gradient gradientColor="var(--bg2)" gradientWidth={80} pauseOnHover>
          {techStack.map((tech) => (
            <div key={tech.name} className="tech-badge">
              <span
                className="tech-dot"
                style={{ background: categoryColors[tech.category] ?? "var(--accent-violet)" }}
              />
              <span className="tech-name">{tech.name}</span>
              <span className="tech-cat">{tech.category}</span>
            </div>
          ))}
        </Marquee>
        <Marquee speed={28} direction="right" gradient gradientColor="var(--bg2)" gradientWidth={80} pauseOnHover style={{ marginTop: "0.75rem" }}>
          {[...techStack].reverse().map((tech) => (
            <div key={tech.name} className="tech-badge ghost">
              <span className="tech-name">{tech.name}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
