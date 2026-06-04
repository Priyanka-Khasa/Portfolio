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
      const dx = ((e.clientX - cx) / cx) * 5;
      const dy = ((e.clientY - cy) / cy) * 2.5;
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
        viewBox="0 0 400 720"
        xmlns="http://www.w3.org/2000/svg"
        className="girl-svg"
        aria-label="Priyanka — girl developer character"
      >
        <defs>
          {/* Skin — warm medium-brown South Asian tone */}
          <radialGradient id="cSkin" cx="50%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="#d4956a" />
            <stop offset="55%"  stopColor="#c07d52" />
            <stop offset="100%" stopColor="#a86240" />
          </radialGradient>
          {/* Skin shadow for contouring */}
          <radialGradient id="cSkinShad" cx="50%" cy="60%" r="60%">
            <stop offset="0%"   stopColor="#9c5c34" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#9c5c34" stopOpacity="0" />
          </radialGradient>
          {/* Hair — deep dark brown/black */}
          <linearGradient id="cHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#1a0f00" />
            <stop offset="50%"  stopColor="#2c1a00" />
            <stop offset="100%" stopColor="#0d0800" />
          </linearGradient>
          {/* Hair highlight — warm auburn sheen */}
          <linearGradient id="cHairHL" x1="0%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%"   stopColor="#7c4a1a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7c4a1a" stopOpacity="0" />
          </linearGradient>
          {/* Jacket — deep charcoal with warm tint */}
          <linearGradient id="cJacket" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#1a1612" />
            <stop offset="100%" stopColor="#100d0a" />
          </linearGradient>
          {/* Jacket accent stripe */}
          <linearGradient id="cJacketAccent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#e8b96a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7ecbaa" stopOpacity="0.35" />
          </linearGradient>
          {/* Screen glow */}
          <radialGradient id="cScreen" cx="50%" cy="40%" r="65%">
            <stop offset="0%"   stopColor="#e8b96a" stopOpacity="0.7" />
            <stop offset="55%"  stopColor="#7ecbaa" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1a1612" stopOpacity="1" />
          </radialGradient>
          {/* Eye iris — warm hazel-brown */}
          <radialGradient id="cEye" cx="35%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#c8934a" />
            <stop offset="45%"  stopColor="#7a4520" />
            <stop offset="100%" stopColor="#2c1000" />
          </radialGradient>
          {/* Lip gradient */}
          <linearGradient id="cLip" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#c8505e" />
            <stop offset="100%" stopColor="#a83040" />
          </linearGradient>
          {/* Filters */}
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="softShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.35"/>
          </filter>
        </defs>

        {/* ── LEGS ── */}
        <rect x="150" y="510" width="40" height="155" rx="20" fill="#1c1812" />
        <rect x="210" y="510" width="40" height="155" rx="20" fill="#1c1812" />
        {/* Leg highlight */}
        <rect x="150" y="510" width="16" height="120" rx="8" fill="rgba(255,255,255,0.04)" />
        <rect x="210" y="510" width="16" height="120" rx="8" fill="rgba(255,255,255,0.04)" />

        {/* ── SNEAKERS ── */}
        <ellipse cx="170" cy="667" rx="30" ry="11" fill="#1a1612" />
        <rect x="140" y="656" width="60" height="15" rx="7" fill="#2c2418" />
        <ellipse cx="230" cy="667" rx="30" ry="11" fill="#1a1612" />
        <rect x="200" y="656" width="60" height="15" rx="7" fill="#2c2418" />
        {/* Shoe accent stripe */}
        <path d="M147 661 Q170 657 193 661" stroke="#e8b96a" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M207 661 Q230 657 253 661" stroke="#e8b96a" strokeWidth="1.5" fill="none" opacity="0.6"/>

        {/* ── JACKET BODY ── */}
        <path d="M108 355 Q96 420 100 510 L300 510 Q304 420 292 355 Q252 334 200 332 Q148 334 108 355Z"
              fill="url(#cJacket)" />

        {/* Jacket lapels */}
        <path d="M172 332 L162 378 L200 360 L238 378 L228 332 L200 340Z" fill="#241e16" />
        <path d="M172 332 L162 378 L200 360Z" fill="#3a2e1e" opacity="0.6" />
        <path d="M228 332 L238 378 L200 360Z" fill="#3a2e1e" opacity="0.6" />

        {/* Jacket accent stripe */}
        <path d="M108 382 Q200 367 292 382" stroke="url(#cJacketAccent)" strokeWidth="2" fill="none"/>
        <path d="M106 402 Q200 388 294 402" stroke="rgba(232,185,106,0.12)" strokeWidth="1" fill="none"/>

        {/* Zipper */}
        <line x1="200" y1="342" x2="200" y2="510" stroke="#e8b96a" strokeWidth="1.5" opacity="0.35"/>
        {[356,376,396,416,436,456,476,496].map((y, i) => (
          <circle key={i} cx="200" cy={y} r="2" fill="#e8b96a" opacity="0.4"/>
        ))}

        {/* Jacket pockets */}
        <rect x="116" y="408" width="50" height="38" rx="6" fill="rgba(232,185,106,0.06)" stroke="rgba(232,185,106,0.25)" strokeWidth="1"/>
        <rect x="234" y="408" width="50" height="38" rx="6" fill="rgba(126,203,170,0.06)" stroke="rgba(126,203,170,0.25)" strokeWidth="1"/>
        <text x="124" y="432" fill="#e8b96a" fontSize="16" opacity="0.75">{"</>"}</text>
        <text x="240" y="431" fill="#7ecbaa" fontSize="12" opacity="0.75">{"{ }"}</text>

        {/* ── ARMS ── */}
        {/* Left arm */}
        <path d="M108 365 Q68 408 74 470 Q78 490 96 492"
              stroke="#1a1612" strokeWidth="36" fill="none" strokeLinecap="round"/>
        <path d="M108 365 Q68 408 74 470 Q78 490 96 492"
              stroke="#241e16" strokeWidth="30" fill="none" strokeLinecap="round"/>
        {/* Right arm */}
        <path d="M292 365 Q332 408 326 470 Q322 490 304 492"
              stroke="#1a1612" strokeWidth="36" fill="none" strokeLinecap="round"/>
        <path d="M292 365 Q332 408 326 470 Q322 490 304 492"
              stroke="#241e16" strokeWidth="30" fill="none" strokeLinecap="round"/>

        {/* ── HANDS ── */}
        <ellipse cx="94"  cy="496" rx="20" ry="14" fill="url(#cSkin)" filter="url(#softShadow)"/>
        <ellipse cx="306" cy="496" rx="20" ry="14" fill="url(#cSkin)" filter="url(#softShadow)"/>
        {/* Finger hints */}
        <path d="M80 492 Q88 485 96 489"  stroke="#a86240" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M320 492 Q312 485 304 489" stroke="#a86240" strokeWidth="2" fill="none" strokeLinecap="round"/>

        {/* ── LAPTOP ── */}
        <rect x="76"  y="490" width="248" height="20" rx="10" fill="#0d0b08"/>
        <rect x="92"  y="428" width="216" height="66"  rx="11" fill="#0d0b08"/>
        <rect x="98"  y="434" width="204" height="54"  rx="8"  fill="url(#cScreen)"/>
        {/* Screen code lines */}
        <rect x="106" y="441" width="92"  height="3" rx="1.5" fill="#e8748a" opacity="0.9"/>
        <rect x="110" y="449" width="70"  height="3" rx="1.5" fill="#e8b96a" opacity="0.85"/>
        <rect x="114" y="457" width="56"  height="3" rx="1.5" fill="#7ecbaa" opacity="0.85"/>
        <rect x="110" y="465" width="82"  height="3" rx="1.5" fill="#e8b96a" opacity="0.75"/>
        <rect x="106" y="473" width="66"  height="3" rx="1.5" fill="#e8748a" opacity="0.8"/>
        <rect x="110" y="481" width="46"  height="3" rx="1.5" fill="#f5ead4" opacity="0.5"/>
        {/* Right panel */}
        <rect x="210" y="441" width="82" height="3" rx="1.5" fill="#7ecbaa" opacity="0.7"/>
        <rect x="210" y="449" width="62" height="3" rx="1.5" fill="#e8b96a" opacity="0.65"/>
        <rect x="210" y="457" width="76" height="3" rx="1.5" fill="#e8748a" opacity="0.6"/>
        <rect x="210" y="465" width="52" height="3" rx="1.5" fill="#f5ead4" opacity="0.5"/>
        {/* Cursor */}
        <rect x="176" y="479" width="2" height="8" rx="1" fill="white" className="cursor-blink"/>
        {/* Screen glare */}
        <path d="M100 436 Q128 433 156 436" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Hinge */}
        <rect x="92" y="492" width="216" height="4" rx="2" fill="#1c1812"/>

        {/* ── NECK ── */}
        <rect x="182" y="304" width="36" height="44" rx="18" fill="url(#cSkin)" filter="url(#softShadow)"/>
        <rect x="182" y="318" width="16" height="30" rx="8" fill="rgba(0,0,0,0.12)"/>

        {/* ── HEAD GROUP (mouse-tracked) ── */}
        <g className="char-head-group" style={{transformOrigin:"200px 190px", transition:"transform 0.12s ease-out"}}>

          {/* Hair back base */}
          <ellipse cx="200" cy="166" rx="76" ry="88" fill="url(#cHair)"/>

          {/* Long hair — left */}
          <path d="M130 172 Q108 240 112 336 Q116 386 132 416"
                stroke="#1a0f00" strokeWidth="30" fill="none" strokeLinecap="round" className="hair-left"/>
          <path d="M130 172 Q108 240 112 336 Q116 386 132 416"
                stroke="#2c1a00" strokeWidth="22" fill="none" strokeLinecap="round" className="hair-left"/>
          <path d="M134 172 Q114 240 118 326"
                stroke="#5c3410" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.45" className="hair-left"/>

          {/* Long hair — right */}
          <path d="M270 172 Q292 240 288 336 Q284 386 268 416"
                stroke="#1a0f00" strokeWidth="30" fill="none" strokeLinecap="round" className="hair-right"/>
          <path d="M270 172 Q292 240 288 336 Q284 386 268 416"
                stroke="#2c1a00" strokeWidth="22" fill="none" strokeLinecap="round" className="hair-right"/>

          {/* ── FACE SHAPE — natural oval ── */}
          {/* Jawline / lower face slightly narrower = natural oval */}
          <ellipse cx="200" cy="172" rx="62" ry="72" fill="url(#cSkin)" filter="url(#softShadow)"/>
          {/* Contouring — temples */}
          <ellipse cx="154" cy="168" rx="16" ry="26" fill="url(#cSkinShad)"/>
          <ellipse cx="246" cy="168" rx="16" ry="26" fill="url(#cSkinShad)"/>

          {/* Hair top — bangs layer */}
          <ellipse cx="200" cy="100" rx="74" ry="40" fill="url(#cHair)"/>
          {/* Bangs individual strands */}
          <path d="M130 99 Q156 80 178 99 Q188 86 200 94 Q212 86 222 99 Q244 80 270 99" fill="#1a0f00"/>
          {/* Hair highlight (warm sheen on top) */}
          <ellipse cx="178" cy="92" rx="28" ry="14" fill="url(#cHairHL)" opacity="0.7"/>
          <path d="M130 102 Q160 88 200 96 Q240 88 270 102" fill="url(#cHair)"/>

          {/* Side wisps */}
          <path d="M132 138 Q120 165 124 196" stroke="#2c1a00" strokeWidth="12" fill="none" strokeLinecap="round"/>
          <path d="M268 138 Q280 165 276 196" stroke="#2c1a00" strokeWidth="12" fill="none" strokeLinecap="round"/>

          {/* ── EARS ── */}
          <ellipse cx="138" cy="180" rx="11" ry="15" fill="url(#cSkin)"/>
          <ellipse cx="140" cy="180" rx="6" ry="8"  fill="rgba(150,80,40,0.28)"/>
          {/* Gold hoop earring L */}
          <circle cx="138" cy="194" r="6" fill="none" stroke="#e8b96a" strokeWidth="2.5" filter="url(#neonGlow)" opacity="0.9"/>

          <ellipse cx="262" cy="180" rx="11" ry="15" fill="url(#cSkin)"/>
          <ellipse cx="260" cy="180" rx="6" ry="8"  fill="rgba(150,80,40,0.28)"/>
          {/* Gold hoop earring R */}
          <circle cx="262" cy="194" r="6" fill="none" stroke="#e8b96a" strokeWidth="2.5" filter="url(#neonGlow)" opacity="0.9"/>

          {/* ── EYEBROWS — thick natural Indian brows ── */}
          {/* Left brow */}
          <path d="M162 130 Q178 122 196 128" stroke="#1a0f00" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M162 130 Q178 122 196 128" stroke="#3a2010" strokeWidth="3" fill="none" strokeLinecap="round"/>
          {/* Right brow */}
          <path d="M204 128 Q222 122 238 130" stroke="#1a0f00" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M204 128 Q222 122 238 130" stroke="#3a2010" strokeWidth="3" fill="none" strokeLinecap="round"/>

          {/* ── EYES — almond shaped, realistic size ── */}
          {/* Eye white L — almond shape */}
          <path d="M162 154 Q178 144 194 154 Q178 164 162 154Z" fill="white"/>
          {/* Eye white R */}
          <path d="M206 154 Q222 144 238 154 Q222 164 206 154Z" fill="white"/>

          {/* Iris L */}
          <circle cx="178" cy="154" r="10" fill="url(#cEye)"/>
          {/* Iris R */}
          <circle cx="222" cy="154" r="10" fill="url(#cEye)"/>

          {/* Pupil L */}
          <circle cx="179" cy="155" r="6" fill="#160800"/>
          {/* Pupil R */}
          <circle cx="223" cy="155" r="6" fill="#160800"/>

          {/* Iris light ring */}
          <circle cx="178" cy="154" r="4" fill="#c8934a" opacity="0.3"/>
          <circle cx="222" cy="154" r="4" fill="#c8934a" opacity="0.3"/>

          {/* Eye shine L */}
          <ellipse cx="182" cy="150" rx="3" ry="3" fill="white" opacity="0.9"/>
          <ellipse cx="175" cy="158" rx="1.5" ry="1.5" fill="white" opacity="0.45"/>
          {/* Eye shine R */}
          <ellipse cx="226" cy="150" rx="3" ry="3" fill="white" opacity="0.9"/>
          <ellipse cx="219" cy="158" rx="1.5" ry="1.5" fill="white" opacity="0.45"/>

          {/* Upper lash line L */}
          <path d="M160 148 Q178 142 196 148" stroke="#160800" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          {/* Upper lash line R */}
          <path d="M204 148 Q222 142 240 148" stroke="#160800" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

          {/* Lower lash/lid L */}
          <path d="M162 160 Q178 166 194 160" stroke="#a86240" strokeWidth="1" fill="none" opacity="0.45"/>
          {/* Lower lash/lid R */}
          <path d="M206 160 Q222 166 238 160" stroke="#a86240" strokeWidth="1" fill="none" opacity="0.45"/>

          {/* Kohl/kajal hint */}
          <path d="M160 148 Q154 152 156 157" stroke="#160800" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round"/>
          <path d="M240 148 Q246 152 244 157" stroke="#160800" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round"/>

          {/* ── NOSE — natural bridge + tip ── */}
          {/* Bridge */}
          <path d="M196 168 Q193 182 192 194" stroke="#9c5c34" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round"/>
          <path d="M204 168 Q207 182 208 194" stroke="#9c5c34" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round"/>
          {/* Nostrils */}
          <path d="M188 198 Q200 206 212 198" stroke="#9c5c34" strokeWidth="2" fill="none" opacity="0.65" strokeLinecap="round"/>
          <ellipse cx="192" cy="198" rx="5" ry="4" fill="#9c5c34" opacity="0.35"/>
          <ellipse cx="208" cy="198" rx="5" ry="4" fill="#9c5c34" opacity="0.35"/>

          {/* Philtrum shadow */}
          <path d="M196 204 Q200 210 204 204" stroke="#9c5c34" strokeWidth="1" fill="none" opacity="0.4"/>

          {/* ── SUBTLE BLUSH ── */}
          <ellipse cx="158" cy="182" rx="18" ry="10" fill="#e87090" opacity="0.14"/>
          <ellipse cx="242" cy="182" rx="18" ry="10" fill="#e87090" opacity="0.14"/>

          {/* ── LIPS — fuller, defined ── */}
          {/* Cupid's bow upper lip */}
          <path d="M180 216 Q188 210 200 213 Q212 210 220 216" stroke="#c8505e" strokeWidth="2" fill="none" strokeLinecap="round"/>
          {/* Lower lip */}
          <path d="M179 217 Q200 234 221 217" fill="rgba(200,80,94,0.35)" stroke="#c8505e" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Upper lip fill */}
          <path d="M180 216 Q188 210 200 213 Q212 210 220 216 Q210 222 200 220 Q190 222 180 216Z" fill="rgba(185,60,75,0.4)"/>
          {/* Lip shine */}
          <ellipse cx="200" cy="224" rx="10" ry="3.5" fill="rgba(255,255,255,0.18)"/>
          {/* Lip corner */}
          <circle cx="180" cy="217" r="1.5" fill="#c8505e" opacity="0.7"/>
          <circle cx="220" cy="217" r="1.5" fill="#c8505e" opacity="0.7"/>

        </g>

        {/* ── FLOATING PARTICLES ── */}
        <circle cx="82"  cy="340" r="3"   fill="#e8b96a" opacity="0.65" className="p1" filter="url(#softGlow)"/>
        <circle cx="322" cy="296" r="4"   fill="#7ecbaa" opacity="0.75" className="p2" filter="url(#softGlow)"/>
        <circle cx="64"  cy="440" r="2.5" fill="#e8748a" opacity="0.55" className="p3" filter="url(#softGlow)"/>
        <circle cx="340" cy="398" r="3"   fill="#e8b96a" opacity="0.65" className="p4" filter="url(#softGlow)"/>
        <circle cx="98"  cy="520" r="2"   fill="#7ecbaa" opacity="0.5"  className="p5" filter="url(#softGlow)"/>
        <circle cx="316" cy="542" r="2.5" fill="#e8748a" opacity="0.55" className="p6" filter="url(#softGlow)"/>

        {/* ── CODE FLOATS ── */}
        <text x="44"  y="360" fill="#e8b96a" fontSize="11" opacity="0.45" className="code-float-1">{"<dev/>"}</text>
        <text x="326" y="452" fill="#7ecbaa" fontSize="10" opacity="0.45" className="code-float-2">{"{ js }"}</text>
        <text x="42"  y="482" fill="#e8748a" fontSize="10" opacity="0.4"  className="code-float-3">{"fn()"}</text>
      </svg>
    </div>
  );
};

export default GirlCharacter;