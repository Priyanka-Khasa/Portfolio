import { useEffect, useState } from "react";
import { navLinks } from "../data/portfolio";
import "./styles/Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-inner">
        <a className="navbar-logo" href="/" aria-label="Priyanka Khasa home">
          <span className="logo-pk">PK</span>
          <span className="logo-dot">.</span>
        </a>

        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.label}>
              <button
                className="nav-link"
                onClick={() => handleNav(link.href)}
              >
                {link.label}
                <span className="nav-link-line" />
              </button>
            </li>
          ))}
        </ul>

        <button
          className="navbar-hire"
          onClick={() => handleNav("#contact")}
        >
          Hire Me
        </button>

        <button
          className={`navbar-burger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`navbar-mobile ${menuOpen ? "open" : ""}`} id="mobile-navigation">
        {navLinks.map((link) => (
          <button
            key={link.label}
            className="mobile-nav-link"
            onClick={() => handleNav(link.href)}
          >
            {link.label}
          </button>
        ))}
        <button
          className="mobile-hire"
          onClick={() => handleNav("#contact")}
        >
          Hire Me
        </button>
      </div>
    </nav>
  );
}
