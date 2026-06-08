import { projects } from "../data/portfolio";
import WorkImage from "./WorkImage";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import "./styles/Work.css";

export default function Work() {
  return (
    <section className="work section" id="work">
      <div className="section-inner">
        <div className="fade-up">
          <div className="section-tag">Selected Work</div>
          <h2 className="section-heading1">
            Things I've <span className="gradient-text1">Built</span>
          </h2>
          <p className="work-subtitle">
            A focused set of AI, Android, computer-vision, and full-stack products with hackathon recognition and real engineering depth.
          </p>
        </div>

        <div className="work-list">
          {projects.map((project, i) => (
            <article
              key={project.id}
              className={`work-card ${i % 2 !== 0 ? "reverse" : ""} scale-in`}
            >
              <div className="work-card-image">
                <WorkImage src={project.image} alt={project.title} />
                <div className="work-card-overlay">
                  <div className="work-card-links">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                      <FiGithub />
                    </a>
                    <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label="Live">
                      <FiExternalLink />
                    </a>
                  </div>
                </div>
              </div>

              <div className="work-card-content">
                <span className="work-index">0{i + 1}</span>
                <h3 className="work-title">{project.title}</h3>
                <p className="work-subtitle-text">{project.subtitle}</p>
                <p className="work-desc">{project.description}</p>
                <div className="work-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="work-tag">{tag}</span>
                  ))}
                </div>
                <div className="work-actions">
                  <a
                    href={project.github}
                    className="work-btn-ghost"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FiGithub /> GitHub
                  </a>
                  <a
                    href={project.live}
                    className="work-btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FiExternalLink /> Live Demo
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
