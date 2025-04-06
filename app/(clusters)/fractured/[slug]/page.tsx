import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/projects_mdx";
import ClientMDX from "@/app/components/ClientMDX";
import Image from "next/image";
import ProjectLayout from "@/app/components/ProjectLayout";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects
    .filter((p) => p.cluster === "fractured")
    .map((project) => ({
      slug: project.slug,
    }));
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProjectBySlug("fractured", params.slug);

  if (!project) {
    notFound();
  }

  return (
    <ProjectLayout>
      {project.frontMatter.image && (
        <Image
          src={project.frontMatter.image}
          alt={project.frontMatter.title}
          width={720}
          height={720}
          className="rounded-lg object-cover w-full max-w-[512px] mb-6"
          priority
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{project.frontMatter.title}</h1>
      <p className="italic text-zinc-600 mb-4">{project.frontMatter.summary}</p>
      <article className="prose dark:prose-invert prose-headings:mb-4 prose-p:mb-3 prose-img:my-4">
        <ClientMDX mdxSource={project.mdxSource} />
      </article>
    </ProjectLayout>
  );
}
