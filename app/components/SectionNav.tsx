"use client";

export default function SectionNav() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="mt-6 mb-12 flex justify-center gap-6 text-sm font-medium text-zinc-600">
      {[
        { label: "Overview", id: "overview" },
        { label: "Control Panel", id: "control-panel" },
        { label: "Gallery", id: "gallery" },
      ].map(({ label, id }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className="hover:text-black transition-colors"
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
