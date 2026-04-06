import { RECIPES } from "./recipes";
import { CHARACTERS } from "./characters";
import { PRODUCTS } from "./products";

const ALL_ENTRIES = [...RECIPES, ...CHARACTERS, ...PRODUCTS];

export function findRecipe(prompt: string): string | null {
  const lower = prompt.toLowerCase();
  for (const entry of ALL_ENTRIES) {
    if (entry.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      const [title, ...rest] = entry.content.split("\n");
      return `${title}\n\n![illustration](${entry.imageUrl})\n\n${rest.join("\n")}`;
    }
  }
  return null;
}
