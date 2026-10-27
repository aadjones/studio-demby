import { ReactNode } from 'react';

export interface CalloutProps {
  children: ReactNode;
  emoji?: string;
}

export function Callout({ children, emoji = '💡' }: CalloutProps) {
  return (
    <div className="flex p-4 my-8 border border-line bg-subtle rounded">
      <div className="flex items-center w-4 mr-4">{emoji}</div>
      <div className="w-full callout">{children}</div>
    </div>
  );
} 