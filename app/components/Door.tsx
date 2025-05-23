import Link from "next/link";
import Image from "next/image";
import React from "react";

interface DoorProps {
  name: string;
  description: string;
  href: string;
  image: string;
}

const Door: React.FC<DoorProps> = ({ name, description, href, image }) => {
  return (
    <Link
      href={href}
      className="group relative block w-full max-w-[240px] aspect-[2/3] rounded-t-full rounded-b-xl overflow-hidden shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
      tabIndex={0}
      aria-label={`Enter the ${name} cluster`}
    >
      <div className="absolute inset-0">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover object-center scale-110 opacity-40 group-hover:scale-[2.5] group-focus:scale-[1.5] group-hover:opacity-60 group-focus:opacity-60 transition duration-1000"
          priority={false}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 group-focus:bg-black/20 transition" aria-hidden="true" />
      </div>
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 text-center">
        <h3 className="text-2xl font-bold text-white drop-shadow mb-2">{name}</h3>
        <p className="text-white text-base drop-shadow max-w-[90%]">{description}</p>
      </div>
    </Link>
  );
};

export default Door; 