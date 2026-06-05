export function splitChars(text: string): string {
  return text
    .split("")
    .map((ch) =>
      ch === " "
        ? `<span class="char-space"> </span>`
        : `<span class="char">${ch}</span>`
    )
    .join("");
}

export function splitWords(text: string): string {
  return text
    .split(" ")
    .map((word) => `<span class="word">${word}</span>`)
    .join(" ");
}
