"use client";

import GalleryOfLies from '@/app/components/GalleryOfLies';

export default function LiesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gallery of Lies</h1>
      <GalleryOfLies prompt="Lie to me" />
    </main>
  );
}
