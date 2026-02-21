const FLAVORS: Record<string, { line: string; label: string }> = {
  music: {
    line: "Looking for a performer, improviser, or collaborator?",
    label: "Get in touch",
  },
  art: {
    line: "Interested in a commission, print, or installation?",
    label: "Get in touch",
  },
  teaching: {
    line: "Interested in lessons, workshops, or custom tools?",
    label: "Get in touch",
  },
};

export default function CallToAction({
  flavor,
  showLessons,
}: {
  flavor?: string;
  showLessons?: boolean;
}) {
  const contactHref = flavor ? `/contact?inquiry=${flavor}` : "/contact";
  const config = flavor ? FLAVORS[flavor] : null;

  return (
    <section className="my-12 sm:my-16 py-8 sm:py-10 px-6 sm:px-8 bg-[#FFF8F0] border border-zinc-200 rounded text-center">
      {config && (
        <p className="text-base sm:text-lg italic text-zinc-600 mb-3 sm:mb-4">
          {config.line}
        </p>
      )}
      <a
        href={contactHref}
        className="inline-block px-5 sm:px-7 py-2 sm:py-2.5 text-sm sm:text-base font-medium bg-ink-900 !text-white no-underline rounded hover:bg-brand-coral transition-colors duration-200"
      >
        {config?.label || "Get in touch"} &rarr;
      </a>
      {showLessons && (
        <>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base italic text-zinc-500">
            Want to learn how to do this?
          </p>
          <a
            href="/teaching"
            className="mt-2 inline-block px-5 sm:px-7 py-2 sm:py-2.5 text-sm sm:text-base font-medium bg-ink-900 !text-white no-underline rounded hover:bg-brand-coral transition-colors duration-200"
          >
            I offer lessons &rarr;
          </a>
        </>
      )}
    </section>
  );
}
