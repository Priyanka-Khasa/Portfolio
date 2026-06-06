import { careerItems } from "../data/portfolio";
import { FiBriefcase, FiBook } from "react-icons/fi";
import "./styles/Career.css";

export default function Career() {
  return (
    <section className="career section" id="career">
      <div className="section-inner">
        <div className="career-header fade-up">
          <div className="career-header-text">
            <div className="section-tag">Career</div>
            <h2 className="section-heading">
              My <span className="gradient-text">Journey</span>
            </h2>
            <p className="career-intro">
              From first lines of code to shipping real products — here's where I've been.
            </p>
          </div>
          <div className="career-header-img">
            <div className="career-img-frame">
              <img src="/images/main_image3.jpeg" alt="Career visual" loading="lazy" />
              <div className="career-img-badge">
                <span className="career-badge-num">2+</span>
                <span className="career-badge-label">Years of<br />Experience</span>
              </div>
            </div>
          </div>
        </div>

        <div className="career-timeline">
          {careerItems.map((item, i) => (
            <div
              key={i}
              className={`timeline-item ${i % 2 === 0 ? "fade-left" : "fade-right"}`}
            >
              <div className="timeline-line">
                <div className="timeline-node">
                  {item.type === "work" ? <FiBriefcase /> : <FiBook />}
                </div>
              </div>
              <div className="timeline-card">
                <span className="timeline-year">{item.year}</span>
                <h3 className="timeline-role">{item.role}</h3>
                <span className="timeline-company">{item.company}</span>
                <p className="timeline-desc">{item.description}</p>
                <div className="timeline-card-glow" />
              </div>
            </div>
          ))}
          <div className="timeline-end-dot" />
        </div>
      </div>
    </section>
  );
}
