// app/components/ProjectLayout.tsx
import React from "react";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full px-4 sm:px-6 md:px-8 xl:px-12 max-w-4xl mx-auto">
      <div className="prose prose-neutral dark:prose-invert">{children}</div>
    </main>
  );
}
