import { useEffect, useRef } from "react";
import { useLoading } from "../../context/LoadingProvider";
import { setProgress } from "../Loading";
import "./GirlCharacter.css";

const GirlCharacter = () => {
  const { setLoading, setIsLoading } = useLoading();
  const charRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const progress = setProgress((value) => setLoading(value));

    const timer = setTimeout(() => {
      progress.loaded().then(() => {
        setTimeout(() => {
          import("../utils/initialFX").then((module) => {
            if (module.initialFX) module.initialFX();
            setIsLoading(false);
          });
        }, 2500);
      });
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!headRef.current) return;
    const head = headRef.current;

    const onMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const dx = (e.clientX - centerX) / centerX;
      const dy = (e.clientY - centerY) / centerY;
      const rotateX = -dy * 5;
      const rotateY = dx * 8;
      head.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div className="character-model" ref={charRef}>
      <div className="character-rim"></div>
      <div className="girl-character-wrap">
        <svg
          viewBox="0 0 320 560"
          xmlns="http://www.w3.org/2000/svg"
          className="girl-svg"
          aria-label="Priyanka girl developer character"
        >
          <defs>
            <radialGradient id="skinGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#FDDBB4" />
              <stop offset="100%" stopColor="#F0B882" />
            </radialGradient>
            <radialGradient id="hairGrad" cx="50%" cy="20%" r="80%">
              <stop offset="0%" stopColor="#2d1b6b" />
              <stop offset="100%" stopColor="#150d38" />
            </radialGradient>
            <radialGradient id="clothGrad" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#5b21b6" />
            </radialGradient>
            <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glow background circle */}
          <ellipse cx="160" cy="320" rx="130" ry="50" fill="url(#glowGrad)" />

          {/* Body - lower half / skirt */}
          <ellipse cx="160" cy="400" rx="65" ry="90" fill="#5b21b6" />

          {/* Torso */}
          <rect x="102" y="290" width="116" height="120" rx="22" fill="url(#clothGrad)" />

          {/* Collar / neckline detail */}
          <path d="M145 290 Q160 310 175 290" fill="#7c3aed" />

          {/* Left arm */}
          <path d="M102 310 Q68 335 72 390" stroke="#6d28d9" strokeWidth="28" fill="none" strokeLinecap="round" />
          {/* Right arm */}
          <path d="M218 310 Q252 335 248 390" stroke="#6d28d9" strokeWidth="28" fill="none" strokeLinecap="round" />

          {/* Left hand */}
          <ellipse cx="73" cy="393" rx="14" ry="11" fill="url(#skinGrad)" />
          {/* Right hand */}
          <ellipse cx="247" cy="393" rx="14" ry="11" fill="url(#skinGrad)" />

          {/* Laptop base */}
          <rect x="68" y="388" width="184" height="14" rx="7" fill="#1e1b4b" />
          {/* Laptop screen */}
          <rect x="82" y="340" width="156" height="52" rx="8" fill="#1e1b4b" />
          {/* Screen glow */}
          <rect x="87" y="345" width="146" height="42" rx="5" fill="#312e81" />
          {/* Code lines on screen */}
          <rect x="95" y="352" width="80" height="4" rx="2" fill="#818cf8" opacity="0.8" />
          <rect x="95" y="360" width="60" height="4" rx="2" fill="#34d399" opacity="0.8" />
          <rect x="95" y="368" width="100" height="4" rx="2" fill="#f472b6" opacity="0.7" />
          <rect x="95" y="376" width="45" height="4" rx="2" fill="#fbbf24" opacity="0.7" />
          {/* Screen cursor blink */}
          <rect x="198" y="376" width="2" height="8" rx="1" fill="white" opacity="0.9" className="cursor-blink" />

          {/* Neck */}
          <rect x="146" y="250" width="28" height="46" rx="14" fill="url(#skinGrad)" />

          {/* Head group (moved by cursor) */}
          <g ref={headRef} style={{ transformOrigin: "160px 185px", transition: "transform 0.15s ease-out" }}>
            {/* Hair back layer */}
            <ellipse cx="160" cy="165" rx="58" ry="65" fill="url(#hairGrad)" />

            {/* Long hair left */}
            <rect x="102" y="155" width="24" height="220" rx="12" fill="#1a0e42" className="hair-left" />
            {/* Long hair right */}
            <rect x="194" y="155" width="24" height="220" rx="12" fill="#1a0e42" className="hair-right" />

            {/* Hair flow left */}
            <path d="M102 220 Q85 280 95 340" stroke="#1a0e42" strokeWidth="20" fill="none" strokeLinecap="round" className="hair-flow-left" />
            {/* Hair flow right */}
            <path d="M218 220 Q235 280 225 340" stroke="#1a0e42" strokeWidth="20" fill="none" strokeLinecap="round" className="hair-flow-right" />

            {/* Face */}
            <ellipse cx="160" cy="175" rx="50" ry="57" fill="url(#skinGrad)" />

            {/* Hair top front */}
            <ellipse cx="160" cy="118" rx="56" ry="32" fill="url(#hairGrad)" />
            {/* Hair highlight */}
            <ellipse cx="145" cy="110" rx="20" ry="10" fill="#3b22a0" opacity="0.6" />
            {/* Side part */}
            <path d="M110 118 Q160 95 210 118" fill="#2d1b6b" />
            {/* Fringe */}
            <path d="M110 120 Q130 108 148 118 Q160 108 172 118 Q190 108 210 120" fill="#150d38" />

            {/* Eyebrows */}
            <path d="M128 148 Q138 142 148 146" stroke="#2d1b6b" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M172 148 Q182 142 192 146" stroke="#2d1b6b" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Eyes white */}
            <ellipse cx="138" cy="168" rx="13" ry="13" fill="white" />
            <ellipse cx="182" cy="168" rx="13" ry="13" fill="white" />

            {/* Iris */}
            <ellipse cx="138" cy="170" rx="9" ry="10" fill="#1a0a40" />
            <ellipse cx="182" cy="170" rx="9" ry="10" fill="#1a0a40" />

            {/* Iris color */}
            <ellipse cx="138" cy="170" rx="6" ry="7" fill="#6d28d9" />
            <ellipse cx="182" cy="170" rx="6" ry="7" fill="#6d28d9" />

            {/* Pupil */}
            <ellipse cx="139" cy="171" rx="4" ry="4" fill="#0a0520" />
            <ellipse cx="183" cy="171" rx="4" ry="4" fill="#0a0520" />

            {/* Eye shine */}
            <ellipse cx="141" cy="167" rx="2.5" ry="2.5" fill="white" />
            <ellipse cx="185" cy="167" rx="2.5" ry="2.5" fill="white" />

            {/* Eyelashes top */}
            <path d="M125 159 Q138 154 151 159" stroke="#1a0a40" strokeWidth="1.5" fill="none" />
            <path d="M169 159 Q182 154 195 159" stroke="#1a0a40" strokeWidth="1.5" fill="none" />

            {/* Eyelid bottom */}
            <path d="M126 178 Q138 183 150 178" stroke="#e8a882" strokeWidth="1" fill="none" />
            <path d="M170 178 Q182 183 194 178" stroke="#e8a882" strokeWidth="1" fill="none" />

            {/* Nose */}
            <ellipse cx="160" cy="190" rx="4" ry="3" fill="#e0a070" />

            {/* Blush */}
            <ellipse cx="120" cy="182" rx="12" ry="7" fill="#f9a8d4" opacity="0.35" />
            <ellipse cx="200" cy="182" rx="12" ry="7" fill="#f9a8d4" opacity="0.35" />

            {/* Mouth */}
            <path d="M147 203 Q160 215 173 203" stroke="#e87878" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Smile dimples */}
            <ellipse cx="146" cy="205" rx="2" ry="1.5" fill="#e0a070" opacity="0.6" />
            <ellipse cx="174" cy="205" rx="2" ry="1.5" fill="#e0a070" opacity="0.6" />

            {/* Earrings */}
            <ellipse cx="110" cy="178" rx="5" ry="5" fill="#c084fc" filter="url(#glow)" />
            <ellipse cx="210" cy="178" rx="5" ry="5" fill="#c084fc" filter="url(#glow)" />
          </g>

          {/* Legs */}
          <rect x="118" y="435" width="28" height="90" rx="14" fill="#4c1d95" />
          <rect x="174" y="435" width="28" height="90" rx="14" fill="#4c1d95" />

          {/* Shoes */}
          <ellipse cx="132" cy="527" rx="22" ry="11" fill="#3b0764" />
          <ellipse cx="188" cy="527" rx="22" ry="11" fill="#3b0764" />

          {/* Subtle shadow under feet */}
          <ellipse cx="160" cy="540" rx="60" ry="8" fill="#7c3aed" opacity="0.15" />
        </svg>

        {/* Floating particles */}
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>
    </div>
  );
};

export default GirlCharacter;
