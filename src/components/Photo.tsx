import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { EASE_OUT, VIEWPORT } from "../lib/motion"

/** Da dove si apre la foto quando entra in vista. */
export type RevealFrom = "window" | "left" | "right" | "up"

const HIDDEN: Record<RevealFrom, string> = {
  window: "inset(16% 14% 16% 14% round 32px)",
  left: "inset(0% 100% 0% 0% round 0px)",
  right: "inset(0% 0% 0% 100% round 0px)",
  up: "inset(100% 0% 0% 0% round 0px)",
}
const SHOWN = "inset(0% 0% 0% 0% round 0px)"

type Props = {
  src: string
  alt: string
  /** classi di aspect-ratio / forma per il riquadro */
  frame?: string
  className?: string
  caption?: string
  fig?: string | number
  delay?: number
  priority?: boolean
  /** posizione dell'immagine dentro il riquadro, es. "50% 30%" */
  focus?: string
  dark?: boolean
  reveal?: RevealFrom
  /** ampiezza del parallax interno, in % dell'altezza; 0 per disattivarlo */
  depth?: number
}

export function Photo({
  src,
  alt,
  frame = "aspect-[4/5]",
  className = "",
  caption,
  fig,
  delay = 0,
  priority,
  focus,
  dark,
  reveal = "window",
  depth = 8,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${depth}%`, `${depth}%`])

  return (
    <div className={className}>
      <motion.figure
        ref={ref}
        className={`group relative overflow-hidden bg-stone/20 ${frame}`}
        initial={reduce ? { opacity: 0 } : { clipPath: HIDDEN[reveal] }}
        whileInView={reduce ? { opacity: 1 } : { clipPath: SHOWN }}
        viewport={VIEWPORT}
        transition={{ duration: reduce ? 0.4 : 1.2, ease: EASE_OUT, delay }}
      >
        <div className="size-full transition-transform duration-700 ease-(--ease-out-strong) group-hover:scale-[1.04]">
          <motion.div
            className="size-full"
            initial={reduce ? false : { scale: 1.35 }}
            whileInView={reduce ? undefined : { scale: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.6, ease: EASE_OUT, delay }}
          >
            <motion.div className="absolute inset-x-0 -top-[12%] h-[124%]" style={reduce || !depth ? undefined : { y }}>
              <img
                src={src}
                alt={alt}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                className="size-full object-cover"
                style={focus ? { objectPosition: focus } : undefined}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.figure>
      {caption && (
        <motion.p
          className={`mt-3 flex items-baseline gap-2 text-xs leading-snug ${dark ? "text-paper/60" : "text-ink-soft"}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: delay + 0.5 }}
        >
          {fig !== undefined && <span className="font-serif text-sm italic">fig. {fig}</span>}
          <span>{caption}</span>
        </motion.p>
      )}
    </div>
  )
}
