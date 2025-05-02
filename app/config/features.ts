export const featureFlags = {
  showClusterNav: true, // Keep the main navigation visible
  showFloatingClusterNav: false, // Disable the floating cluster navigation
} as const;

export type FeatureFlags = typeof featureFlags; 