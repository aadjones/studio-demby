// app/components/ProjectLayout.tsx
import React from "react";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto space-y-12 py-12 px-4">
      {children}</div>
    </main>
  );
}
