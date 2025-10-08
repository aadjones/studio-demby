"use client";

import React, { useState } from "react";

type Props = {
  number: number;
  children: React.ReactNode;
};

export default function Footnote({ number, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="inline">
      <button
        className="text-blue-600 hover:text-blue-700 transition-colors align-super text-sm leading-none mx-0.5"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={`Footnote ${number}`}
      >
        {number}
      </button>
      {isOpen && (
        <span className="inline-block align-baseline max-w-prose ml-1 px-2 py-1 text-sm bg-blue-50 border-l-2 border-blue-600 text-zinc-700">
          {children}
        </span>
      )}
    </span>
  );
}
