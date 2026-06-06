import Marquee from "react-fast-marquee";
import { whatIDo, marqueeItems } from "../data/portfolio";
import "./styles/WhatIDo.css";

export default function WhatIDo() {
  return (
    <section className="whatido section" id="whatido">
      <div className="section-inner">
        <div className="whatido-header fade-up">
          <div className="whatido-header-text">
            <div className="section-tag">What I Do</div>
            <h2 className="section-heading">
              My <span className="gradient-text">Superpowers</span>
            </h2>
            <p className="whatido-intro">
              I blend AI engineering, full-stack development, Android craft, and motion design into products that feel alive.
            </p>
          </div>
          <div className="whatido-header-img">
            <div className="whatido-img-frame">
              <img src="/images/image2.jpeg" alt="Skills visual" loading="lazy" />
              <div className="whatido-img-accent" />
            </div>
            <div className="whatido-img-label">
              <span>4</span>
              <span>Core skills</span>
            </div>
          </div>
        </div>

        <div className="whatido-grid stagger-group">
          {whatIDo.map((item) => (
            <div key={item.title} className="whatido-card">
              <div className="whatido-icon">{item.icon}</div>
              <h3 className="whatido-title">{item.title}</h3>
              <p className="whatido-desc">{item.description}</p>
              <div className="card-glow" />
            </div>
          ))}
        </div>
      </div>

      <div className="marquee-section fade-up">
        <Marquee speed={48} gradient={false} pauseOnHover className="whatido-marquee">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="marquee-item">
              <span className="marquee-star">*</span>
              <span>{item}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
