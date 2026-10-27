// app/components/FieldNote.tsx
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function FieldNote({ children }: Props) {
  return (
    <div className="mt-6 border-l-4 border-ink-500 pl-4 italic text-sm text-ink-500 [&_a]:underline [&_a]:decoration-ink-500 [&_a:hover]:text-ink-300 [&_a:hover]:decoration-ink-300 [&_a]:transition-colors">
      {children}
    </div>
  );
}
