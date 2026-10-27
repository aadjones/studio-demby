export default function HeroTitleBlock({
    title,
    subtitle,
    subtext,
    className = "",
  }: {
    title: string;
    subtitle?: string;
    subtext?: string;
    className?: string;
  }) {
    return (
      <section className={`text-center mt-2 mb-8 sm:mt-4 sm:mb-12 ${className}`.trim()}>
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 tracking-tight">{title}</h1>
        {subtitle && (
          // mt-[1.25em]: the gap prose used to add before not-prose reached this block.
          <p className="mt-[1.25em] italic text-base sm:text-lg text-ink-700">
            {subtitle}
          </p>
        )}
        {subtext && (
          <p className="text-xs sm:text-sm text-ink-500 mt-2">
            {subtext}
          </p>
        )}
      </section>
    );
  }
  