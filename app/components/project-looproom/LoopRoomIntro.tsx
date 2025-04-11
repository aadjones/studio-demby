// components/LoopRoomIntro.tsx
export default function LoopRoomIntro({ children }: { children: React.ReactNode }) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 text-muted-foreground leading-relaxed space-y-4">
        {children}
      </div>
    )
  }
  