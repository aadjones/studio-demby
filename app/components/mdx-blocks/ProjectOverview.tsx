export default function ProjectOverview({
  children,
  centered = false,
  header = 'Overview',
}: {
  children: React.ReactNode;
  centered?: boolean;
  header?: string | null;
}) {
  return (
    <section className="my-8 sm:my-12">
      {header && (
        <h2 className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 ${centered ? "text-center" : ""}`}>
          {header}
        </h2>
      )}
      <div className="text-base sm:text-lg leading-relaxed space-y-4 sm:space-y-6 text-zinc-800 dark:text-zinc-200">
        {children}
      </div>
    </section>
  );
}
