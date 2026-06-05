import Marquee from "react-fast-marquee";
import { heroImages } from "../data/portfolio";
import "./styles/ImageStrip.css";

export default function ImageStrip() {
  return (
    <section className="image-strip">
      <div className="strip-label fade-up">
        <span className="strip-label-line" />
        <span>Moments</span>
        <span className="strip-label-line" />
      </div>
      <Marquee speed={36} gradient gradientColor="var(--bg)" gradientWidth={80} pauseOnHover>
        {[...heroImages, ...heroImages].map((src, i) => (
          <div key={i} className="strip-item">
            <img src={src} alt={`Gallery ${(i % 6) + 1}`} loading="lazy" />
            <div className="strip-overlay" />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
