import { useEffect, useRef } from "react";
import { useLoading } from "../../context/LoadingProvider";
import { setProgress } from "../Loading";
import "./GirlCharacter.css";

const GirlCharacter = () => {
  const { setLoading, setIsLoading } = useLoading();
  const wrapRef = useRef<HTMLDivElement>(null);

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
    if (!wrapRef.current) return;
    const wrap = wrapRef.current;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = ((e.clientX - cx) / cx) * 6;
      const dy = ((e.clientY - cy) / cy) * 3;
      const head = wrap.querySelector<SVGGElement>(".char-head-group");
      if (head) head.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="character-model" ref={wrapRef}>
      <div className="char-glow-base"></div>
      <svg
        viewBox="0 0 380 680"
        xmlns="http://www.w3.org/2000/svg"
        className="girl-svg"
        aria-label="Priyanka — girl developer character"
      >
        <defs>
          {/* Skin gradient */}
          <radialGradient id="cSkin" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fde8c8" />
            <stop offset="60%" stopColor="#f5c998" />
            <stop offset="100%" stopColor="#e8ad78" />
          </radialGradient>
          {/* Hair gradient */}
          <linearGradient id="cHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e0a4a" />
            <stop offset="50%" stopColor="#2d1066" />
            <stop offset="100%" stopColor="#0f0523" />
          </linearGradient>
          {/* Hair highlight */}
          <linearGradient id="cHairHL" x1="0%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
          </linearGradient>
          {/* Jacket gradient */}
          <linearGradient id="cJacket" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#13103a" />
          </linearGradient>
          {/* Jacket accent */}
          <linearGradient id="cJacketAccent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
          </linearGradient>
          {/* Screen glow */}
          <radialGradient id="cScreen" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#0d9488" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="1" />
          </radialGradient>
          {/* Eye gradient */}
          <radialGradient id="cEye" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#3b0764" />
          </radialGradient>
          {/* Character glow filter */}
          <filter id="charGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* Soft glow filter */}
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Neon glow */}
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <clipPath id="faceClip">
            <ellipse cx="190" cy="135" rx="52" ry="60" />
          </clipPath>
        </defs>

        {/* ── LEGS ── */}
        <rect x="142" y="490" width="38" height="140" rx="19" fill="#1e293b" />
        <rect x="200" y="490" width="38" height="140" rx="19" fill="#1e293b" />

        {/* Leg shading */}
        <rect x="142" y="490" width="18" height="140" rx="9" fill="rgba(0,0,0,0.2)" />
        <rect x="200" y="490" width="18" height="140" rx="9" fill="rgba(0,0,0,0.2)" />

        {/* ── SNEAKERS ── */}
        <ellipse cx="161" cy="632" rx="28" ry="10" fill="#312e81" />
        <rect x="133" y="622" width="56" height="14" rx="7" fill="#4338ca" />
        <ellipse cx="219" cy="632" rx="28" ry="10" fill="#312e81" />
        <rect x="191" y="622" width="56" height="14" rx="7" fill="#4338ca" />
        {/* Sneaker details */}
        <path d="M140 628 Q161 624 182 628" stroke="#818cf8" strokeWidth="1.5" fill="none" opacity="0.7" />
        <path d="M198 628 Q219 624 240 628" stroke="#818cf8" strokeWidth="1.5" fill="none" opacity="0.7" />

        {/* ── BODY / JACKET ── */}
        {/* Main jacket body */}
        <path d="M100 340 Q90 400 95 490 L285 490 Q290 400 280 340 Q240 320 190 318 Q140 320 100 340Z" fill="url(#cJacket)" />

        {/* Jacket collar / lapels */}
        <path d="M165 318 L155 360 L190 345 L225 360 L215 318 L190 325Z" fill="#2d2a5e" />
        <path d="M165 318 L155 360 L190 345Z" fill="#3730a3" opacity="0.5" />
        <path d="M215 318 L225 360 L190 345Z" fill="#3730a3" opacity="0.5" />

        {/* Jacket stripe/accent line */}
        <path d="M100 370 Q190 355 280 370" stroke="url(#cJacketAccent)" strokeWidth="2" fill="none" />
        <path d="M98 390 Q190 375 282 390" stroke="rgba(99,245,224,0.2)" strokeWidth="1" fill="none" />

        {/* Jacket zipper */}
        <line x1="190" y1="328" x2="190" y2="490" stroke="#4f46e5" strokeWidth="2" opacity="0.5" />
        {[340,360,380,400,420,440,460].map((y, i) => (
          <circle key={i} cx="190" cy={y} r="2" fill="#818cf8" opacity="0.6" />
        ))}

        {/* Jacket pocket patches */}
        <rect x="110" y="390" width="45" height="35" rx="5" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
        <rect x="225" y="390" width="45" height="35" rx="5" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
        {/* Pocket icons */}
        <text x="118" y="413" fill="#818cf8" fontSize="18" opacity="0.8">{"</>"}</text>
        <text x="232" y="413" fill="#63f5e0" fontSize="12" opacity="0.8">{"{ }"}</text>

        {/* ── ARMS ── */}
        {/* Left arm */}
        <path d="M100 350 Q62 390 68 450 Q72 470 88 472" stroke="#1e1b4b" strokeWidth="34" fill="none" strokeLinecap="round" />
        <path d="M100 350 Q62 390 68 450 Q72 470 88 472" stroke="#2d2a5e" strokeWidth="30" fill="none" strokeLinecap="round" />
        {/* Right arm */}
        <path d="M280 350 Q318 390 312 450 Q308 470 292 472" stroke="#1e1b4b" strokeWidth="34" fill="none" strokeLinecap="round" />
        <path d="M280 350 Q318 390 312 450 Q308 470 292 472" stroke="#2d2a5e" strokeWidth="30" fill="none" strokeLinecap="round" />

        {/* ── HANDS ── */}
        <ellipse cx="86" cy="476" rx="18" ry="13" fill="url(#cSkin)" />
        <ellipse cx="294" cy="476" rx="18" ry="13" fill="url(#cSkin)" />
        {/* Fingers hint */}
        <path d="M74 472 Q80 466 86 470" stroke="#e8ad78" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M306 472 Q300 466 294 470" stroke="#e8ad78" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* ── LAPTOP ── */}
        {/* Laptop base */}
        <rect x="72" y="470" width="236" height="18" rx="9" fill="#0f172a" />
        {/* Laptop screen frame */}
        <rect x="88" y="410" width="204" height="64" rx="10" fill="#0f172a" />
        {/* Screen glow area */}
        <rect x="93" y="415" width="194" height="54" rx="7" fill="url(#cScreen)" />
        {/* Screen content - code */}
        <rect x="100" y="422" width="90" height="3" rx="1.5" fill="#f472b6" opacity="0.9" />
        <rect x="104" y="430" width="70" height="3" rx="1.5" fill="#818cf8" opacity="0.8" />
        <rect x="108" y="438" width="55" height="3" rx="1.5" fill="#34d399" opacity="0.8" />
        <rect x="104" y="446" width="80" height="3" rx="1.5" fill="#fbbf24" opacity="0.7" />
        <rect x="100" y="454" width="65" height="3" rx="1.5" fill="#f472b6" opacity="0.8" />
        <rect x="104" y="462" width="45" height="3" rx="1.5" fill="#818cf8" opacity="0.7" />
        {/* Right panel code */}
        <rect x="200" y="422" width="80" height="3" rx="1.5" fill="#34d399" opacity="0.7" />
        <rect x="200" y="430" width="60" height="3" rx="1.5" fill="#818cf8" opacity="0.7" />
        <rect x="200" y="438" width="75" height="3" rx="1.5" fill="#f472b6" opacity="0.6" />
        <rect x="200" y="446" width="50" height="3" rx="1.5" fill="#fbbf24" opacity="0.6" />
        {/* Cursor blink */}
        <rect x="170" y="462" width="2" height="8" rx="1" fill="white" className="cursor-blink" />
        {/* Screen glare */}
        <path d="M95 417 Q120 415 145 417" stroke="rgba(255,255,255,0.12)" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Hinge */}
        <rect x="88" y="472" width="204" height="4" rx="2" fill="#1e293b" />

        {/* ── NECK ── */}
        <rect x="174" y="290" width="32" height="42" rx="16" fill="url(#cSkin)" />
        {/* Neck shadow */}
        <rect x="174" y="300" width="14" height="32" rx="7" fill="rgba(0,0,0,0.1)" />

        {/* ── HEAD GROUP (cursor-tracked) ── */}
        <g className="char-head-group" style={{transformOrigin: "190px 175px", transition: "transform 0.12s ease-out"}}>

          {/* Hair back layer */}
          <ellipse cx="190" cy="145" rx="68" ry="78" fill="url(#cHair)" />

          {/* Long hair left strand */}
          <path d="M124 155 Q105 220 108 310 Q112 360 125 390" stroke="#1e0a4a" strokeWidth="26" fill="none" strokeLinecap="round" className="hair-left" />
          <path d="M124 155 Q105 220 108 310 Q112 360 125 390" stroke="#2d1066" strokeWidth="20" fill="none" strokeLinecap="round" className="hair-left" />
          {/* Hair left highlight */}
          <path d="M128 155 Q110 220 114 300" stroke="#4c1d95" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.6" className="hair-left" />

          {/* Long hair right strand */}
          <path d="M256 155 Q275 220 272 310 Q268 360 255 390" stroke="#1e0a4a" strokeWidth="26" fill="none" strokeLinecap="round" className="hair-right" />
          <path d="M256 155 Q275 220 272 310 Q268 360 255 390" stroke="#2d1066" strokeWidth="20" fill="none" strokeLinecap="round" className="hair-right" />

          {/* ── FACE ── */}
          <ellipse cx="190" cy="148" rx="52" ry="58" fill="url(#cSkin)" />

          {/* Face shading / contouring */}
          <ellipse cx="172" cy="155" rx="12" ry="20" fill="rgba(0,0,0,0.04)" />
          <ellipse cx="208" cy="155" rx="12" ry="20" fill="rgba(0,0,0,0.04)" />

          {/* Hair top / bangs */}
          <ellipse cx="190" cy="90" rx="66" ry="35" fill="url(#cHair)" />
          {/* Bangs detail */}
          <path d="M126 88 Q148 72 168 88 Q178 78 190 85 Q202 78 212 88 Q232 72 254 88" fill="#1e0a4a" />
          {/* Hair highlight on top */}
          <ellipse cx="172" cy="84" rx="22" ry="10" fill="url(#cHairHL)" opacity="0.8" />
          {/* Side part definition */}
          <path d="M126 90 Q150 78 190 86 Q230 78 254 90" fill="url(#cHair)" />

          {/* Ear left */}
          <ellipse cx="138" cy="158" rx="10" ry="13" fill="url(#cSkin)" />
          {/* Ear detail */}
          <ellipse cx="140" cy="158" rx="5" ry="7" fill="rgba(200,130,90,0.3)" />
          {/* Earring left */}
          <ellipse cx="138" cy="170" rx="5" ry="5" fill="#b794f4" filter="url(#neonGlow)" />

          {/* Ear right */}
          <ellipse cx="242" cy="158" rx="10" ry="13" fill="url(#cSkin)" />
          <ellipse cx="240" cy="158" rx="5" ry="7" fill="rgba(200,130,90,0.3)" />
          {/* Earring right */}
          <ellipse cx="242" cy="170" rx="5" ry="5" fill="#b794f4" filter="url(#neonGlow)" />

          {/* ── EYEBROWS ── */}
          <path d="M160 112 Q172 106 184 110" stroke="#2d1066" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M196 110 Q208 106 220 112" stroke="#2d1066" strokeWidth="3.5" fill="none" strokeLinecap="round" />

          {/* ── EYES ── */}
          {/* Eye white left */}
          <ellipse cx="172" cy="130" rx="15" ry="14" fill="white" />
          {/* Eye white right */}
          <ellipse cx="208" cy="130" rx="15" ry="14" fill="white" />

          {/* Iris left */}
          <ellipse cx="173" cy="131" rx="11" ry="12" fill="url(#cEye)" />
          {/* Iris right */}
          <ellipse cx="209" cy="131" rx="11" ry="12" fill="url(#cEye)" />

          {/* Pupil left */}
          <ellipse cx="174" cy="132" rx="6" ry="7" fill="#1a0633" />
          {/* Pupil right */}
          <ellipse cx="210" cy="132" rx="6" ry="7" fill="#1a0633" />

          {/* Eye glow / iris light */}
          <ellipse cx="173" cy="131" rx="4" ry="4" fill="#a78bfa" opacity="0.4" />
          <ellipse cx="209" cy="131" rx="4" ry="4" fill="#a78bfa" opacity="0.4" />

          {/* Eye shine dots */}
          <ellipse cx="176" cy="126" rx="3" ry="3" fill="white" opacity="0.95" />
          <ellipse cx="212" cy="126" rx="3" ry="3" fill="white" opacity="0.95" />
          <ellipse cx="169" cy="134" rx="1.5" ry="1.5" fill="white" opacity="0.5" />
          <ellipse cx="205" cy="134" rx="1.5" ry="1.5" fill="white" opacity="0.5" />

          {/* Upper eyelashes */}
          <path d="M157 119 Q172 113 187 119" stroke="#1a0633" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M193 119 Q208 113 223 119" stroke="#1a0633" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Lower eyelid line */}
          <path d="M158 142 Q172 147 186 142" stroke="#e8ad78" strokeWidth="1" fill="none" opacity="0.5" />
          <path d="M194 142 Q208 147 222 142" stroke="#e8ad78" strokeWidth="1" fill="none" opacity="0.5" />

          {/* ── NOSE ── */}
          <ellipse cx="190" cy="160" rx="5" ry="4" fill="#d4956a" opacity="0.6" />
          <path d="M185 162 Q190 168 195 162" stroke="#d4956a" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round" />

          {/* ── BLUSH ── */}
          <ellipse cx="152" cy="160" rx="16" ry="9" fill="#f9a8d4" opacity="0.3" />
          <ellipse cx="228" cy="160" rx="16" ry="9" fill="#f9a8d4" opacity="0.3" />

          {/* ── MOUTH ── */}
          {/* Lips upper */}
          <path d="M175 178 Q183 173 190 175 Q197 173 205 178" stroke="#e8688a" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Lips lower */}
          <path d="M174 179 Q190 193 206 179" stroke="#e87090" strokeWidth="2.5" fill="rgba(240, 130, 150, 0.3)" strokeLinecap="round" />

          {/* Lip shine */}
          <ellipse cx="190" cy="184" rx="8" ry="3" fill="rgba(255,255,255,0.2)" />

          {/* ── HAIR FRONT WISPS ── */}
          {/* Side wisps */}
          <path d="M126 120 Q118 145 122 175" stroke="#2d1066" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M254 120 Q262 145 258 175" stroke="#2d1066" strokeWidth="10" fill="none" strokeLinecap="round" />

        </g>

        {/* ── FLOATING PARTICLES ── */}
        <circle cx="78" cy="320" r="3" fill="#63f5e0" opacity="0.7" className="p1" filter="url(#softGlow)" />
        <circle cx="305" cy="280" r="4" fill="#b794f4" opacity="0.8" className="p2" filter="url(#softGlow)" />
        <circle cx="60" cy="420" r="2.5" fill="#f687b3" opacity="0.6" className="p3" filter="url(#softGlow)" />
        <circle cx="325" cy="380" r="3" fill="#63f5e0" opacity="0.7" className="p4" filter="url(#softGlow)" />
        <circle cx="95" cy="500" r="2" fill="#b794f4" opacity="0.5" className="p5" filter="url(#softGlow)" />
        <circle cx="300" cy="520" r="2.5" fill="#f687b3" opacity="0.6" className="p6" filter="url(#softGlow)" />

        {/* ── NEON CODE PARTICLES ── */}
        <text x="42" y="340" fill="#63f5e0" fontSize="11" opacity="0.5" className="code-float-1">{"<dev/>"}</text>
        <text x="310" y="430" fill="#b794f4" fontSize="10" opacity="0.5" className="code-float-2">{"{ js }"}</text>
        <text x="40" y="460" fill="#f687b3" fontSize="10" opacity="0.45" className="code-float-3">{"fn()"}</text>
      </svg>
    </div>
  );
};

export default GirlCharacter;
