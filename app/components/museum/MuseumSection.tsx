import React from 'react';
import { SectionData } from './types';
import SpecimenCard from './SpecimenCard';

interface MuseumSectionProps {
  data: SectionData;
}

export default function MuseumSection({ data }: MuseumSectionProps) {
  return (
    <section className="mb-24 last:mb-0">
      <div className="mb-8 border-b-2 border-museum-900 pb-4">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-museum-900 mb-2">
          {data.title}
        </h2>
        {data.preamble && (
          <p className="font-serif text-stone-600 italic max-w-3xl leading-relaxed">
            {data.preamble}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.specimens.map((specimen) => (
          <SpecimenCard key={specimen.id} specimen={specimen} />
        ))}
      </div>
    </section>
  );
}
