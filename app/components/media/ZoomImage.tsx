// components/ZoomImage.tsx
import Zoom from "react-medium-image-zoom";
import 'react-medium-image-zoom/dist/styles.css';
import Image from 'next/image';

interface ZoomImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function ZoomImage({ 
  src, 
  alt, 
  caption, 
  className = "",
  width = 800,
  height = 600
}: ZoomImageProps) {
  return (
    <figure className={`flex flex-col items-center ${className}`}>
      <Zoom>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto rounded-lg shadow cursor-zoom-in object-cover"
        />
      </Zoom>
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-500 italic text-center max-w-md">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export { ZoomImage };
