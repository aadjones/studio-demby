export default function ProjectOverview({
  children,
  centered = false,
}: {
  children: React.ReactNode;
  centered?: boolean;
}) {
  return (
    <section className="mb-12">
      <h2 className={`text-2xl font-semibold mb-4 ${centered ? "text-center" : ""}`}>
        Overview
      </h2>
      <div className="text-lg leading-relaxed">
        {children}
      </div>
    </section>
  );
}
