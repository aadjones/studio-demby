import React, { useRef } from "react";

interface FullscreenVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

export default function FullscreenVideo({ src, ...props }: FullscreenVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFullscreen = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if ((el as any).webkitRequestFullscreen) {
      (el as any).webkitRequestFullscreen();
    } else if ((el as any).mozRequestFullScreen) {
      (el as any).mozRequestFullScreen();
    } else if ((el as any).msRequestFullscreen) {
      (el as any).msRequestFullscreen();
    }
  };

  return (
    <video
      ref={videoRef}
      onClick={handleFullscreen}
      className={"w-full h-full object-cover cursor-pointer " + (props.className || "")}
      autoPlay
      loop
      muted
      playsInline
      {...props}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
} 