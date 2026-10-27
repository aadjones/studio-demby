import Image from "next/image";

type Props = {
  image: string;
  video?: string;
  alt: string;
  sizes: string;
  className?: string;
};

/**
 * Fills a card's square frame. A looping video plays in place of the image when
 * one is set (a GIF replacement at a tenth of the weight); the image is its poster.
 */
export default function CardMedia({ image, video, alt, sizes, className = "" }: Props) {
  if (video) {
    return (
      <video
        src={video}
        poster={image}
        autoPlay
        loop
        muted
        playsInline
        aria-label={alt}
        className={`absolute inset-0 h-full w-full object-cover ${className}`.trim()}
      />
    );
  }
  return <Image src={image} alt={alt} fill sizes={sizes} className={`object-cover ${className}`.trim()} />;
}
