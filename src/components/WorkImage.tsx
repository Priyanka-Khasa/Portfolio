import { useState } from "react";
import { imageSizes } from "../data/portfolio";

interface WorkImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function WorkImage({ src, alt, className = "" }: WorkImageProps) {
  const [loaded, setLoaded] = useState(false);
  const size = imageSizes[src];

  return (
    <div className={`work-img-wrap ${className}`}>
      {!loaded && <div className="work-img-skeleton" />}
      <img
        src={src}
        alt={alt}
        width={size?.width}
        height={size?.height}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
