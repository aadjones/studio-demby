"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      <Link
        href={href}
        className="group w-full max-w-[380px] aspect-[4/3] rounded-2xl bg-zinc-100 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-400 transition flex flex-col items-center justify-between p-3 sm:p-4 gap-1"
        tabIndex={0}
        aria-label={`Enter the ${name} cluster`}
      >
        {/* Top: Cluster Name */}
        <div className="w-full text-center text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1 mt-1 truncate">
          <span className="relative inline-flex group-hover:text-blue-600 transition-all duration-150">
            {cluster === "fractured" ? (
              <>
                <span className="group-hover:opacity-0 transition-opacity duration-150">
                  {name}
                </span>
                <span className="absolute left-0 top-0 w-full flex items-center justify-center gap-[0.15em] group-hover:opacity-100 opacity-0 transition-opacity duration-150">
                  <span className="text-red-600">Frac</span>
                  <span className="text-red-600">|</span>
                  <span className="text-red-600">tured</span>
                </span>
              </>
            ) : cluster === "errant" ? (
              <>
                <span className="group-hover:opacity-0 transition-opacity duration-150">
                  {name}
                </span>
                <span className="absolute left-0 top-0 w-full flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity duration-150 group-hover:text-pink-600">
                  <span className="animate-pulse">E</span>
                  <span className="animate-bounce">r</span>
                  <span className="animate-pulse">r</span>
                  <span className="animate-bounce">a</span>
                  <span className="animate-pulse">n</span>
                  <span className="animate-bounce">t</span>
                </span>
              </>
            ) : cluster === "resonant" ? (
              <>
                <span className="group-hover:opacity-0 transition-opacity duration-150">
                  {name}
                </span>
                <span className="absolute left-0 top-0 w-full flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity duration-150 group-hover:text-blue-600 group-hover:scale-110">
                  {name}
                </span>
              </>
            ) : cluster === "enclosed" ? (
              <>
                <span className="group-hover:opacity-0 transition-opacity duration-150">
                  {name}
                </span>
                <span className="absolute left-0 top-0 w-full flex items-center justify-center group-hover:opacity-100 opacity-0 transition-opacity duration-150 group-hover:text-gray-600 group-hover:tracking-tighter">
                  {name}
                </span>
              </>
            ) : (
              name
            )}
          </span>
        </div>
        {/* Middle: Art */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-[90%] h-[90%] rounded-xl overflow-hidden bg-zinc-200 border-4 border-zinc-200">
              <div className="w-full h-full overflow-hidden">
                <Image
                  src={image}
                  alt={name}
                  width={300}
                  height={225}
                  className="object-cover object-center w-full h-full transition-transform duration-1000 scale-100 group-hover:scale-[2]"
                  priority={false}
                  aria-hidden="true"
                />
              </div>
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