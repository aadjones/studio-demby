import LoopRoomTrack from '@/app/components/project-looproom/LoopRoomTrack';

export default function MovementBlock({
  id,
  title,
  description,
  tracks
}: {
  id: string;
  title: string;
  description: string;
  tracks: {
    id: string;
    title: string;
    src: string;
    thumbnail: string;
    description?: string;
  }[];
}) {
  return (
    <section id={id} className="my-8 sm:my-12 scroll-mt-16 sm:scroll-mt-20">
      {description && (
        <div className="text-center mb-6 px-3 sm:px-4">
          <p className="italic text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            {description}
          </p>
        </div>
      )}

      <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
        {tracks.map((track) => (
          <LoopRoomTrack
            key={track.id}
            id={track.id}
            title={track.title}
            src={track.src}
            thumbnail={track.thumbnail}
            description={track.description}
            className="scroll-mt-16 sm:scroll-mt-20"
          />
        ))}
      </div>
    </section>
  );
}
