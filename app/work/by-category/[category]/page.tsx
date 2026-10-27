import { Metadata } from "next";
import WorkIndex from "@/app/components/WorkIndex";
import { categories } from "@/app/components/utils/categories";
import { metaData } from "@/app/config";

/**
 * /work with a category already selected, prebuilt for each category.
 *
 * Visitors never see this URL: next.config.js rewrites /work?category=<slug>
 * here, so a shared link like /work?category=visual-art arrives with the right
 * cards in the HTML instead of showing Music until JavaScript loads. Any other
 * ?category= value is rendered on demand.
 */
export function generateStaticParams() {
  return [...categories.map((c) => ({ category: c.slug })), { category: "all" }];
}

export const metadata: Metadata = {
  title: "Work",
  description: "All projects, tools, writing, and teaching by Studio Demby.",
  alternates: {
    canonical: `${metaData.baseUrl}work`,
  },
};

export default function WorkByCategoryPage({ params }: { params: { category: string } }) {
  return <WorkIndex initialFilter={params.category} />;
}
