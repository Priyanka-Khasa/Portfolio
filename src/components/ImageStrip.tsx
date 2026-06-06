import Marquee from "react-fast-marquee";
import { galleryImages } from "../data/portfolio";
import "./styles/ImageStrip.css";

export default function ImageStrip() {
  return (
    <section className="image-strip">
      <Marquee speed={32} gradient={false} pauseOnHover>
        {[...galleryImages, ...galleryImages].map((src, i) => (
          <div key={i} className="strip-frame">
            <img src={src} alt={`Gallery ${(i % galleryImages.length) + 1}`} loading="lazy" />
            <div className="strip-overlay" />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
