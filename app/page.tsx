// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { clusters } from "@/app/components/utils/clusters";
import Door from "@/app/components/Door";
import RandomProjectButton from "@/app/components/RandomProjectButton";

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 pt-1 sm:pt-2">
      {/* <h1 className="text-[1.75rem] sm:text-[2.5rem] md:text-4xl font-bold mb-2 leading-[1.15] tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
        Aaron Demby Jones
      </h1>
      <p className="text-[0.85rem] sm:text-lg md:text-xl mb-6 sm:mb-8 leading-[1.2] tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
        Artist. Improviser. Builder of strange systems.
      </p> */}

      <h2 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-center">Choose Your Door</h2>
      <p className="text-center mb-2 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
      </p>
      <div className="grid grid-cols-2 gap-x-10 gap-y-10 justify-items-center mx-auto">
        {clusters.map((cluster, i) => (
          <Door
            key={cluster.name}
            name={cluster.name}
            description={cluster.description}
            href={cluster.href}
            image={cluster.image}
            delay={i * 0.12}
          />
        ))}
      </div>
      <div className="mb-2" />
      <RandomProjectButton />
    </main>
  );
}
