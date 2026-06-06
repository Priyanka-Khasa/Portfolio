import { useEffect, useRef } from "react";
import { aboutData } from "../data/portfolio";
import { FiMapPin, FiMail, FiDownload } from "react-icons/fi";
import "./styles/About.css";

export default function About() {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!imgRef.current) return;
      const rect = imgRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = ((e.clientX - cx) / rect.width) * 8;
      const ry = -((e.clientY - cy) / rect.height) * 8;
      imgRef.current.style.transform = `perspective(900px) rotateY(${rx}deg) rotateX(${ry}deg)`;
    };
    const onLeave = () => {
      if (imgRef.current)
        imgRef.current.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
    };
    const el = imgRef.current;
    el?.addEventListener("mousemove", onMove);
    el?.addEventListener("mouseleave", onLeave);
    return () => {
      el?.removeEventListener("mousemove", onMove);
      el?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="about section" id="about">
      <div className="section-inner">
        <div className="about-image-col fade-left">
          <div className="about-img-wrap" ref={imgRef}>
            <img src="/images/main_image2.jpeg" alt="Priyanka Khasa" className="about-photo" />
            <div className="about-img-border" />
            <div className="about-badge">
              <span className="badge-emoji">✦</span>
              <div>
                <div className="badge-title">Creative Dev</div>
                <div className="badge-sub">Turning ideas into pixels</div>
              </div>
            </div>
          </div>
        </div>

        <div className="about-text-col fade-right">
          <div className="section-tag">About Me</div>
          <h2 className="section-heading">
            Crafting the <span className="gradient-text">web</span> with<br />
            passion & precision
          </h2>
          <p className="about-bio">{aboutData.bio}</p>
          <p className="about-bio">{aboutData.bio2}</p>

          <div className="about-meta">
            <div className="meta-item">
              <FiMapPin />
              <span>{aboutData.location}</span>
            </div>
            <div className="meta-item">
              <FiMail />
              <a href={`mailto:${aboutData.email}`}>{aboutData.email}</a>
            </div>
            {aboutData.available && (
              <div className="meta-item available">
                <span className="avail-dot" />
                Available for opportunities
              </div>
            )}
          </div>

          <a href="#" className="download-cv" download>
            <FiDownload />
            Download CV
          </a>
        </div>
      </div>
    </section>
  );
}
