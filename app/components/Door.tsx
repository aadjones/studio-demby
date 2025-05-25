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
        className="group w-full max-w-[380px] aspect-[4/3] rounded-2xl bg-white/80 dark:bg-zinc-900/80 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-400 transition flex flex-col items-center justify-between p-3 sm:p-4 gap-1"
        tabIndex={0}
        aria-label={`Enter the ${name} cluster`}
      >
        {/* Top: Cluster Name */}
        <div className="w-full text-center text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1 mt-1 truncate">
          {name}
        </div>
        {/* Middle: Art */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-[90%] h-[90%] rounded-xl overflow-hidden shadow-md bg-zinc-200 dark:bg-zinc-800 transition-transform group-hover:scale-105 group-focus:scale-105">
              <Image
                src={image}
                alt={name}
                width={300}
                height={225}
                className="object-cover object-center w-full h-full transition-transform duration-700"
                priority={false}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        {/* Bottom: Subtitle */}
        <div className="w-full text-center text-sm text-zinc-600 dark:text-zinc-300 font-medium mt-1 mb-1 truncate">
          {description}
        </div>
      </Link>
    </motion.div>
  );
};

export default Door; 