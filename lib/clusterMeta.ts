export const clusterDisplayNames = {
    resonant: "Resonant",
    errant: "Errant",
    fractured: "Fractured",
    enclosed: "Enclosed",
  } as const;
  
  export type Cluster = keyof typeof clusterDisplayNames;
  