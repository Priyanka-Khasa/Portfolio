import type { CSSProperties } from "react";
import { techStack } from "../data/portfolio";
import "./styles/TechStackNew.css";

const categoryOrder = ["Frontend", "Backend", "Language", "AI / CV", "Android", "Database", "Styling", "Animation", "ECE", "Tool"];

const categoryLabels: Record<string, string> = {
  Frontend: "Interface",
  Backend: "Server",
  Language: "Code",
  "AI / CV": "Intelligence",
  Android: "Mobile",
  Database: "Data",
  Styling: "Visual",
  Animation: "Motion",
  ECE: "Hardware",
  Tool: "Workflow",
};

export default function TechStackNew() {
  const groupedStack = categoryOrder
    .map((category) => ({
      category,
      items: techStack.filter((tech) => tech.category === category),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <section className="techstack section" id="techstack">
      <div className="section-inner">
        <div className="techstack-header fade-up">
          <div className="techstack-header-text">
            <div className="section-tag">Skills & tools</div>
            <h2 className="section-heading">
              Built to <span className="gradient-text">build.</span>
            </h2>
            <p className="techstack-sub">
              A practical toolkit for intelligent interfaces, mobile products, real-time AI, and dependable backends.
            </p>
          </div>
          <div className="skill-orbit" aria-label={`${techStack.length} technologies in my toolkit`}>
            <span className="skill-orbit-ring" />
            <strong>{techStack.length}</strong>
            <span>tools</span>
          </div>
        </div>

        <div className="skill-board stagger-group">
          {groupedStack.map((group, groupIndex) => (
            <article
              className={`skill-group skill-group-${groupIndex + 1}`}
              key={group.category}
              style={{ "--group-index": groupIndex } as CSSProperties}
            >
              <div className="skill-group-top">
                <span className="skill-group-index">0{groupIndex + 1}</span>
                <div>
                  <span className="skill-group-kicker">{categoryLabels[group.category]}</span>
                  <h3>{group.category}</h3>
                </div>
              </div>
              <div className="skill-pills">
                {group.items.map((tech, itemIndex) => (
                  <span
                    className="skill-pill"
                    key={tech.name}
                    style={{ "--item-index": itemIndex } as CSSProperties}
                  >
                    <span className="skill-pill-dot" />
                    {tech.name}
                  </span>
                ))}
              </div>
              <span className="skill-card-mark" aria-hidden="true">+</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
