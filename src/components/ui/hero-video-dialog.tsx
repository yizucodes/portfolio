"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { Play, XIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Image from "next/image"

import { cn } from "@/lib/utils"

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out"

interface HeroVideoProps {
  animationStyle?: AnimationStyle
  videoSrc: string
  thumbnailSrc: string
  thumbnailAlt?: string
  className?: string
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
}

export function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const selectedAnimation = animationVariants[animationStyle]

  // Ensure we only render the portal on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isVideoOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isVideoOpen])

  const videoModal = (
    <AnimatePresence>
      {isVideoOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsVideoOpen(false)
            }
          }}
          onClick={() => setIsVideoOpen(false)}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
          <motion.div
            {...selectedAnimation}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-[90vw] max-w-[1200px] aspect-video"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "85vh" }}
          >
            <motion.button 
              className="absolute -top-12 right-0 z-10 rounded-full bg-neutral-900/80 p-3 text-white ring-2 ring-white/20 backdrop-blur-sm hover:bg-neutral-900 transition-all hover:scale-110"
              onClick={() => setIsVideoOpen(false)}
              aria-label="Close video"
            >
              <XIcon className="size-6" />
            </motion.button>
            <div className="relative isolate size-full overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10">
              <iframe
                src={videoSrc}
                title="Hero Video player"
                className="size-full rounded-xl"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className={cn("relative h-full w-full", className)}>
      <button
        type="button"
        aria-label="Play video"
        className="group relative h-full w-full cursor-pointer border-0 bg-transparent p-0"
        onClick={() => setIsVideoOpen(true)}
      >
        <Image
          src={thumbnailSrc}
          alt={thumbnailAlt}
          fill
          className="rounded-md border object-cover shadow-lg transition-all duration-200 ease-out group-hover:brightness-[0.8]"
        />
        <div className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
          <div className="bg-primary/10 flex size-14 items-center justify-center rounded-full backdrop-blur-md">
            <div
              className={`from-primary/30 to-primary relative flex size-10 scale-100 items-center justify-center rounded-full bg-gradient-to-b shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]`}
            >
              <Play
                className="size-4 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
                style={{
                  filter:
                    "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))",
                }}
              />
            </div>
          </div>
        </div>
      </button>
      {/* Portal the modal to document.body to escape any parent stacking contexts */}
      {mounted && createPortal(videoModal, document.body)}
    </div>
  )
}
