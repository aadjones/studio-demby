// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { categories } from "@/app/components/utils/categories";
import Door from "@/app/components/Door";
import RandomProjectButton from "@/app/components/RandomProjectButton";
import LatestActivity from "@/app/components/LatestActivity";
import { getRecentActivity } from "@/lib/content/activity-loader";
import { getAllProjects } from "@/lib/content/projects-loader";
import { StreamItem } from "@/types/mdx";
import { featureFlags } from "@/app/config/features";

export default async function HomePage() {
  // Load recent activity items only
  const recentActivity = await getRecentActivity(10);

  // Load all projects for random button
  const allProjects = await getAllProjects();
  const projectSlugs = allProjects.map(p => p.slug);

  // Format as stream items
  const streamItems: StreamItem[] = recentActivity.map(a => ({
    type: 'sketch' as const,
    data: a
  }));
  return (
    <main className="container mx-auto px-4 pt-6 sm:pt-8">
      {featureFlags.showCatsLogo ? (
        <div className="flex items-center gap-4 mb-4">
          <Image
            src="/photos/logo/shrimpas.png"
            alt="Studio Demby Logo"
            width={80}
            height={80}
            className="h-12 sm:h-16 md:h-20 opacity-80"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            Studio Demby
          </h1>
        </div>
      ) : (
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
          Studio Demby
        </h1>
      )}
      <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 leading-relaxed">
        I make things that sound, analyze, provoke, and teach.
      </p>

      {/* Latest Activity */}
      <LatestActivity items={streamItems} />

      {/* Featured Section */}
      <section className="mt-12 sm:mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
          Featured
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12 justify-items-center mx-auto">
          {categories.map((category, i) => (
            <Door
              key={category.name}
              name={category.name}
              description={category.description}
              href={category.href}
              image={category.image}
              delay={i * 0.12}
            />
          ))}
        </div>
      </section>
      <div className="mb-2" />
      <RandomProjectButton slugs={projectSlugs} />
    </main>
  );
}
