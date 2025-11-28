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
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      <Link
        href={href}
        className="group w-full max-w-[420px] aspect-[4/3] rounded-2xl bg-zinc-100 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-400 transition-all flex flex-col items-center justify-between p-4 sm:p-5 gap-1"
        tabIndex={0}
        aria-label={`View ${name} category`}
      >
        {/* Top: Category Name */}
        <div className="w-full text-center text-xl font-bold text-zinc-900 mb-1 mt-1 truncate">
          <span className="group-hover:text-blue-600 transition-colors duration-150">
            {name}
          </span>
        </div>
        {/* Middle: Art */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-[92%] h-[92%] rounded-xl overflow-hidden bg-zinc-200 border-4 border-zinc-200">
              <div className="w-full h-full overflow-hidden">
                <Image
                  src={image}
                  alt={name}
                  width={300}
                  height={225}
                  className="object-cover object-center w-full h-full transition-transform duration-700 scale-100 group-hover:scale-110"
                  priority={false}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Bottom: Subtitle */}
        <div className="w-full text-center text-sm text-zinc-600 font-medium mt-1 mb-1 truncate">
          {description}
        </div>
      </Link>
    </motion.div>
  );
};

export default Door; 