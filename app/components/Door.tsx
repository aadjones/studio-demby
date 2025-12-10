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
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        href={href}
        className="group relative w-full max-w-[420px] rounded-3xl
                   bg-gradient-to-br from-surface-100 via-surface-200 to-surface-300
                   shadow-xl hover:shadow-2xl
                   focus:outline-none focus:ring-4 focus:ring-brand-coral/50
                   transition-all duration-300
                   flex flex-col
                   border-2 border-surface-300/50
                   hover:border-brand-coral/30
                   overflow-hidden"
        tabIndex={0}
        aria-label={`View ${name} category`}
      >
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-coral/5 via-transparent to-brand-violet/5
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Image section - takes most of the space */}
        <div className="relative z-10 w-full aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={name}
            width={400}
            height={300}
            className="object-cover object-center w-full h-full
                       transition-transform duration-700 ease-out
                       scale-100 group-hover:scale-105
                       group-hover:brightness-105"
            priority={false}
            aria-hidden="true"
          />
          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/10 to-transparent
                          group-hover:from-brand-coral/10 transition-colors duration-500" />
        </div>

        {/* Bottom: Text section with white background */}
        <div className="relative z-10 w-full bg-white px-5 py-4 flex flex-col gap-1 min-h-[100px]">
          {/* Category Name */}
          <h3 className="text-lg sm:text-xl font-display font-bold text-ink-900
                         group-hover:text-brand-coral transition-colors duration-300">
            {name}
          </h3>
          {/* Description */}
          <p className="text-sm sm:text-base font-body text-ink-600 line-clamp-2">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default Door; 