import React from "react";
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiMail } from "react-icons/fi";
import { socialLinks } from "../data/portfolio";
import "./styles/SocialIcons.css";

const iconMap: Record<string, React.ReactElement> = {
  github: <FiGithub />,
  linkedin: <FiLinkedin />,
  twitter: <FiTwitter />,
  instagram: <FiInstagram />,
  mail: <FiMail />,
};

export default function SocialIcons() {
  return (
    <div className="social-icons">
      {socialLinks.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon-link"
          aria-label={link.label}
          title={link.label}
        >
          {iconMap[link.icon] ?? <FiGithub />}
        </a>
      ))}
      <div className="social-line" />
    </div>
  );
}
