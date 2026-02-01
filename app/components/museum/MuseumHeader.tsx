import React from "react";

export default function MuseumHeader() {
  return (
    <header className="mb-20 text-center pt-8 md:pt-12">
      <div className="inline-block border-4 border-double border-museum-900 p-6 mb-8 bg-white">
        <h1 className="text-4xl md:text-5xl font-serif font-black text-museum-900 uppercase tracking-widest mb-2">
          The Museum
        </h1>
        <h2 className="text-2xl md:text-3xl font-serif text-stone-600 tracking-wide">
          of Dashes
        </h2>
      </div>
      <div className="max-w-2xl mx-auto space-y-4">
        <p className="font-serif text-lg md:text-xl text-museum-900 leading-relaxed">
          A curatorial study of horizontal connectors, bars, and their
          associated behavioral anomalies.
        </p>
        <div className="w-16 h-1 bg-museum-900 mx-auto my-6"></div>
        <p className="font-sans text-sm text-stone-500 max-w-lg mx-auto leading-relaxed">
          Despite centuries of typographic study, the category of
          &ldquo;dash&rdquo; remains unstable. New specimens continue to be
          identified in the wild, often camouflaged as errors or glitched
          rendering artifacts. The management requests that visitors <strong>do not tap
          on the glass.</strong>
        </p>
      </div>
    </header>
  );
}
