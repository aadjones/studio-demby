// components/ZoomImage.tsx
import Zoom from "react-medium-image-zoom";
import 'react-medium-image-zoom/dist/styles.css';
import Image from 'next/image';
import clsx from 'clsx';

interface ZoomImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  width?: number;
  height?: number;
  rotateDeg?: number; // ← Add this!
}

export default function ZoomImage({ 
  src, 
  alt, 
  caption, 
  className = "",
  width = 800,
  height = 600,
  rotateDeg = 0, // ← Default to no rotation
}: ZoomImageProps) {
  const rotationStyle = {
    transform: `rotate(${rotateDeg}deg)`,
  };

  return (
    <div
      className={clsx(
        "transition-transform duration-500 ease-in-out",
        rotateDeg !== 0 && "hover:rotate-0" // or use a class like hover:rotate-2 if you want more flair
      )}
      style={rotationStyle}
    >
      <figure className={`flex flex-col items-center ${className}`}>
        <Zoom>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto rounded-lg shadow cursor-zoom-in object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 800px"
          />
        </Zoom>
        {caption && (
          <figcaption className="mt-2 text-sm text-gray-500 italic text-center max-w-md">
            {caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}

export { ZoomImage };
