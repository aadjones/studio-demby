import React, { useState } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

interface Tooth {
  id: number;
  name: string;
  position: string;
  alignment: string;
  motto: string;
  wisdom: string;
  status: string;
  mythicTrait: string;
  crimes: string;
  legendaryObject: string;
  deathCause: string;
  coords: { top: string; left: string };
}

export default function WisdomTeethCodex() {
  const [selectedTooth, setSelectedTooth] = useState<Tooth | null>(null);

  const teeth: Tooth[] = [
    {
      id: 1,
      name: "Krohl the Half-Born",
      position: "Upper Right",
      alignment: "Chaotic Recluse",
      motto: "I emerge only in dreams.",
      wisdom: "Not all emergence is progress.",
      status: "Impacted, phantom presence",
      mythicTrait: "Visible in vision, invisible in war",
      crimes: "Whispered into the sinus cavities; accused of fomenting migraines",
      legendaryObject: "The Inverted Crown (an uncut cusp sealed in enamel mist)",
      deathCause: "Ritual Extraction by The Outsider, during the Blooming Eclipse",
      coords: { top: "38%", left: "15%" }
    },
    {
      id: 16,
      name: "Varkon of the Bone Wall",
      position: "Upper Left",
      alignment: "Lawful Stasis",
      motto: "I was built for the war that never came.",
      wisdom: "That which holds may also halt.",
      status: "Buried, curved root architecture",
      mythicTrait: "Holds the Line — cannot be moved by mortal floss",
      crimes: "Refused to erupt, hoarded calcium, implicated in the Great Temporomandibular resistance of 2021",
      legendaryObject: "The Sub-Gingival Blade",
      deathCause: "Internment via drillwork, by decree of The Architect",
      coords: { top: "38%", left: "74%" }
    },
    {
      id: 17,
      name: "Molgur the Entombed",
      position: "Lower Left",
      alignment: "Neutral Rot",
      motto: "All kingdoms collapse inward.",
      wisdom: "Ignore it and it will go away.",
      status: "Horizontally impacted, curled root",
      mythicTrait: "Leans eternally left",
      crimes: "Silent siege of the 2nd molar; pocketing bacteria",
      legendaryObject: "The Pressure Crown",
      deathCause: "Surgical removal during the Fifth Anesthetic",
      coords: { top: "49%", left: "76%" }
    },
    {
      id: 32,
      name: "Sivrak the Impatient",
      position: "Lower Right",
      alignment: "Chaotic Vigor",
      motto: "I will rise or ruin.",
      wisdom: "Buy bitcoin; never sell.",
      status: "Angled erupting, crown exposed",
      mythicTrait: "Bites before its time",
      crimes: "Hygienist bribery, plaque migration advocate",
      legendaryObject: "The Crown That Cuts",
      deathCause: "Swift extraction in foreign land, beneath the steel of a stranger's hand",
      coords: { top: "49%", left: "12%" }
    }
  ];

  const handleToothClick = (id: number) => {
    const tooth = teeth.find(tooth => tooth.id === id);
    if (tooth) {
      setSelectedTooth(tooth);
    }
  };

  const closeModal = () => {
    setSelectedTooth(null);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-amber-800 mb-6 tracking-wider">
        THE CODEX OF MOLAR WISDOM
      </h1>
      <div className="bg-amber-50 w-full rounded-lg p-6 font-serif">
        {/* Main X-ray image container */}
        <div className="relative w-full max-w-lg mx-auto mb-8 bg-amber-100 p-4 rounded-lg border-2 border-amber-200">
          <div className="relative flex justify-center items-center">
            <Image 
              src="/photos/wisdom/wisdom-teeth-codex.png" 
              alt="Dental panoramic X-ray with ancient symbols" 
              className="w-full rounded shadow-lg"
              width={800}
              height={600}
              priority
            />
            <div className="absolute inset-0 bg-amber-900/10 rounded" />
            {teeth.map((tooth) => (
              <div 
                key={tooth.id}
                className="absolute w-12 h-12 bg-amber-500/30 rounded-full cursor-pointer border-2 border-amber-600/50 hover:bg-amber-400/50 transition-all duration-300 pulse-animation flex items-center justify-center font-bold text-lg text-amber-900"
                style={{ top: tooth.coords.top, left: tooth.coords.left }}
                onClick={() => handleToothClick(tooth.id)}
              >
                {tooth.id}
              </div>
            ))}
          </div>
        </div>

        {/* Introduction text */}
        <div className="prose prose-amber mb-8 text-amber-900 text-center max-w-2xl">
          <p className="italic text-lg">
            Herein lies the sacred knowledge of the Third Molars, gatekeepers of wisdom, 
            harbingers of pain. Their stories echo through the chambers of bone and memory.
          </p>
        </div>

        <p className="text-amber-700 mb-8">
          ~ Click on a tooth marker to reveal its ancient wisdom ~
        </p>

        {selectedTooth && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-amber-100 max-w-2xl w-full rounded-lg shadow-2xl overflow-hidden border-4 border-amber-600">
              <div className="bg-amber-800 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-amber-100">
                  {selectedTooth.name} <span className="font-normal text-amber-300">({selectedTooth.position})</span>
                </h2>
                <button onClick={closeModal} className="text-amber-200 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 bg-amber-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-amber-900 font-semibold uppercase tracking-wider text-sm">Alignment</h3>
                      <p className="text-amber-800">{selectedTooth.alignment}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-amber-900 font-semibold uppercase tracking-wider text-sm">Motto</h3>
                      <p className="text-amber-800 italic">&ldquo;{selectedTooth.motto}&rdquo;</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-amber-900 font-semibold uppercase tracking-wider text-sm">Wisdom Imparted</h3>
                      <p className="text-amber-800 italic">&ldquo;{selectedTooth.wisdom}&rdquo;</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-amber-900 font-semibold uppercase tracking-wider text-sm">Status</h3>
                      <p className="text-amber-800">{selectedTooth.status}</p>
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <h3 className="text-amber-900 font-semibold uppercase tracking-wider text-sm">Mythic Trait</h3>
                      <p className="text-amber-800">{selectedTooth.mythicTrait}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-amber-900 font-semibold uppercase tracking-wider text-sm">Known Crimes</h3>
                      <p className="text-amber-800">{selectedTooth.crimes}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-amber-900 font-semibold uppercase tracking-wider text-sm">Legendary Object</h3>
                      <p className="text-amber-800">{selectedTooth.legendaryObject}</p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-amber-900 font-semibold uppercase tracking-wider text-sm">Cause of Death</h3>
                      <p className="text-amber-800">{selectedTooth.deathCause}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 0.7; }
          }
          .pulse-animation {
            animation: pulse 3s infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
