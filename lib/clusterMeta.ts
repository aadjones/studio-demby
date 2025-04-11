// lib/clusterMeta.ts

export const clusterMeta = {
    resonant: {
      title: "Resonant",
      tagline: "Sound that remembers itself.",
      color: "#88ccff",
      bgClass: "bg-gradient-to-r from-blue-100 to-indigo-200",
    },
    errant: {
      title: "Errant",
      tagline: "Wrong turns, on purpose.",
      color: "#ffaad4",
      bgClass: "bg-gradient-to-r from-pink-200 to-fuchsia-300",
    },
    fractured: {
      title: "Fractured",
      tagline: "Everything broken on time.",
      color: "#ccddee",
      bgClass: "bg-gradient-to-r from-gray-200 to-red-200",
    },
    enclosed: {
      title: "Enclosed",
      tagline: "A sealed room, still vibrating.",
      color: "#999999",
      bgClass: "bg-gradient-to-r from-gray-300 to-zinc-400",
    },
  } as const;
  
  export type Cluster = keyof typeof clusterMeta;
  