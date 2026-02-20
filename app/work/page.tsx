import { Suspense } from "react";
import { Metadata } from "next";
import { getAllWork } from "@/lib/content/unified-loader";
import WorkGrid from "@/app/components/WorkGrid";

export const metadata: Metadata = {
  title: "Work",
  description: "All projects, tools, writing, and teaching by Studio Demby.",
};

export default async function WorkPage() {
  const items = await getAllWork();

  return (
    <main className="px-4 py-6 sm:py-8 pb-0">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-2">
        Work
      </h1>
      <p className="text-base sm:text-lg font-body italic text-zinc-500 mb-8">
        Browse by category
      </p>

      <Suspense>
        <WorkGrid items={items} />
      </Suspense>
    </main>
  );
}
