// components/MeltdownDiptych.tsx

import { ZoomImage } from "../media/ZoomImage";

export default function MeltdownDiptych() {
  return (
    <div className="mt-10 mb-14 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeSlideIn">
      <ZoomImage
        src="/photos/degradation/degradation.gif"
        alt="Bird melt"
        rotateDeg={-2}
        className="transition-transform duration-700 ease-in-out"
      />
      <ZoomImage
        src="/photos/degradation/piano-melt.gif"
        alt="Piano grid"
        rotateDeg={2}
        className="transition-transform duration-700 ease-in-out"
      />
    </div>
  );
}
