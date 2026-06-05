import { useState } from "react";
import { FiGithub, FiLinkedin, FiMail, FiSend } from "react-icons/fi";
import { aboutData } from "../data/portfolio";
import "./styles/Contact.css";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className="contact section" id="contact">
      <div className="section-inner">
        <div className="contact-left fade-left">
          <div className="contact-photo-wrap">
            <img src="/images/main6.png" alt="Priyanka Khasa" className="contact-photo" />
            <div className="contact-photo-glow" />
          </div>

          <div className="section-tag">Get in Touch</div>
          <h2 className="section-heading">
            Let's <span className="gradient-text">Talk</span>
          </h2>
          <p className="contact-bio">
            Whether you have a project in mind, want to collaborate, or just say hello —
            my inbox is always open.
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
              <span className="success-icon">✓</span>
              <h3>Message sent!</h3>
              <p>Thank you for reaching out. I'll be in touch soon.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  placeholder="Tell me about your project..."
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
              </div>
              <button type="submit" className="form-submit">
                <FiSend />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
