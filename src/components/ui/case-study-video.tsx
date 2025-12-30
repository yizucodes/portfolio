"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CaseStudyVideoProps {
  src: string;
  thumbnail?: string;
  alt?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  showControls?: boolean;
  mode?: "inline" | "modal";
  aspectRatio?: "16:9" | "4:3" | "1:1";
  objectFit?: "cover" | "contain";
  minHeight?: string;
}

export function CaseStudyVideo({
  src,
  thumbnail,
  alt = "Video",
  autoplay = false,
  loop = false,
  muted = false,
  className,
  showControls = true,
  mode = "inline",
  aspectRatio = "16:9",
  objectFit = "contain",
  minHeight,
}: CaseStudyVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle video loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setHasError(false);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(false);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      if (video) {
        video.currentTime = 0;
      }
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // Handle autoplay - immediate play on mount, with intersection observer fallback
  useEffect(() => {
    if (!autoplay || mode !== "inline") return;

    const video = videoRef.current;
    if (!video) return;

    // Attempt immediate autoplay on mount
    const playVideo = () => {
      video.play().catch(() => {
        // Autoplay failed, will retry on intersection
      });
    };

    // Try to play immediately if video is ready
    if (video.readyState >= 2) {
      playVideo();
    } else {
      // Wait for video to be ready, then play
      video.addEventListener("loadeddata", playVideo, { once: true });
    }

    // Intersection observer as fallback and for pause/resume behavior
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && video && !isPlaying) {
            video.play().catch(() => {
              // Autoplay failed, user interaction required
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      video.removeEventListener("loadeddata", playVideo);
    };
  }, [autoplay, mode, isPlaying]);

  // Handle fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(() => {
        setHasError(true);
      });
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      // Silently fail in production - fullscreen may not be available
      if (process.env.NODE_ENV === "development") {
        console.error("Fullscreen error:", error);
      }
    }
  }, []);

  const openModal = useCallback(() => {
    if (mode === "modal") {
      setIsModalOpen(true);
      // Play will be handled by autoPlay attribute in modal video
    }
  }, [mode]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen && mode === "modal") return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          if (isModalOpen) {
            closeModal();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, mode, togglePlay, toggleMute, toggleFullscreen, closeModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const aspectRatioClasses = {
    "16:9": "aspect-video",
    "4:3": "aspect-4/3",
    "1:1": "aspect-square",
  };

  const videoElement = (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden rounded-lg bg-black",
        aspectRatioClasses[aspectRatio],
        minHeight,
        className
      )}
    >
      {!isLoaded && thumbnail && (
        <div className="absolute inset-0">
          <Image
            src={thumbnail}
            alt={alt}
            fill
            className="object-cover"
            priority={mode === "inline"}
          />
        </div>
      )}
      {hasError ? (
        <div className="flex h-full items-center justify-center text-white">
          <p className="text-sm">Failed to load video</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={src}
            className={cn("h-full w-full", objectFit === "cover" ? "object-cover" : "object-contain")}
            autoPlay={autoplay}
            loop={loop}
            muted={isMuted}
            playsInline
            preload={autoplay ? "auto" : "metadata"}
            onClick={mode === "modal" ? openModal : togglePlay}
          />
          {showControls && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all hover:bg-black/20">
              {!isPlaying && (
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="group flex size-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-all hover:bg-white/20 hover:scale-110"
                  onClick={mode === "modal" ? openModal : togglePlay}
                  aria-label="Play video"
                >
                  <Play className="ml-1 size-6 fill-white text-white" />
                </motion.button>
              )}
            </div>
          )}
          {showControls && isPlaying && (
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition-opacity hover:opacity-100">
              <button
                onClick={togglePlay}
                className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="ml-0.5 size-4" />
                )}
              </button>
              <button
                onClick={toggleMute}
                className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="size-4" />
                ) : (
                  <Volume2 className="size-4" />
                )}
              </button>
              <div className="flex-1" />
              <button
                onClick={toggleFullscreen}
                className="rounded-full p-2 text-white transition-colors hover:bg-white/20"
                aria-label="Fullscreen"
              >
                <Maximize className="size-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

  if (mode === "modal") {
    return (
      <>
        {videoElement}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative w-[90vw] max-w-6xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute -top-12 right-0 z-10 rounded-full bg-neutral-900/80 p-3 text-white ring-2 ring-white/20 backdrop-blur-sm transition-all hover:bg-neutral-900 hover:scale-110"
                  onClick={closeModal}
                  aria-label="Close video"
                >
                  <XIcon className="size-6" />
                </button>
                <div className="relative isolate w-full overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10 aspect-video">
                  <video
                    ref={videoRef}
                    src={src}
                    className={cn("h-full w-full", objectFit === "cover" ? "object-cover" : "object-contain")}
                    autoPlay
                    loop={loop}
                    muted={isMuted}
                    playsInline
                    controls={showControls}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return videoElement;
}

