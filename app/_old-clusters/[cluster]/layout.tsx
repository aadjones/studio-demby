// app/(clusters)/[cluster]/layout.tsx
import { clusterColors } from "@/lib/theme";

export default function ClusterLayout({
  params,
  children,
}: {
  params: { cluster: string };
  children: React.ReactNode;
}) {
  const color = clusterColors[params.cluster] || "bg-white";

  return (
    <div className={`${color} min-h-screen`}>
      {children}
    </div>
  );
}
