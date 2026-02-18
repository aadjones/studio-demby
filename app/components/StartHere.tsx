import Image from "next/image";
import Link from "next/link";

const CURATED_WORKS = [
  {
    slug: "ghostly-double",
    title: "Ghostly Double",
    description: "Piano & electronics music video — call and response with a phantom.",
    image: "/photos/ghostly-double/ghostly-double.jpg",
  },
  {
    slug: "fire",
    title: "Fire",
    description: "Generative visual art — algorithmic bloom of opposition and collapse.",
    image: "/photos/fire/fire2.png",
  },
  {
    slug: "museum-of-dashes",
    title: "The Museum of Dashes",
    description: "Satirical writing — a curatorial study of horizontal connectors and their behavioral anomalies.",
    image: "/photos/museum-of-dashes/hero.svg",
  },
  {
    slug: "frogmath",
    title: "FrogMath",
    description: "Math education app — teaching number theory through frogs hopping on lily pads.",
    image: "/photos/frogmath/menu.jpg",
  },
];

export default function StartHere() {
  return (
    <section className="py-12 sm:py-16">
      <h2 className="text-2xl sm:text-3xl font-display font-bold mb-8 text-center text-ink-900">
        Start Here
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {CURATED_WORKS.map((work) => (
          <Link
            key={work.slug}
            href={`/work/${work.slug}`}
            className="group block rounded-lg overflow-hidden border border-ink-200/50 hover:border-ink-300 transition-colors"
          >
            <div className="aspect-[4/3] relative bg-ink-100">
              <Image
                src={work.image}
                alt={work.title}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 400px"
              />
            </div>
            <div className="p-3 sm:p-4">
              <h3 className="font-display font-semibold text-sm sm:text-base text-ink-900 group-hover:text-brand-coral transition-colors">
                {work.title}
              </h3>
              <p className="text-xs sm:text-sm text-ink-600 mt-1 line-clamp-2">
                {work.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
