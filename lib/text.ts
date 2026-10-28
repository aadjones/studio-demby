/**
 * A title without emoji, for places where emoji are noise: browser tabs, social cards,
 * search results. Page headings and cards keep them ("Ghostly Double 🎵🎬" on the page,
 * "Ghostly Double | Studio Demby" in the tab).
 */
export function withoutEmoji(title: string): string {
  return title
    .replace(/\p{Extended_Pictographic}|\p{Emoji_Modifier}|\uFE0F|\u200D/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}
