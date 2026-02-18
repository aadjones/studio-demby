// app/page.tsx
import BloodFeathersHero from "@/app/components/hero/BloodFeathersHero";
import StartHere from "@/app/components/StartHere";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <BloodFeathersHero />
      <StartHere />
      <div className="text-center pb-12">
        <Link
          href="/work"
          className="inline-block px-6 py-3 text-sm font-body font-medium text-ink-700 border border-ink-300 rounded-full hover:bg-ink-100 transition-colors"
        >
          See all work &rarr;
        </Link>
      </div>
    </>
  );
}
