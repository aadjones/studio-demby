import React from 'react';

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
        <div className="text-xs text-stone-400 uppercase tracking-widest">
          © {new Date().getFullYear()} The Museum of Dashes • Department of Typographic Entomology
        </div>
      </div>
    </footer>
  );
}
