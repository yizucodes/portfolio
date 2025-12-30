"use client";

import Image from "next/image";
import { Lens } from "./lens";
import { cn } from "@/lib/utils";

interface LensImageProps {
  /** The image source URL */
  src: string;
  /** Alt text for the image */
  alt: string;
  /** Additional CSS classes */
  className?: string;
  /** Container CSS classes */
  containerClassName?: string;
  /** Zoom factor for the lens (default: 2) */
  zoomFactor?: number;
  /** Size of the lens in pixels (default: 200) */
  lensSize?: number;
  /** Duration of the animation in seconds (default: 0.15) */
  duration?: number;
  /** Aria label for accessibility (default: "Zoom into image") */
  ariaLabel?: string;
  /** Whether to fill the container (default: true) */
  fill?: boolean;
  /** Image width (required if fill is false) */
  width?: number;
  /** Image height (required if fill is false) */
  height?: number;
  /** Object fit style (default: "contain") */
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export function LensImage({
  src,
  alt,
  className,
  containerClassName,
  zoomFactor = 2,
  lensSize = 200,
  duration = 0.15,
  ariaLabel = "Zoom into image",
  fill = true,
  width,
  height,
  objectFit = "contain",
}: LensImageProps) {
  const objectFitClass =
    objectFit === "contain"
      ? "object-contain"
      : objectFit === "cover"
        ? "object-cover"
        : objectFit === "fill"
          ? "object-fill"
          : objectFit === "none"
            ? "object-none"
            : "object-scale-down";

  const imageElement = fill ? (
    <Image src={src} alt={alt} fill className={cn(objectFitClass, className)} />
  ) : (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(objectFitClass, className)}
    />
  );

  return (
    <div className={cn("relative", containerClassName)}>
      <Lens
        zoomFactor={zoomFactor}
        lensSize={lensSize}
        duration={duration}
        ariaLabel={ariaLabel}
        className="absolute inset-0"
      >
        {imageElement}
      </Lens>
    </div>
  );
}

