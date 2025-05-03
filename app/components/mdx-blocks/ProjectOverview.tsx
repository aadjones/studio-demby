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
    <section className="my-6 sm:my-12">
      {header && (
        <h2 className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 ${centered ? "text-center" : ""}`}>
          {header}
        </h2>
      )}
      <div className="text-[17px] sm:text-lg leading-relaxed sm:leading-relaxed space-y-5 sm:space-y-6 text-zinc-800 dark:text-zinc-200 max-w-prose">
        {children}
      </div>
    </section>
  );
}
