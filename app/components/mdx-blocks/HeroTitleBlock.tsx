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
      <section className="text-center my-12">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        {subtitle && <p className="italic text-lg text-gray-600">{subtitle}</p>}
        {subtext && <p className="text-sm text-gray-500 mt-2">{subtext}</p>}
      </section>
    );
  }
  