const SYLLABLES = ["bi", "bu", "li", "lu", "bli", "blu", "bil", "bul", "lib", "lub", "ili", "ulu"];

const randomSyllable = (): string => SYLLABLES[Math.floor(Math.random() * SYLLABLES.length)];

const randomWord = (): string => {
  const syllableCount = 2 + Math.floor(Math.random() * 3); // 2–4 syllables
  return Array.from({ length: syllableCount }, randomSyllable).join("");
};

const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

const randomSentence = (): string => {
  const wordCount = 4 + Math.floor(Math.random() * 7); // 4–10 words
  const words = Array.from({ length: wordCount }, randomWord);
  // randomly insert commas after some words (not last)
  const withCommas = words.map((w, i) => {
    if (i > 0 && i < words.length - 1 && Math.random() < 0.25) return w + ",";
    return w;
  });
  return capitalize(withCommas.join(" ")) + ".";
};

export function generateBilibliContent(delay: number): string {
  const sentenceCount = 2 + Math.min(8, Math.round((delay - 500) / 400));
  const sentences = Array.from({ length: sentenceCount }, randomSentence);
  // group into paragraphs of 2–3 sentences
  const paragraphs: string[] = [];
  let i = 0;
  while (i < sentences.length) {
    const size = 2 + Math.floor(Math.random() * 2); // 2–3 sentences per paragraph
    paragraphs.push(sentences.slice(i, i + size).join(" "));
    i += size;
  }
  return paragraphs.join("\n\n");
}
