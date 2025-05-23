// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { clusters } from "@/app/components/utils/clusters";
import Door from "@/app/components/Door";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 pt-4 sm:pt-8">
      <h1 className="text-[1.75rem] sm:text-[2.5rem] md:text-4xl font-bold mb-2 leading-[1.15] tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
        Aaron Demby Jones
      </h1>
      <p className="text-[0.85rem] sm:text-lg md:text-xl mb-6 sm:mb-8 leading-[1.2] tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
        Artist. Improviser. Builder of strange systems.
      </p>

      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-center">Choose Your Door</h2>
      <p className="text-center mb-8 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
        Each door leads to a different world of work. Where will you go?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10 justify-items-center">
        {clusters.map((cluster) => (
          <Door
            key={cluster.name}
            name={cluster.name}
            description={cluster.description}
            href={cluster.href}
            image={cluster.image}
          />
        ))}
      </div>
    </main>
  );
}
