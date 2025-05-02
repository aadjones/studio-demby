export default function HeroTitleBlock({
    title,
    subtitle,
    subtext,
  }: {
    title: string;
    subtitle?: string;
    subtext?: string;
  }) {
    return (
      <section className="text-center my-8 sm:my-12">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="italic text-base sm:text-lg text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        )}
        {subtext && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-2">
            {subtext}
          </p>
        )}
      </section>
    );
  }
  