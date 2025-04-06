// app/[cluster]/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjects } from "@/lib/projects_mdx";
import Image from "next/image";
import ClientMDX from "@/app/components/ClientMDX";
import ErrorBoundary from "@/app/components/ErrorBoundary";

type PageProps = {
  params: Promise<{ cluster: string, slug: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { cluster, slug } = await params;
  const projectData = await getProjectBySlug(cluster, slug);
  if (!projectData) return notFound();

  const { mdxSource, frontMatter } = projectData;
  console.log(`[ProjectDetailPage] slug: ${slug}, frontMatter:`, frontMatter);
  console.log(`[ProjectDetailPage] mdxSource:`, mdxSource);

  return (
    <div className="container mx-auto px-4 py-8">
      {frontMatter.image && (
        <Image src={frontMatter.image} alt={frontMatter.title} width={800} height={600} className="object-cover" />
      )}
      <ErrorBoundary>
        <ClientMDX mdxSource={mdxSource} />
      </ErrorBoundary>
    </div>
  );
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({ 
    cluster: project.cluster,
    slug: project.slug 
  }));
}