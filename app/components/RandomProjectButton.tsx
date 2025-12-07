"use client"
import { useRouter } from "next/navigation";
import { Dices } from "lucide-react";
import React, { useCallback, useState } from "react";

interface RandomProjectButtonProps {
  slugs: string[];
}

export default function RandomProjectButton({ slugs }: RandomProjectButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(() => {
    setLoading(true);
    if (slugs.length === 0) return;
    const randomSlug = slugs[Math.floor(Math.random() * slugs.length)];
    if (randomSlug) {
      router.push(`/featured/${randomSlug}`);
    }
    setLoading(false);
  }, [router, slugs]);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleClick}
        disabled={loading}
        aria-label="Surprise Me! Jump to a random project."
        className="mt-2 flex items-center justify-center mx-auto transition-transform hover:scale-110 focus:scale-110 active:scale-95"
        title="Surprise Me!"
        style={{ background: "none", border: "none", padding: 0, width: 36, height: 36, cursor: "pointer" }}
      >
        <Dices size={28} className="text-indigo-600 drop-shadow-sm" />
        <span className="sr-only">Surprise Me</span>
      </button>
      <span className="text-xs text-gray-500 mt-1">Surprise Me</span>
    </div>
  );
} 