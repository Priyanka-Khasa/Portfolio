import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { projects } from "../data/portfolio";
import WorkImage from "../components/WorkImage";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiArrowLeft, FiExternalLink, FiGithub } from "react-icons/fi";
import { initScrollAnimations } from "../utils/GsapScroll";
import "./MyWorks.css";

export default function MyWorks() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => initScrollAnimations(), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="myworks-page">
      <Navbar />
      <div className="myworks-hero fade-up">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <div className="section-tag" style={{ justifyContent: "center", marginTop: "2rem" }}>All Projects</div>
        <h1 className="myworks-heading">
          Everything I've<br />
          <span className="gradient-text">Built</span>
        </h1>
        <p className="myworks-sub">
          A complete archive of projects — big and small, serious and experimental.
        </p>
      </div>

      <div className="myworks-grid stagger-group">
        {projects.map((project) => (
          <article key={project.id} className="myworks-card">
            <div className="myworks-card-img">
              <WorkImage src={project.image} alt={project.title} />
              <div className="myworks-hover-overlay">
                <div className="myworks-overlay-links">
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <FiGithub />
                  </a>
                  <a href={project.live} target="_blank" rel="noopener noreferrer">
                    <FiExternalLink />
                  </a>
                </div>
              </div>
            </div>
            <div className="myworks-card-info">
              <div className="myworks-card-top">
                <h2 className="myworks-card-title">{project.title}</h2>
                <span className="myworks-card-sub">{project.subtitle}</span>
              </div>
              <p className="myworks-card-desc">{project.description}</p>
              <div className="myworks-tags">
                {project.tags.map((t) => (
                  <span key={t} className="work-tag">{t}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <Footer />
    </div>
  );
}
