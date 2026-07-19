"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  title?: string;
  height?: number;
}

export default function EmbedExperience({ src, title = "Interactive embed", height = 600 }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frameHeight, setFrameHeight] = useState(height);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (e.data?.source !== "pitch-clock-embed") return;
      if (typeof e.data.height === "number") setFrameHeight(e.data.height);
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    function requestHeight() {
      iframe?.contentWindow?.postMessage(
        { source: "pitch-clock-embed-request" },
        window.location.origin
      );
    }
    // A same-origin local file can finish loading before this effect
    // attaches its `load` listener, so check for the already-loaded case
    // directly rather than relying on the event alone.
    if (iframe.contentDocument?.readyState === "complete") {
      requestHeight();
    }
    iframe.addEventListener("load", requestHeight);
    return () => iframe.removeEventListener("load", requestHeight);
  }, []);

  return (
    <div className="w-full my-8 rounded-xl overflow-hidden border border-zinc-800">
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        width="100%"
        height={frameHeight}
        scrolling="no"
        style={{ display: "block", border: "none" }}
      />
    </div>
  );
}
