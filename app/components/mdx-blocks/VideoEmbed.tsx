/**
 * The one way to embed a video (YouTube, Loom, Vimeo…) in a project page.
 *
 * It fills the project column and keeps the video's shape. Don't hand-write an
 * <iframe> in MDX: five pages once copied a snippet that capped videos at 576px,
 * and the copies drifted from the design.
 *
 *   <VideoEmbed src="https://www.youtube.com/embed/ID" title="What the video is" />
 */

interface VideoEmbedProps {
  src: string;
  title?: string;
  /** Height as a percentage of width; 56.25 is 16:9. Only for videos that aren't 16:9. */
  aspectRatio?: number;
  className?: string;
}

export default function VideoEmbed({
  src,
  title = "Embedded video",
  aspectRatio = 56.25,
  className = "",
}: VideoEmbedProps) {
  return (
    <div
      className={`my-8 w-full overflow-hidden rounded-xl bg-black shadow-lg ${className}`.trim()}
      style={{ aspectRatio: `100 / ${aspectRatio}` }}
    >
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
