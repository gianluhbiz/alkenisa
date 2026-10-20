import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion"
import { useState } from "react"
import { Link, useLocation } from "react-router"
import { site } from "../data/site"
import { useOpenStatus } from "../hooks/useOpenStatus"
import { EASE_OUT } from "../lib/motion"
import { useTone } from "../lib/tone"
import { Magnetic } from "./Motion"

export function StatusDot({ open }: { open: boolean }) {
  return (
    <span className="relative flex size-2" aria-hidden>
      {open && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60 motion-reduce:hidden" />}
      <span className={`relative size-2 rounded-full ${open ? "bg-emerald-500" : "bg-stone"}`} />
    </span>
  )
}

export function Nav() {
  const { pathname } = useLocation()
  const tone = useTone()
  const status = useOpenStatus()
  const dark = tone === "dark" && pathname === "/"
  const onMenu = pathname === "/menu"

  // in home la barra si toglie di mezzo quando scendi e torna appena risali
  const { scrollY, scrollYProgress } = useScroll()
  const [tucked, setTucked] = useState(false)
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0
    if (y <= 400) setTucked(false)
    else if (y > prev + 2) setTucked(true)
    else if (y < prev - 2) setTucked(false)
  })
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

  return (
    <motion.header
      initial={false}
      animate={{ transform: tucked && !onMenu ? "translateY(-100%)" : "translateY(0%)" }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className={`fixed inset-x-0 top-0 z-40 border-b backdrop-blur-md transition-colors duration-500 ${
        dark ? "border-paper/10 bg-crypt/70 text-paper" : "border-ink/10 bg-paper/75 text-ink"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-8">
        <Link to="/" className="flex items-baseline gap-1 leading-none" aria-label="Al Kenisa, torna alla home">
          <span className="font-serif text-2xl italic">Al</span>
          <span className="type-display text-2xl">Kenisa</span>
        </Link>

        <p className={`hidden items-center gap-2 text-xs tracking-[0.18em] uppercase md:flex ${dark ? "text-paper/70" : "text-ink-soft"}`}>
          <StatusDot open={status.open} />
          {status.label}
        </p>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to={onMenu ? "/" : "/menu"}
            className={`group inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-[background-color,transform] duration-200 active:scale-[0.97] ${
              dark ? "hover:bg-paper/10" : "hover:bg-ink/5"
            }`}
          >
            {onMenu ? (
              <>
                <i className="ri-arrow-left-line transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden />
                La chiesa
              </>
            ) : (
              <>
                <i className="ri-book-open-line" aria-hidden />
                Menu
              </>
            )}
          </Link>
          <Magnetic strength={0.2} className="hidden sm:inline-flex">
            <a
              href={site.phone.href}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-crimson px-5 text-sm font-medium text-paper transition-[background-color,transform] duration-200 hover:bg-crimson-deep active:scale-[0.97]"
            >
              <i className="ri-phone-line" aria-hidden />
              Prenota un tavolo
            </a>
          </Magnetic>
        </div>
      </nav>
      <motion.div aria-hidden className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-crimson" style={{ scaleX: progress }} />
    </motion.header>
  )
}

/** Barra fissa in basso su mobile: le due azioni che contano. */
export function MobileBar() {
  const { pathname } = useLocation()
  const status = useOpenStatus()

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/90 px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden">
      <p className="mb-2 flex items-center justify-center gap-2 text-[11px] tracking-[0.16em] text-ink-soft uppercase">
        <StatusDot open={status.open} />
        {status.label}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <a
          href={site.phone.href}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-crimson text-sm font-medium text-paper transition-transform duration-150 active:scale-[0.97]"
        >
          <i className="ri-phone-line" aria-hidden />
          Prenota
        </a>
        {pathname === "/menu" ? (
          <a
            href={site.maps}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink/20 text-sm font-medium transition-transform duration-150 active:scale-[0.97]"
          >
            <i className="ri-map-pin-line" aria-hidden />
            Indicazioni
          </a>
        ) : (
          <Link
            to="/menu"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink/20 text-sm font-medium transition-transform duration-150 active:scale-[0.97]"
          >
            <i className="ri-book-open-line" aria-hidden />
            Il menu
          </Link>
        )}
      </div>
    </div>
  )
}
