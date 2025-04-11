import React from "react";

export default function ProjectContentShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto space-y-12 pt-6 pb-12 px-4">
        {children}
      </div>
    </div>
  );
} 