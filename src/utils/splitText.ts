import gsap from "gsap";

export function splitTextIntoSpans(
  selector: string,
  className = "char"
): void {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  elements.forEach((el) => {
    const text = el.textContent ?? "";
    el.innerHTML = text
      .trim()
      .split(/\s+/)
      .map(
        (word) =>
          `<span class="word">${word
            .split("")
            .map((ch) => `<span class="${className}">${ch}</span>`)
            .join("")}</span>`
      )
      .join(`<span class="${className}-space" aria-hidden="true"> </span>`);
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
