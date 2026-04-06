import { RECIPES } from "./recipes";
import { CHARACTERS } from "./characters";
import { PRODUCTS } from "./products";

const ALL_ENTRIES = [...RECIPES, ...CHARACTERS, ...PRODUCTS];

const CHOUX_MENU = `# 🥬 Recettes à base de choux

Je peux vous proposer plusieurs recettes à base de choux. Cliquez sur celle qui vous fait envie :

- [Choucroute garnie alsacienne](recipe:choucroute%20garnie)
- [Chou farci à la grand-mère](recipe:chou%20farci)
- [Gratin de chou-fleur à la béchamel](recipe:gratin%20de%20chou-fleur)
- [Potée auvergnate au chou vert](recipe:pot%C3%A9e%20auvergnate)
- [Soupe aux choux](recipe:soupe%20aux%20choux)`;

export function findRecipe(prompt: string): string | null {
  const lower = prompt.toLowerCase();
  for (const entry of ALL_ENTRIES) {
    if (entry.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      const [title, ...rest] = entry.content.split("\n");
      return `${title}\n\n![illustration](${entry.imageUrl})\n\n${rest.join("\n")}`;
    }
  }
  if (lower.includes("chou")) return CHOUX_MENU;
  return null;
}
