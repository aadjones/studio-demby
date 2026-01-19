import React from 'react';
import Link from 'next/link';

export default function MuseumFooter() {
  return (
    <footer className="mt-32 border-t border-museum-200 pt-16 pb-24 text-center">
      <div className="max-w-2xl mx-auto px-6">
        <div className="mb-8">
          <span className="text-4xl block mb-4 text-stone-300">❦</span>
        </div>
        <p className="font-serif text-lg text-museum-900 mb-4">
          This catalog is incomplete.
        </p>
        <p className="font-sans text-stone-600 leading-relaxed mb-8">
          Classification remains provisional. Several specimens remain unnamed or are currently migrating between Unicode blocks.
          Further discoveries are anticipated as digital entropy increases.
        </p>

        {/* Gift Shop wayfinding */}
        <div className="mb-10 mt-4">
          <Link
            href="/featured/museum-of-dashes/giftshop"
            className="inline-block border-2 border-museum-900 bg-white px-6 py-4 hover:bg-museum-100 transition-colors group"
          >
            <span className="block font-sans text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-1">
              Before You Leave
            </span>
            <span className="block font-serif text-base text-museum-900 group-hover:text-stone-700">
              → Gift Shop &amp; Acquisitions Desk
            </span>
            <span className="block font-sans text-[10px] text-stone-400 mt-1 italic">
              Commemorative ephemera available
            </span>
          </Link>
        </div>

        <div className="text-xs text-stone-400 uppercase tracking-widest">
          © {new Date().getFullYear()} The Museum of Dashes • Department of Typographic Ephemera
        </div>
      </div>
    </footer>
  );
}
