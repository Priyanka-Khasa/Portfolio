import { useState } from "react";

interface WorkImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function WorkImage({ src, alt, className = "" }: WorkImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`work-img-wrap ${className}`}>
      {!loaded && <div className="work-img-skeleton" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
        loading="lazy"
      />
    </div>
  );
}
