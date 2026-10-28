import Link from "next/link";
import { OFFERS, OFFERS_LABEL } from "@/lib/offers";

/**
 * Homepage row of what a visitor can hire or book, under "See all work".
 * Stacked on phones, three across from sm up. Each whole card is the link (a big tap
 * target); its last line looks like a text link. Wording and order live in lib/offers.ts.
 */
export default function WorkWithMe() {
  return (
    <section id="work-with-me" className="work-with-me pb-12" aria-labelledby="work-with-me-heading">
      <h2
        id="work-with-me-heading"
        className="mb-3 text-[11px] uppercase tracking-wide text-ink-500 sm:text-xs"
      >
        {OFFERS_LABEL}
      </h2>
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {Object.values(OFFERS).map((offer) => (
          <Link
            key={offer.title}
            href={offer.href}
            className="offer group flex flex-col gap-2 rounded-lg border border-line bg-card p-5 transition-colors hover:border-ink-300"
          >
            <h3 className="font-display text-base font-semibold text-ink-900">{offer.title}</h3>
            <p className="text-base leading-snug text-ink-700">{offer.line}</p>
            <span className="text-link mt-auto pt-2 text-base group-hover:text-coral">
              {offer.cta} &rarr;
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
