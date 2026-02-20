const EMAIL = "aaron.demby.jones@gmail.com";

const FLAVORS: Record<string, { line: string; label: string }> = {
  music: {
    line: "Looking for a performer, improviser, or collaborator?",
    label: "Get in touch",
  },
  art: {
    line: "Interested in a commission, print, or installation?",
    label: "Get in touch",
  },
  tools: {
    line: "Need a custom tool or interactive experience built?",
    label: "Get in touch",
  },
  teaching: {
    line: "Interested in lessons, workshops, or curriculum design?",
    label: "Get in touch",
  },
};

export default function CallToAction({
  flavor,
  email,
  showLessons,
}: {
  flavor?: string;
  email?: string;
  showLessons?: boolean;
}) {
  const mailto = email || EMAIL;
  const config = flavor ? FLAVORS[flavor] : null;

  return (
    <section className="my-12 sm:my-16 py-6 sm:py-8 border-t border-b border-zinc-200 text-center">
      {config && (
        <p className="text-base sm:text-lg italic text-zinc-600 mb-3 sm:mb-4">
          {config.line}
        </p>
      )}
      <a
        href={`mailto:${mailto}`}
        className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base border border-zinc-400 text-zinc-600 rounded hover:bg-zinc-800 hover:text-white hover:border-zinc-800 transition duration-200"
      >
        {config?.label || "Get in touch"} &rarr;
      </a>
      {showLessons && (
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-zinc-500">
          Want to learn how to do this?{" "}
          <a
            href="/teaching"
            className="text-zinc-700 underline hover:text-zinc-900 transition-colors"
          >
            I offer lessons
          </a>
          .
        </p>
      )}
    </section>
  );
}
