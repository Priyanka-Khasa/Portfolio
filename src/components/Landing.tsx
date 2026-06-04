import { useState, useEffect, useRef } from "react";
import "./styles/Landing.css";

const IMAGES = [
  "/images/main1.png",
  "/images/main2.png",
  "/images/main3.png",
  "/images/main4.png",
  "/images/main5.png",
  "/images/main6.png",
];

const getRandomImage = () => IMAGES[Math.floor(Math.random() * IMAGES.length)];

const Landing = () => {
  const [currentImg, setCurrentImg] = useState<string>(getRandomImage);
  const [nextImg, setNextImg] = useState<string>("");
  const [fading, setFading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cycleImage = () => {
    const next = IMAGES[
      (IMAGES.indexOf(currentImg) + 1 + Math.floor(Math.random() * (IMAGES.length - 1))) %
        IMAGES.length
    ];
    setNextImg(next);
    setFading(true);
    setTimeout(() => {
      setCurrentImg(next);
      setNextImg("");
      setFading(false);
    }, 700);
  };

  useEffect(() => {
    intervalRef.current = setInterval(cycleImage, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentImg]);

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

        {/* 3D Image — center stage on all screen sizes */}
        <div className="landing-hero-img">
          <div className="landing-img-wrap">
            <img
              src={currentImg}
              alt="Priyanka Khasa 3D avatar"
              className={`hero-img hero-img-current${fading ? " hero-img-fade-out" : ""}`}
              draggable={false}
            />
            {nextImg && (
              <img
                src={nextImg}
                alt=""
                aria-hidden="true"
                className="hero-img hero-img-next hero-img-fade-in"
                draggable={false}
              />
            )}
            <div className="hero-img-glow" />
          </div>
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
      </div>
    </div>
  );
};

export default Landing;