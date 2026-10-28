import React from "react";

export default function ProjectContentShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      {/* project-shell: the one column every block on a project page aligns to. */}
      <div className="project-shell max-w-4xl mx-auto space-y-12 pt-6 pb-12 px-4">
        {children}
      </div>
    </div>
  );
} 