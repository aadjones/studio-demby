// app/page.tsx
import BloodFeathersHero from "@/app/components/hero/BloodFeathersHeroClient";
import StartHere from "@/app/components/StartHere";
import WorkWithMe from "@/app/components/WorkWithMe";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <BloodFeathersHero />
      <StartHere />
      <WorkWithMe />
      <div className="text-center pb-12">
        <Link
          href="/work"
          className="inline-block px-6 py-3 text-sm font-body font-medium text-ink-700 border border-ink-300 rounded-full hover:bg-subtle transition-colors"
        >
          See all work &rarr;
        </Link>
      </div>
    </>
  );
}
