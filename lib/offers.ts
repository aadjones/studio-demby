/**
 * What a visitor can hire or book. One source for the homepage's offer row and the
 * end-of-project box (CallToAction), so their wording can't drift apart.
 *
 * Performance and commissions are "working with" Aaron (the nav's Work with me → Contact);
 * lessons are their own thing (the nav's Lessons → /teaching).
 */
export const OFFERS = {
  music: {
    title: "Performance",
    line: "Looking for a performer, improviser, or collaborator?",
    href: "/contact?inquiry=music",
    cta: "Get in touch",
  },
  art: {
    title: "Commissions",
    line: "Interested in a commission, print, or installation?",
    href: "/contact?inquiry=art",
    cta: "Get in touch",
  },
  lessons: {
    title: "Lessons",
    // From the lessons page's own subtitle. Placeholder wording; the owner may edit.
    line: "Piano lessons emphasizing creativity and improvisation.",
    href: "/teaching",
    cta: "See lessons",
  },
} as const;
