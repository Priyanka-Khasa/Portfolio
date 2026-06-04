import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <div className="landing-section" id="landingDiv">
      <div className="landing-container">
        <div className="landing-intro">
          <h2>Hello! I'm</h2>
          <h1>
            PRIYANKA
            <span>KHASA</span>
          </h1>
        </div>

        <div className="landing-info">
          <h3>A</h3>
          <h2 className="landing-info-h2">
            <div className="landing-h2-1">Full Stack Dev</div>
            <div className="landing-h2-2">Android Builder</div>
          </h2>
          <h2>
            <div className="landing-h2-info">Android &amp; AI Builder</div>
            <div className="landing-h2-info-1">Full Stack Developer</div>
          </h2>
        </div>

        {/* Mobile inline SVG girl avatar */}
        <div className="mobile-photo">
          <svg viewBox="0 0 320 520" xmlns="http://www.w3.org/2000/svg" className="girl-svg-mobile">
            <defs>
              <radialGradient id="mSkin" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#fde8c8"/>
                <stop offset="100%" stopColor="#e8ad78"/>
              </radialGradient>
              <radialGradient id="mEye" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#c4b5fd"/>
                <stop offset="60%" stopColor="#7c3aed"/>
                <stop offset="100%" stopColor="#3b0764"/>
              </radialGradient>
            </defs>
            {/* Legs */}
            <rect x="118" y="380" width="30" height="110" rx="15" fill="#1e293b"/>
            <rect x="172" y="380" width="30" height="110" rx="15" fill="#1e293b"/>
            {/* Shoes */}
            <ellipse cx="133" cy="492" rx="24" ry="9" fill="#4338ca"/>
            <ellipse cx="187" cy="492" rx="24" ry="9" fill="#4338ca"/>
            {/* Body */}
            <path d="M82 270 Q75 325 80 380 L240 380 Q245 325 238 270 Q200 252 160 250 Q120 252 82 270Z" fill="#1e1b4b"/>
            <line x1="160" y1="260" x2="160" y2="380" stroke="#4f46e5" strokeWidth="1.5" opacity="0.4"/>
            {/* Arms */}
            <path d="M82 285 Q52 315 56 370 Q60 385 72 387" stroke="#2d2a5e" strokeWidth="26" fill="none" strokeLinecap="round"/>
            <path d="M238 285 Q268 315 264 370 Q260 385 248 387" stroke="#2d2a5e" strokeWidth="26" fill="none" strokeLinecap="round"/>
            {/* Hands */}
            <ellipse cx="70" cy="390" rx="15" ry="11" fill="url(#mSkin)"/>
            <ellipse cx="250" cy="390" rx="15" ry="11" fill="url(#mSkin)"/>
            {/* Laptop */}
            <rect x="58" y="384" width="204" height="14" rx="7" fill="#0f172a"/>
            <rect x="72" y="330" width="176" height="58" rx="8" fill="#0f172a"/>
            <rect x="77" y="335" width="166" height="48" rx="5" fill="#0ea5e9" opacity="0.15"/>
            <rect x="82" y="340" width="76" height="3" rx="1" fill="#f472b6" opacity="0.9"/>
            <rect x="82" y="347" width="56" height="3" rx="1" fill="#818cf8" opacity="0.8"/>
            <rect x="82" y="354" width="66" height="3" rx="1" fill="#34d399" opacity="0.8"/>
            <rect x="82" y="361" width="46" height="3" rx="1" fill="#fbbf24" opacity="0.7"/>
            <rect x="166" y="340" width="70" height="3" rx="1" fill="#34d399" opacity="0.7"/>
            <rect x="166" y="347" width="50" height="3" rx="1" fill="#818cf8" opacity="0.7"/>
            <rect x="166" y="354" width="64" height="3" rx="1" fill="#f472b6" opacity="0.6"/>
            {/* Neck */}
            <rect x="146" y="224" width="28" height="34" rx="14" fill="url(#mSkin)"/>
            {/* Hair back */}
            <ellipse cx="160" cy="128" rx="62" ry="70" fill="#1e0a4a"/>
            {/* Long hair strands */}
            <path d="M100 130 Q82 190 86 270 Q90 305 100 330" stroke="#1e0a4a" strokeWidth="22" fill="none" strokeLinecap="round"/>
            <path d="M220 130 Q238 190 234 270 Q230 305 220 330" stroke="#1e0a4a" strokeWidth="22" fill="none" strokeLinecap="round"/>
            {/* Face */}
            <ellipse cx="160" cy="132" rx="52" ry="56" fill="url(#mSkin)"/>
            {/* Hair top */}
            <ellipse cx="160" cy="74" rx="60" ry="30" fill="#1e0a4a"/>
            <path d="M100 72 Q128 58 148 72 Q160 62 172 72 Q192 58 220 72" fill="#150d38"/>
            {/* Eyebrows */}
            <path d="M132 102 Q143 96 154 100" stroke="#2d1066" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M166 100 Q177 96 188 102" stroke="#2d1066" strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* Eyes */}
            <ellipse cx="143" cy="118" rx="13" ry="12" fill="white"/>
            <ellipse cx="177" cy="118" rx="13" ry="12" fill="white"/>
            <ellipse cx="144" cy="119" rx="9" ry="10" fill="url(#mEye)"/>
            <ellipse cx="178" cy="119" rx="9" ry="10" fill="url(#mEye)"/>
            <ellipse cx="145" cy="120" rx="5.5" ry="6" fill="#1a0633"/>
            <ellipse cx="179" cy="120" rx="5.5" ry="6" fill="#1a0633"/>
            <ellipse cx="147" cy="115" rx="2.5" ry="2.5" fill="white" opacity="0.95"/>
            <ellipse cx="181" cy="115" rx="2.5" ry="2.5" fill="white" opacity="0.95"/>
            {/* Blush */}
            <ellipse cx="122" cy="136" rx="14" ry="8" fill="#f9a8d4" opacity="0.3"/>
            <ellipse cx="198" cy="136" rx="14" ry="8" fill="#f9a8d4" opacity="0.3"/>
            {/* Nose */}
            <ellipse cx="160" cy="144" rx="4" ry="3" fill="#d4956a" opacity="0.5"/>
            {/* Mouth */}
            <path d="M148 158 Q160 170 172 158" stroke="#e87090" strokeWidth="2.5" fill="rgba(232,112,144,0.25)" strokeLinecap="round"/>
            {/* Earrings */}
            <ellipse cx="108" cy="140" rx="5" ry="5" fill="#b794f4" opacity="0.8"/>
            <ellipse cx="212" cy="140" rx="5" ry="5" fill="#b794f4" opacity="0.8"/>
            {/* Code particles */}
            <text x="24" y="270" fill="#63f5e0" fontSize="10" opacity="0.5">{"</>"}</text>
            <text x="272" y="310" fill="#b794f4" fontSize="9" opacity="0.45">{"{ }"}</text>
          </svg>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Landing;
