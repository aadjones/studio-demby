import { Metadata } from "next";
import { getProjectsByCategory } from "@/lib/content/projects-loader";
import { categories } from "@/app/components/utils/categories";
import CategoryProjectList from "@/app/components/CategoryProjectList";
import { metaData } from "@/app/config";

type Props = {
  params: {
    category: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryMeta = categories.find((c) => c.slug === params.category);

  if (!categoryMeta) {
    return {
      title: "Category Not Found",
    };
  }

  const { name, description, image } = categoryMeta;
  const ogImage = image || metaData.ogImage;
  const categoryUrl = `${metaData.baseUrl}${params.category}`;

  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      url: categoryUrl,
      siteName: metaData.name,
      images: [
        {
          url: ogImage,
          alt: name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Studio Demby`,
      description,
      images: [ogImage],
    },
  };
}

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

      <CategoryProjectList projects={projects} />
    </main>
  );
}
