// components/ZoomImage.tsx
import Zoom from "react-medium-image-zoom";
import 'react-medium-image-zoom/dist/styles.css';

export default function ZoomImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Zoom>
      <img src={src} alt={alt}   className="w-full h-auto rounded-lg shadow cursor-zoom-in object-cover"
 />
    </Zoom>
  );
}

export { ZoomImage };
