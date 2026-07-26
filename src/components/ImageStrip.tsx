import Marquee from "react-fast-marquee";
import { galleryImages, imageSizes } from "../data/portfolio";
import "./styles/ImageStrip.css";

export default function ImageStrip() {
  return (
    <section className="image-strip">
      <Marquee speed={32} gradient={false} pauseOnHover>
        {[...galleryImages, ...galleryImages].map((src, i) => (
          <div key={i} className="strip-frame">
            <img
              src={src}
              alt={`Gallery ${(i % galleryImages.length) + 1}`}
              width={imageSizes[src]?.width}
              height={imageSizes[src]?.height}
              loading="lazy"
              decoding="async"
            />
            <div className="strip-overlay" />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
