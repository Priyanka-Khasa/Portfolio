import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import "./styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-logo">
          <span className="footer-logo-pk">PK</span>
          <span className="footer-logo-dot">.</span>
        </div>
        <p className="footer-copy">
          Designed & built with ♥ by Priyanka Khasa © {new Date().getFullYear()}
        </p>
        <div className="footer-socials">
          <a href="https://github.com/Priyanka-Khasa" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FiGithub />
          </a>
          <a href="https://linkedin.com/in/priyanka-khasa" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FiLinkedin />
          </a>
          <a href="https://twitter.com/priyankakhasa" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FiTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
}
