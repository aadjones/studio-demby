export default function MediaSection({
  title,
  children,
  className = "",
  centered = false,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}) {
  return (
    <section className={`not-prose mb-12 ${className}`}>
      <h2 className={`text-2xl font-semibold mb-6 ${centered ? "text-center" : ""}`}>
        {title}
      </h2>
      <div className="space-y-8">{children}</div>
    </section>
  );
}
