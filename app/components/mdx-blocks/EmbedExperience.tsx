interface Props {
  src: string;
  title?: string;
  height?: number;
}

export default function EmbedExperience({ src, title = "Interactive embed", height = 600 }: Props) {
  return (
    <div className="w-full my-8 rounded-xl overflow-hidden border border-zinc-800">
      <iframe
        src={src}
        title={title}
        width="100%"
        height={height}
        scrolling="no"
        style={{ display: "block", border: "none" }}
      />
    </div>
  );
}
