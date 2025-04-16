// components/media-section.tsx
export default function MediaSection({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
    return (
      <section className={`not-prose mb-12 ${className}`}>
        <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        <div className="space-y-8">{children}</div>
      </section>
    );
  }
  