// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { categories } from "@/app/components/utils/categories";
import Door from "@/app/components/Door";
import RandomProjectButton from "@/app/components/RandomProjectButton";
import LatestActivity from "@/app/components/LatestActivity";
import { getRecentActivity } from "@/lib/content/activity-loader";
import { StreamItem } from "@/types/mdx";

export default async function HomePage() {
  // Load recent activity items only
  const recentActivity = await getRecentActivity(10);

  // Format as stream items
  const streamItems: StreamItem[] = recentActivity.map(a => ({
    type: 'sketch' as const,
    data: a
  }));
  return (
    <main className="container mx-auto px-4 pt-1 sm:pt-2">
      <h1 className="text-[1.75rem] sm:text-[2.5rem] md:text-4xl font-bold mb-2 leading-[1.15] tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
        Aaron Demby Jones
      </h1>
      <p className="text-[0.85rem] sm:text-lg md:text-xl mb-6 sm:mb-8 leading-[1.2] tracking-tight sm:whitespace-nowrap sm:overflow-hidden sm:text-ellipsis">
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
      <RandomProjectButton />
    </main>
  );
}
