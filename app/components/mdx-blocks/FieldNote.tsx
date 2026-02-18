// app/components/FieldNote.tsx
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function FieldNote({ children }: Props) {
  return (
    <div className="mt-6 border-l-4 border-gray-500 pl-4 italic text-sm text-gray-400 [&_a]:underline [&_a]:decoration-gray-500 [&_a:hover]:text-gray-200 [&_a:hover]:decoration-gray-300 [&_a]:transition-colors">
      {children}
    </div>
  );
}
