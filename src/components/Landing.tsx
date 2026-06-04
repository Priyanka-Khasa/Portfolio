import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              PRIYANKA
              <br />
              <span>KHASA</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>A</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Full Stack Developer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Android &amp; AI Builder</div>
            </h2>
          </div>
          <div className="mobile-photo">
            <div className="mobile-girl-avatar">
              <div className="girl-glow"></div>
              <svg viewBox="0 0 280 480" xmlns="http://www.w3.org/2000/svg" className="girl-svg-mobile">
                <defs>
                  <radialGradient id="skinGradM" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#FDDBB4"/>
                    <stop offset="100%" stopColor="#F4C49A"/>
                  </radialGradient>
                  <radialGradient id="hairGradM" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#2d1b6b"/>
                    <stop offset="100%" stopColor="#1a0e42"/>
                  </radialGradient>
                </defs>
                <ellipse cx="140" cy="95" rx="52" ry="58" fill="url(#hairGradM)"/>
                <rect x="88" y="70" width="22" height="180" rx="11" fill="#1a0e42"/>
                <rect x="170" y="70" width="22" height="180" rx="11" fill="#1a0e42"/>
                <path d="M100 130 Q140 160 180 130" fill="#1a0e42"/>
                <ellipse cx="140" cy="92" rx="45" ry="50" fill="url(#skinGradM)"/>
                <ellipse cx="140" cy="52" rx="50" ry="30" fill="url(#hairGradM)"/>
                <path d="M90 52 Q140 20 190 52" fill="#2d1b6b"/>
                <path d="M95 45 Q140 10 185 45 Q185 52 140 50 Q95 52 95 45Z" fill="#3b22a0"/>
                <ellipse cx="122" cy="95" rx="10" ry="11" fill="white"/>
                <ellipse cx="158" cy="95" rx="10" ry="11" fill="white"/>
                <ellipse cx="124" cy="97" rx="7" ry="8" fill="#1a0a40"/>
                <ellipse cx="160" cy="97" rx="7" ry="8" fill="#1a0a40"/>
                <ellipse cx="126" cy="94" rx="2.5" ry="2.5" fill="white"/>
                <ellipse cx="162" cy="94" rx="2.5" ry="2.5" fill="white"/>
                <path d="M115 87 Q122 82 129 87" stroke="#8b5cf6" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M151 87 Q158 82 165 87" stroke="#8b5cf6" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <ellipse cx="140" cy="108" rx="3" ry="2" fill="#e8a882"/>
                <path d="M130 119 Q140 127 150 119" stroke="#e87878" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <rect x="110" y="140" width="60" height="25" rx="12" fill="#FDDBB4"/>
                <rect x="88" y="160" width="104" height="110" rx="20" fill="#7c3aed"/>
                <rect x="100" y="155" width="80" height="20" rx="10" fill="#6d28d9"/>
                <path d="M88 195 Q55 210 62 270" stroke="#6d28d9" strokeWidth="24" fill="none" strokeLinecap="round"/>
                <path d="M192 195 Q225 210 218 270" stroke="#6d28d9" strokeWidth="24" fill="none" strokeLinecap="round"/>
                <ellipse cx="140" cy="305" rx="60" ry="40" fill="#5b21b6"/>
                <rect x="95" y="315" width="27" height="80" rx="13" fill="#6d28d9"/>
                <rect x="158" y="315" width="27" height="80" rx="13" fill="#6d28d9"/>
                <ellipse cx="108" cy="397" rx="20" ry="10" fill="#4c1d95"/>
                <ellipse cx="172" cy="397" rx="20" ry="10" fill="#4c1d95"/>
                <rect x="55" y="265" width="170" height="12" rx="6" fill="#1e1b4b"/>
                <rect x="65" y="228" width="150" height="42" rx="8" fill="#1e1b4b"/>
                <rect x="70" y="233" width="140" height="32" rx="5" fill="#312e81"/>
                <ellipse cx="88" cy="270" rx="9" ry="9" fill="#60a5fa" opacity="0.6"/>
                <ellipse cx="108" cy="270" rx="9" ry="9" fill="#34d399" opacity="0.6"/>
              </svg>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
