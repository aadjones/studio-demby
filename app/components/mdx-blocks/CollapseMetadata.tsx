// app/components/CollapseMetadata.tsx
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function CollapseMetadata({ children }: Props) {
  return (
    <div className="mt-6 sm:mt-8 bg-zinc-100 p-3 sm:p-4 rounded-lg text-xs sm:text-sm text-zinc-800 border border-zinc-300">
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}
  
