import "@/app/global.css";
import { ReactNode } from "react";
import clsx from "clsx";

export default function ClusterLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { cluster: string };
}) {
  const backgroundByCluster: Record<string, string> = {
    resonant: "bg-blue-50",
    errant: "bg-rose-50",
    fractured: "bg-yellow-50",
    enclosed: "bg-zinc-100",
  };

  const bgClass = backgroundByCluster[params.cluster] || "bg-white";

  return (
    <div className={clsx("min-h-screen", bgClass)}>
      {children}
    </div>
  );
}
