import Link from "next/link";
import { OFFERS } from "@/lib/offers";

/**
 * Homepage row of what a visitor can hire or book: performance, commissions, lessons.
 * Stacked on phones, three across from sm up. Wording lives in lib/offers.ts.
 */
export default function WorkWithMe() {
  return (
    <section id="work-with-me" className="work-with-me pb-12" aria-labelledby="work-with-me-heading">
      <h2 id="work-with-me-heading" className="sr-only">
        Hire me or book lessons
      </h2>
      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {Object.values(OFFERS).map((offer) => (
          <div key={offer.title} className="offer flex flex-col gap-2 rounded-lg border border-line bg-card p-5">
            <h3 className="font-display text-base font-semibold text-ink-900">{offer.title}</h3>
            <p className="text-base leading-snug text-ink-700">{offer.line}</p>
            <Link href={offer.href} className="text-link mt-auto pt-2 text-sm">
              {offer.cta} &rarr;
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
