/**
 * VideoFile — your own video file (MP4) with controls and a poster frame,
 * e.g. the preview mixes beside a tracklist in HeroBlock.
 *
 *   <VideoFile src="https://…/clip.mp4" poster="/photos/…/still.jpg" title="What it is" />
 *
 * Other video jobs have their own block:
 *   - YouTube, Loom or Vimeo → VideoEmbed
 *   - a silent loop that's part of the artwork → AmbientLoop
 *
 * It fills its container; don't wrap it in a max-w-* div.
 */

interface VideoFileProps {
  src: string;
  poster?: string;
  /** Names the video for screen readers; not shown. */
  title?: string;
  caption?: string;
  /** Small badge in the corner, e.g. "Preview Mix". */
  label?: string;
  aspectRatio?: "video" | "square";
  controlsList?: string;
  className?: string;
}

export default function VideoFile({
  src,
  poster,
  title,
  caption,
  label,
  aspectRatio = "video",
  controlsList = "nodownload nofullscreen",
  className = "",
}: VideoFileProps) {
  return (
    <figure className={`w-full ${className}`.trim()}>
      <div
        className={`relative w-full ${aspectRatio === "video" ? "aspect-video" : "aspect-square"} overflow-hidden rounded-xl bg-black`}
      >
        <video
          src={src}
          poster={poster}
          aria-label={title}
          controls
          controlsList={controlsList}
          className="h-full w-full bg-black"
        />
        {label && (
          <div className="absolute right-1 top-1 rounded-full bg-black/60 px-1.5 py-1 text-[10px] font-semibold tracking-wide text-white shadow-lg shadow-black/20 ring-1 ring-white/20 backdrop-blur-sm sm:right-2 sm:top-2 sm:px-2.5 sm:py-1.5 sm:text-xs">
            {label}
          </div>
        )}
      </div>
      {caption && <figcaption className="mt-2 text-center text-[10px] italic text-ink-500 sm:mt-3 sm:text-xs">{caption}</figcaption>}
    </figure>
  );
}
