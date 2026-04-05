const randomProut = (): string => "pro" + "u".repeat(Math.ceil(Math.random() * 3)) + "t";

export function generateProutContent(delay: number): string {
  const count = Math.min(6, Math.max(1, Math.round((delay - 500) / 500) + 1));
  return Array.from({ length: count }, randomProut).join(" ");
}
