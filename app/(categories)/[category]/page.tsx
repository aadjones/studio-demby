import { getProjectsByCategory } from "@/lib/content/projects-loader";
import { categories } from "@/app/components/utils/categories";
import CategoryProjectList from "@/app/components/CategoryProjectList";
import Link from "next/link";

type Props = {
  params: {
    category: string;
  };
};

export async function generateStaticParams() {
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export default async function CategoryLandingPage({ params }: Props) {
  const { category } = params;

  const projects = await getProjectsByCategory(category);

  // Find category metadata
  const categoryMeta = categories.find((c) => c.slug === category);
  const categoryName = categoryMeta?.name || category;
  const description = categoryMeta?.description || "";

  return (
    <main className="px-4 py-6 sm:py-8 pb-0">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">{categoryName}</h1>
      <p className="text-base sm:text-lg italic mb-6 sm:mb-8 text-zinc-600">
        {description}
      </p>

      {/* Special banner for Practice category */}
      {category === "practice-pedagogy" && (
        <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800">
          <h2 className="text-xl font-semibold mb-2 text-blue-900 dark:text-blue-100">
            I also teach piano improvisation
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Break free from sheet music prison. Private lessons for classically-trained adults in San Diego.
          </p>
          <Link
            href="/teaching"
            className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Learn More →
          </Link>
        </div>
      )}

      <CategoryProjectList projects={projects} />
    </main>
  );
}
