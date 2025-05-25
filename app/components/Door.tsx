"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useClusterTextEffect } from "@/app/components/utils/useClusterTextEffect";
import { motion } from "framer-motion";

interface DoorProps {
  name: string;
  description: string;
  href: string;
  image: string;
  delay?: number;
}

const Door: React.FC<DoorProps> = ({ name, description, href, image, delay = 0 }) => {
  // Use the cluster name in lowercase for consistency
  const cluster = name.toLowerCase();
  const textEffect = useClusterTextEffect(cluster, name, description);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      <Link
        href={href}
        className="group w-full max-w-[340px] rounded-2xl bg-white/80 dark:bg-zinc-900/80 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-400 transition p-5 flex flex-col items-center justify-between min-h-[340px] h-full"
        tabIndex={0}
        aria-label={`Enter the ${name} cluster`}
      >
        {/* Top: Cluster Name */}
        <div className="w-full text-center mb-3">
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{name}</span>
        </div>
        {/* Middle: Art */}
        <div className="flex items-center justify-center w-full">
          <div className="rounded-xl overflow-hidden shadow-md bg-zinc-200 dark:bg-zinc-800 w-[180px] aspect-[4/3] flex items-center justify-center transition-transform group-hover:scale-105 group-focus:scale-105">
            <Image
              src={image}
              alt={name}
              width={180}
              height={135}
              className="object-cover object-center transition-transform duration-700"
              priority={false}
              aria-hidden="true"
            />
          </div>
        </div>
        {/* Bottom: Subtitle */}
        <div className="w-full text-center mt-3">
          <span className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">{description}</span>
        </div>
      </Link>
    </motion.div>
  );
};

export default Door; 