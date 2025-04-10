// components/LoopRoomInterlude.tsx
export default function LoopRoomInterlude({ text }: { text: string }) {
    return (
      <div className="py-24 text-center text-sm italic text-muted-foreground tracking-wide opacity-70">
        {text}
      </div>
    )
  }
  