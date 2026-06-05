import { useEffect, useRef } from "react";
import "./styles/Cursor.css";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const handleEnterLink = () => {
      ringRef.current?.classList.add("cursor-hover");
      dotRef.current?.classList.add("cursor-hover");
    };
    const handleLeaveLink = () => {
      ringRef.current?.classList.remove("cursor-hover");
      dotRef.current?.classList.remove("cursor-hover");
    };

    document.addEventListener("mousemove", handleMove);

    let raf: number;
    const animateRing = () => {
      ringPos.current.x += (posRef.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (posRef.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      raf = requestAnimationFrame(animateRing);
    };
    raf = requestAnimationFrame(animateRing);

    const links = document.querySelectorAll("a, button, [data-cursor-hover]");
    links.forEach((el) => {
      el.addEventListener("mouseenter", handleEnterLink);
      el.addEventListener("mouseleave", handleLeaveLink);
    });

    return () => {
      document.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
