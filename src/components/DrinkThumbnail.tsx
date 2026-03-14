"use client";

import { useState } from "react";

/**
 * Small drink thumbnail. Images from public/images/ (URL /images/...).
 * If image is missing or fails to load, shows the cocktail glass placeholder.
 */
export function DrinkThumbnail({
  src,
  alt = "",
  className = "",
}: {
  src?: string | null;
  alt?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-jazz-charcoal border border-jazz-smoke flex-shrink-0 ${className}`}
        aria-hidden
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-jazz-cream-dim/50"
        >
          <path d="M8 22h8M12 11v11M7 6h10l1 5H6l1-5z" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
