import { getAllWork } from "@/lib/content/unified-loader";
import WorkGrid from "@/app/components/WorkGrid";

/** The /work page body, rendered with a category already selected. */
export default async function WorkIndex({ initialFilter }: { initialFilter: string }) {
  const items = await getAllWork();

  return (
    <main className="px-4 py-6 sm:py-8 pb-0">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-2">
        Work
      </h1>
      <p className="text-base sm:text-lg font-body italic text-zinc-500 mb-8">
        Browse by category
      </p>

      <WorkGrid items={items} initialFilter={initialFilter} />
    </main>
  );
}
