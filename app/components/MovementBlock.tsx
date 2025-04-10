import LoopRoomTrack from '@/app/components/LoopRoomTrack';

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
    <section id={id} className="my-16 scroll-mt-20">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-semibold tracking-wide uppercase text-zinc-500 dark:text-zinc-400">
          {title}
        </h2>
        <p className="italic text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto mb-0">
        {description}
        </p>
      </div>

      {tracks.map((track) => (
        <LoopRoomTrack
          key={track.id}
          id={track.id}
          title={track.title}
          src={track.src}
          thumbnail={track.thumbnail}
          description={track.description}
          className="scroll-mt-20"
        />
      ))}
    </section>
  );
}
