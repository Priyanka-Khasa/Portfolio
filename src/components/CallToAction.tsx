import "./styles/CallToAction.css";

export default function CallToAction() {
  return (
    <section className="cta-section">
      <div className="cta-glow-1" />
      <div className="cta-glow-2" />
      <div className="cta-inner scale-in">
        <span className="cta-eyebrow">
          <span className="eyebrow-dot" />
          Open to opportunities
        </span>
        <h2 className="cta-heading">
          Have an idea? Let's build<br />
          something <span className="gradient-text">incredible</span>.
        </h2>
        <p className="cta-body">
          Whether it's a new product, a redesign, or just a conversation — I'm all ears.
          Let's create something that matters.
        </p>
        <div className="cta-actions">
          <a
            href="mailto:priyankakhasa@gmail.com"
            className="cta-btn-primary"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 5l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Send me a message
          </a>
          <button
            className="cta-btn-ghost"
            onClick={() => document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" })}
          >
            View my work first →
          </button>
        </div>
      </div>
    </section>
  );
}
