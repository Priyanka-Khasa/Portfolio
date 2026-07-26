import { useState } from "react";
import { FiGithub, FiLinkedin, FiMail, FiSend } from "react-icons/fi";
import { aboutData, imageSizes } from "../data/portfolio";
import "./styles/Contact.css";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const fallbackSubject = encodeURIComponent(`Portfolio message from ${form.name || "a visitor"}`);
  const fallbackBody = encodeURIComponent(
    `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
  );
  const fallbackMailto = `mailto:${aboutData.email}?subject=${fallbackSubject}&body=${fallbackBody}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${aboutData.email}`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `Portfolio message from ${form.name}`,
          _template: "table",
          _captcha: "false",
        }),
      });

      if (!response.ok) {
        throw new Error("Message service rejected the request.");
      }

      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    } catch {
      setError("I couldn't send this automatically. You can open your email app with the same message ready to send.");
    } finally {
      window.clearTimeout(timeout);
      setSending(false);
    }
  };

  return (
    <section className="contact section" id="contact">
      <div className="section-inner">
        <div className="contact-left fade-left">
          <div className="contact-photo-wrap">
            <img
              src="/images/image4.jpeg"
              alt="Priyanka Khasa"
              className="contact-photo"
              width={imageSizes["/images/image4.jpeg"].width}
              height={imageSizes["/images/image4.jpeg"].height}
              loading="lazy"
              decoding="async"
            />
            <div className="contact-photo-glow" />
          </div>

          <div className="section-tag">Get in Touch</div>
          <h2 className="section-heading">
            Let's <span className="gradient-text">Talk</span>
          </h2>
          <p className="contact-bio">
            Have an internship, collaboration, AI idea, Android product, or web app in mind? Send the note. I like ambitious builds.
          </p>

          <div className="contact-links">
            <a href={`mailto:${aboutData.email}`} className="contact-link-item">
              <FiMail />
              <span>{aboutData.email}</span>
            </a>
            <a
              href="https://github.com/Priyanka-Khasa"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link-item"
            >
              <FiGithub />
              <span>github.com/Priyanka-Khasa</span>
            </a>
            <a
              href="https://linkedin.com/in/priyanka-khasa"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link-item"
            >
              <FiLinkedin />
              <span>linkedin.com/in/priyanka-khasa</span>
            </a>
          </div>
        </div>

        <div className="contact-right fade-right">
          {sent ? (
            <div className="contact-success">
              <span className="success-icon">OK</span>
              <h3>Message sent!</h3>
              <p>Thank you for reaching out. I'll be in touch soon.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Tell me about your project..."
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
              </div>
              {error && (
                <p className="form-error" role="alert">
                  {error} <a href={fallbackMailto}>Open email app</a>
                </p>
              )}
              <button type="submit" className="form-submit" disabled={sending}>
                <FiSend />
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
