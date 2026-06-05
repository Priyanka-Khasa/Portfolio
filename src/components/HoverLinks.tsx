import { useRef } from "react";

interface HoverLinksProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  target?: string;
}

export default function HoverLinks({
  href,
  className = "",
  children,
  target,
}: HoverLinksProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    ref.current?.classList.add("hovered");
  };

  const handleMouseLeave = () => {
    ref.current?.classList.remove("hovered");
  };

  return (
    <a
      ref={ref}
      href={href}
      className={`hover-link ${className}`}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </a>
  );
}
