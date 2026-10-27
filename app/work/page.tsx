import { Metadata } from "next";
import WorkIndex from "@/app/components/WorkIndex";
import { DEFAULT_WORK_FILTER } from "@/app/components/utils/categories";
import { metaData } from "@/app/config";

export const metadata: Metadata = {
  title: "Work",
  description: "All projects, tools, writing, and teaching by Studio Demby.",
  alternates: {
    canonical: `${metaData.baseUrl}work`,
  },
};

// /work?category=… is served by ./by-category/[category] via a rewrite in next.config.js.
export default function WorkPage() {
  return <WorkIndex initialFilter={DEFAULT_WORK_FILTER} />;
}
