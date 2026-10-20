import { animate, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react"

/** Il pulsante segue un po' il cursore e torna al centro con una molla. Solo con mouse. */
export function Magnetic({ children, strength = 0.3, className = "inline-flex" }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion()
  const spring = { stiffness: 220, damping: 16, mass: 0.4 }
  const x = useSpring(0, spring)
  const y = useSpring(0, spring)

  if (reduce) return <span className={className}>{children}</span>

  const move = (e: PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== "mouse") return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span className={className} style={{ x, y }} onPointerMove={move} onPointerLeave={reset}>
      {children}
    </motion.span>
  )
}

/** Numero che conta fino al valore quando entra in vista. */
export function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(reduce ? to : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, to, { duration: 1.6, ease: [0.23, 1, 0.32, 1], delay: 0.6, onUpdate: setValue })
    return () => controls.stop()
  }, [inView, reduce, to])

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString("it-IT", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}

/** Due righe di testo che scorrono in versi opposti, guidate dallo scroll (non partono da sole). */
export function ScrollMarquee({ big, small, dark }: { big: string[]; small: string[]; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-30%"])
  const x2 = useTransform(scrollYProgress, [0, 1], ["-30%", reduce ? "-30%" : "0%"])
  const repeat = <T,>(a: T[]) => [...a, ...a, ...a]

  return (
    <div ref={ref} aria-hidden className={`overflow-hidden py-16 select-none sm:py-24 ${dark ? "text-paper" : "text-ink"}`}>
      <motion.div style={{ x: x1 }} className="flex items-center gap-8 whitespace-nowrap">
        {repeat(big).map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="type-display text-[clamp(4rem,12vw,11rem)] leading-none">{w}</span>
            <i className="ri-asterisk text-[clamp(2rem,4vw,3.5rem)] text-crimson" />
          </span>
        ))}
      </motion.div>
      <motion.div style={{ x: x2 }} className="mt-2 flex items-center gap-10 whitespace-nowrap">
        {repeat(small).map((w, i) => (
          <span key={i} className={`font-serif text-[clamp(1.75rem,4vw,3.25rem)] italic ${dark ? "text-paper/60" : "text-ink-soft"}`}>
            {w}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
