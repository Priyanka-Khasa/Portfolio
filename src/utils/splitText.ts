import gsap from "gsap";

export function splitTextIntoSpans(
  selector: string,
  className = "char"
): void {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  elements.forEach((el) => {
    const text = el.textContent ?? "";
    el.innerHTML = text
      .split("")
      .map((ch) =>
        ch === " "
          ? `<span class="${className}-space"> </span>`
          : `<span class="${className}">${ch}</span>`
      )
      .join("");
  });
}

export function animateCharsIn(selector: string, delay = 0): void {
  const chars = document.querySelectorAll<HTMLElement>(`${selector} .char`);
  gsap.fromTo(
    chars,
    { y: "110%", opacity: 0 },
    {
      y: "0%",
      opacity: 1,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.03,
      delay,
    }
  );
}
