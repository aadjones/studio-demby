// components/ZoomImage.tsx
import Zoom from "react-medium-image-zoom";
import 'react-medium-image-zoom/dist/styles.css';
import Image from 'next/image';
import clsx from 'clsx';
import { useState } from 'react';

interface ZoomImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  captionClassName?: string;
  width?: number;
  height?: number;
  rotateDeg?: number;
}

export default function ZoomImage({ 
  src, 
  alt, 
  caption, 
  className = "",
  captionClassName = "",
  width = 1200,
  height = 800,
  rotateDeg = 0,
}: ZoomImageProps) {
  const [naturalWidth, setNaturalWidth] = useState<number>(width);
  const [naturalHeight, setNaturalHeight] = useState<number>(height);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const rotationStyle = {
    transform: `rotate(${rotateDeg}deg)`,
  };

  return (
    <div
      className={clsx(
        "transition-transform duration-500 ease-in-out",
        rotateDeg !== 0 && "hover:rotate-0"
      )}
      style={rotationStyle}
    >
      <figure className={`flex flex-col items-center ${className}`}>
        <div style={{ maxWidth: '100%', width: 'auto' }}>
          <Zoom
            zoomImg={{
              src: src,
              alt: alt,
              width: naturalWidth,
              height: naturalHeight,
            }}
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="w-full h-auto rounded-lg shadow cursor-zoom-in object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 1200px"
              onLoad={(e) => {
                const img = e.target as HTMLImageElement;
                setNaturalWidth(img.naturalWidth);
                setNaturalHeight(img.naturalHeight);
                setIsImageLoaded(true);
              }}
              priority
            />
          </Zoom>
        </div>
        {caption && (
          <figcaption className={clsx("mt-2 text-sm text-gray-500 italic text-center max-w-md", captionClassName)}>
            {caption}
          </figcaption>
        )}
      </figure>
    </div>
  );
}

export { ZoomImage };
