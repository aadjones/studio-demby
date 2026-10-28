/**
 * VideoEmbed — a video hosted elsewhere (YouTube, Loom, Vimeo).
 *
 *   <VideoEmbed src="https://youtu.be/ID" title="What the video is" caption="Optional line below" />
 *
 * Other video jobs have their own block:
 *   - your own MP4 with controls and a poster → VideoFile
 *   - a silent loop that's part of the artwork → AmbientLoop
 *
 * It fills the project column. Don't wrap it in a max-w-* div or hand-write an <iframe>:
 * pasted copies once capped videos at 544–576px, and a raw <iframe> now fails the build.
 * The page title belongs to HeroTitleBlock; `title` here only names the video for screen readers.
 *
 * Considered and deferred (2026-10-28): click-to-load (thumbnail first, YouTube on click).
 * The player is ~970 KB, about two thirds of a music page, and contacts Google's ad servers
 * on every visit, but it doesn't slow what visitors see (30 ms blocking). Not done because on
 * iPhones the first tap often only loads the player and a second tap plays it.
 */

interface VideoEmbedProps {
  /** Any YouTube link (watch?v=, youtu.be/, /embed/) or a Loom/Vimeo embed URL. */
  src: string;
  title?: string;
  caption?: string;
  /** Height as a percentage of width; 56.25 is 16:9. Only for videos that aren't 16:9. */
  aspectRatio?: number;
  className?: string;
}

/** YouTube refuses to play watch?v= or youtu.be links in an iframe; turn them into /embed/ links. */
function toEmbedUrl(src: string): string {
  const id = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/)?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : src;
}

export default function VideoEmbed({
  src,
  title = "Embedded video",
  caption,
  aspectRatio = 56.25,
  className = "",
}: VideoEmbedProps) {
  return (
    <figure className={`my-8 ${className}`.trim()}>
      <div
        className="w-full overflow-hidden rounded-xl bg-black shadow-lg"
        style={{ aspectRatio: `100 / ${aspectRatio}` }}
      >
        <iframe
          src={toEmbedUrl(src)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
      {caption && <figcaption className="mt-2 text-center text-xs italic text-ink-500">{caption}</figcaption>}
    </figure>
  );
}
