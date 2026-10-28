/**
 * What a visitor can hire or book. One source for the homepage's offer row and the
 * end-of-project box (CallToAction), so their wording can't drift apart. Edit here.
 *
 * Order matters: the homepage shows them in this order. Lessons come first (the most
 * regular income). Performance and commissions are "working with" Aaron (the nav's
 * Work with me → Contact); lessons are their own thing (the nav's Lessons → /teaching).
 */
export const OFFERS = {
  lessons: {
    title: "Lessons",
    // From the lessons page's own subtitle.
    line: "Piano lessons emphasizing creativity and improvisation.",
    href: "/teaching",
    cta: "Try a $45 lesson",
  },
  music: {
    title: "Performance",
    line: "Looking for a performer, improviser, or collaborator?",
    href: "/contact?inquiry=music",
    cta: "Book a performance",
  },
  art: {
    title: "Commissions",
    line: "Interested in a commission, print, or installation?",
    href: "/contact?inquiry=art",
    cta: "Ask about a commission",
  },
} as const;

/** The small label above the homepage row. */
export const OFFERS_LABEL = "Hire or book";
