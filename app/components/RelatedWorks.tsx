import Link from "next/link";
import Image from "next/image";
import { MDXProject } from "@/types/mdx";

type Props = {
  projects: MDXProject[];
};

export default function RelatedWorks({ projects }: Props) {
  if (projects.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-semibold mb-6">Related Works</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group"
          >
            {project.image && (
              <div className="aspect-square relative rounded-lg overflow-hidden mb-2">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <h3 className="text-sm font-medium leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
