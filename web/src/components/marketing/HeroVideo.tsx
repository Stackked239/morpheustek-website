"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Full-bleed hero video background (muted/looping autoplay). Falls back to the
 * poster still for reduced-motion users. The poster also covers the gap until
 * the video loads (or if the .mp4 isn't present yet).
 */
export function HeroVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener?.("change", update);
    return () => m.removeEventListener?.("change", update);
  }, []);

  if (reduced) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={poster} alt="" aria-hidden className={cn("object-cover", className)} />;
  }

  return (
    <video
      className={cn("object-cover", className)}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-hidden
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
