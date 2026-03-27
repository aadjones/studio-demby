export interface BirdData {
  slug: string;
  name: string;
  species: string;
  sketchType: string;
  moods: string[];
  audioSrc: string;
  imageSrc: string;
}

export const birds: BirdData[] = [
  {
    slug: "spoonbilled-sandpiper",
    name: "Spoonbilled Sandpiper",
    species: "Calidris pygmaea",
    sketchType: "tidal",
    moods: ["circulating", "compulsive", "introspective"],
    audioSrc: "/audio/birds/spoonbilled-sandpiper.mp3",
    imageSrc: "/images/birds/spoonbilled-sandpiper.jpg",
  },
  {
    slug: "indian-bustard",
    name: "Indian Bustard",
    species: "Ardeotis nigriceps",
    sketchType: "open air",
    moods: ["tall", "curious", "bittersweet"],
    audioSrc: "/audio/birds/indian-bustard.mp3",
    imageSrc: "/images/birds/indian-bustard.jpg",
  },
  {
    slug: "least-bells-vireo",
    name: "Least Bell\u2019s Vireo",
    species: "Vireo bellii pusillus",
    sketchType: "march",
    moods: ["chirpy", "annoying", "upbeat"],
    audioSrc: "/audio/birds/least-bells-vireo.mp3",
    imageSrc: "/images/birds/least-bells-vireo.jpg",
  },
  {
    slug: "dusky-seaside-sparrow",
    name: "Dusky Seaside Sparrow",
    species: "Ammospiza maritima nigrescens",
    sketchType: "chorale",
    moods: ["somber", "eerie", "tetric"],
    audioSrc: "/audio/birds/dusky-seaside-sparrow.mp3",
    imageSrc: "/images/birds/dusky-seaside-sparrow.jpg",
  },
];
