import Image from "next/image";
import Link from "next/link";

const CURATED_WORKS = [
  {
    slug: "ghostly-double",
    title: "Ghostly Double",
    tag: "music",
    image: "/photos/ghostly-double/ghostly-double.jpg",
  },
  {
    slug: "fire",
    title: "Fire",
    tag: "generative art",
    image: "/photos/fire/fire2.png",
  },
  {
    slug: "museum-of-dashes",
    title: "The Museum of Dashes",
    tag: "visual essay",
    image: "/photos/museum-of-dashes/hero.svg",
  },
  {
    slug: "frogmath",
    title: "FrogMath",
    tag: "interactive education",
    image: "/photos/frogmath/menu.jpg",
  },
];

export default function StartHere() {
  return (
    <section className="pt-6 pb-12 sm:pt-8 sm:pb-16">
      <h2 className="font-display text-lg sm:text-xl font-semibold text-ink-900 mb-6">
        Featured Work
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {CURATED_WORKS.map((work) => (
          <Link
            key={work.slug}
            href={`/work/${work.slug}`}
            className="group block rounded-lg overflow-hidden"
          >
            <div className="aspect-[4/3] relative bg-neutral-100">
              <Image
                src={work.image}
                alt={work.title}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 400px"
              />
            </div>
            <div className="pt-2.5 pb-1">
              <h3 className="font-display font-semibold text-sm sm:text-base text-ink-900 group-hover:text-[#8b4049] transition-colors">
                {work.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-ink-500 mt-0.5 uppercase tracking-wide">
                {work.tag}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
