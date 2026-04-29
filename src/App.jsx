import { useEffect, useMemo, useRef, useState } from "react";
import VillageWorld from "./components/VillageWorld.jsx";
import { featuredProjects, places, profile, skillGroups } from "./data/portfolio";

const controlLabels = {
  sound: ["Sound", "Sound on"],
  rain: ["Rain", "Rain on"],
  night: ["Night", "Night view"],
};

function useAmbientAudio(isPlaying) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) {
      audioRef.current?.close?.();
      audioRef.current = null;
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const context = new AudioContext();
    const master = context.createGain();
    master.gain.value = 0.22;
    master.connect(context.destination);
    audioRef.current = context;

    [110, 164.81, 220].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 0 ? "triangle" : "sine";
      oscillator.frequency.value = frequency;
      gain.gain.value = [0.03, 0.014, 0.012][index];
      oscillator.connect(gain).connect(master);
      oscillator.start();
    });

    const timers = [
      window.setInterval(() => shimmer(context, master), 1350),
      window.setInterval(() => romanticChord(context, master), 5200),
      window.setInterval(() => softPulse(context, master), 1750),
      window.setInterval(() => wind(context, master), 3000),
    ];

    return () => {
      timers.forEach(window.clearInterval);
      context.close();
      audioRef.current = null;
    };
  }, [isPlaying]);
}

function shimmer(context, master) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(740 + Math.random() * 260, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(980 + Math.random() * 300, context.currentTime + 0.28);
  gain.gain.setValueAtTime(0.001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.024, context.currentTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.72);
  oscillator.connect(gain).connect(master);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.78);
}

function romanticChord(context, master) {
  [220, 277.18, 329.63, 440].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.detune.value = (index - 1.5) * 4;
    gain.gain.setValueAtTime(0.001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035 / (index + 1), context.currentTime + 0.45);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 3.4);
    oscillator.connect(gain).connect(master);
    oscillator.start();
    oscillator.stop(context.currentTime + 3.55);
  });
}

function softPulse(context, master) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(58, context.currentTime);
  gain.gain.setValueAtTime(0.001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.32);
  oscillator.connect(gain).connect(master);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.36);
}

function wind(context, master) {
  const bufferSize = context.sampleRate;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < bufferSize; index += 1) {
    data[index] = (Math.random() * 2 - 1) * 0.08;
  }

  const noise = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  filter.type = "lowpass";
  filter.frequency.value = 360;
  gain.gain.value = 0.036;
  noise.buffer = buffer;
  noise.connect(filter).connect(gain).connect(master);
  noise.start();
}

function App() {
  const [activePlace, setActivePlace] = useState("home");
  const [isNight, setIsNight] = useState(false);
  const [isRaining, setIsRaining] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [toast, setToast] = useState("Choose a section or click glowing places across the 3D island.");
  const place = useMemo(() => places.find((item) => item.id === activePlace), [activePlace]);

  useAmbientAudio(isPlaying);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function visitPlace(id) {
    const nextPlace = places.find((item) => item.id === id);
    setActivePlace(id);
    setToast(`${nextPlace.nav} selected.`);

    if (isPlaying && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${nextPlace.title}. ${nextPlace.copy}`);
      utterance.rate = 0.92;
      utterance.pitch = 0.95;
      utterance.volume = 0.48;
      window.speechSynthesis.speak(utterance);
    }
  }

  return (
    <main className={`app-shell ${isNight ? "night-ui" : ""}`} style={{ "--active-color": place.color }}>
      <VillageWorld
        activePlace={activePlace}
        onSelect={visitPlace}
        isNight={isNight}
        isRaining={isRaining}
      />

      <div className="scene-grade" />

      <header className="top-bar panel">
        <button className="brand" onClick={() => visitPlace("home")} aria-label="Go to home">
          <span className="brand-mark">PK</span>
          <span>
            <strong>{profile.name}</strong>
            <small>{profile.role}</small>
          </span>
        </button>

        <nav className="section-tabs" aria-label="Portfolio sections">
          {places.map((item) => (
            <button
              key={item.id}
              className={item.id === activePlace ? "active" : ""}
              onClick={() => visitPlace(item.id)}
            >
              {item.nav}
            </button>
          ))}
        </nav>

        <div className="control-strip" aria-label="Scene controls">
          <button
            className={isPlaying ? "active" : ""}
            onClick={() => setIsPlaying((value) => !value)}
            aria-label={isPlaying ? controlLabels.sound[1] : controlLabels.sound[0]}
            title={isPlaying ? controlLabels.sound[1] : controlLabels.sound[0]}
          >
            {isPlaying ? "On" : "Sound"}
          </button>
          <button
            className={isRaining ? "active" : ""}
            onClick={() => setIsRaining((value) => !value)}
            aria-label={isRaining ? controlLabels.rain[1] : controlLabels.rain[0]}
            title={isRaining ? controlLabels.rain[1] : controlLabels.rain[0]}
          >
            Rain
          </button>
          <button
            className={isNight ? "active" : ""}
            onClick={() => setIsNight((value) => !value)}
            aria-label={isNight ? controlLabels.night[1] : controlLabels.night[0]}
            title={isNight ? controlLabels.night[1] : controlLabels.night[0]}
          >
            Night
          </button>
        </div>
      </header>

      <section className="hero-panel panel">
        <p className="eyebrow">{profile.specialty}</p>
        <h1>{profile.name}</h1>
        <p>{profile.summary}</p>
        <div className="hero-badges" aria-label="Profile highlights">
          {profile.highlights.map((highlight) => (
            <span key={highlight}>{highlight}</span>
          ))}
        </div>
        <div className="hero-actions">
          <button className="primary-action" onClick={() => visitPlace("projects")}>View Work</button>
          <button className="ghost-action" onClick={() => setLetterOpen(true)}>Contact Me</button>
        </div>
        <div className="stat-row">
          {profile.stats.map(([value, label]) => (
            <article key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
      </section>

      <aside className="detail-panel panel" aria-live="polite">
        <p className="panel-kicker">{place.kicker}</p>
        <h2>{place.title}</h2>
        <p>{place.copy}</p>

        <div className="panel-grid">
          {place.items.map((item) => (
            <article key={item} className="panel-item">{item}</article>
          ))}
        </div>

        {activePlace === "projects" && (
          <div className="project-stack">
            {featuredProjects.map((project) => (
              <article className="project-card" key={project.title}>
                {project.image ? (
                  <img src={project.image} alt={`${project.title} project screenshot`} />
                ) : (
                  <div className="project-thumb" aria-hidden="true">
                    <strong>{project.title.slice(0, 2).toUpperCase()}</strong>
                  </div>
                )}
                <div>
                  <span>{project.type}</span>
                  <h3>{project.title}</h3>
                  {project.period && <small className="project-period">{project.period}</small>}
                  <p>{project.copy}</p>
                  <div className="chip-row">
                    {project.stack.map((tech) => <small key={tech}>{tech}</small>)}
                  </div>
                  {project.links?.length > 0 && (
                    <div className="project-links">
                      {project.links.map(([label, href]) => (
                        <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {activePlace === "skills" && (
          <div className="skill-list">
            {skillGroups.map(([label, value]) => (
              <article key={label}>
                <strong>{label}</strong>
                <span>{value}</span>
              </article>
            ))}
          </div>
        )}

        <div className="panel-links">
          {place.links?.map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>
          ))}
          {place.hasLetter && (
            <button className="primary-action" onClick={() => setLetterOpen(true)}>Write Letter</button>
          )}
        </div>
      </aside>

      <div className="wayfinder panel" aria-label="Island map">
        <div className="wayfinder-head">
          <span>Island Map</span>
          <strong>{place.kicker}</strong>
        </div>
        <div className="wayfinder-route">
          {places.map((item, index) => (
            <button
              key={item.id}
              className={item.id === activePlace ? "active" : ""}
              style={{ "--dot-color": item.color }}
              onClick={() => visitPlace(item.id)}
              aria-label={item.nav}
              title={item.title}
            >
              <span className="route-index">{index + 1}</span>
              <span className="route-copy">
                <strong>{item.nav}</strong>
                <small>{item.kicker}</small>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className={`toast panel ${toast ? "visible" : ""}`}>{toast}</div>

      {letterOpen && (
        <form
          className="letter-form panel"
          action="https://formsubmit.co/priyankakhasa937@gmail.com"
          method="POST"
        >
          <button type="button" className="panel-close" onClick={() => setLetterOpen(false)} aria-label="Close">x</button>
          <input type="hidden" name="_subject" value="New message from Priyanka portfolio" />
          <input type="hidden" name="_template" value="table" />
          <p className="panel-kicker">Contact</p>
          <h2>Send a message</h2>
          <label>
            Your Name
            <input name="name" required />
          </label>
          <label>
            Your Email
            <input name="email" type="email" required />
          </label>
          <label>
            Message
            <textarea name="message" rows="4" required />
          </label>
          <button className="primary-action" type="submit">Send Message</button>
        </form>
      )}
    </main>
  );
}

export default App;
