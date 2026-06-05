import { useEffect, useRef } from "react";
import "./styles/Loading.css";

export default function Loading() {
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 4) + 2;
      if (count >= 100) {
        count = 100;
        clearInterval(interval);
      }
      if (countRef.current) countRef.current.textContent = String(count);
      if (barRef.current) barRef.current.style.width = `${count}%`;
    }, 22);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={overlayRef} className="loading-overlay">
      <div className="loading-inner">
        <div className="loading-logo">
          <span>PK</span>
        </div>
        <div className="loading-bar-wrap">
          <div ref={barRef} className="loading-bar" />
        </div>
        <div className="loading-count">
          <span ref={countRef}>0</span>%
        </div>
      </div>
      <div className="loading-noise" />
    </div>
  );
}
