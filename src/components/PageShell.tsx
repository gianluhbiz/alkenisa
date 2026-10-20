import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"
import { EASE_IN_OUT, EASE_OUT } from "../lib/motion"

/**
 * Cambio pagina come un sipario d'inchiostro:
 * in uscita sale dal basso e copre, in entrata mostra il titolo del capitolo e si ritira verso l'alto.
 */
export function PageShell({ children, title }: { children: ReactNode; title: string }) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
        {children}
      </motion.main>
    )
  }

  return (
    <>
      <motion.main
        initial={{ opacity: 0, transform: "translateY(40px)" }}
        animate={{ opacity: 1, transform: "translateY(0px)", transition: { duration: 0.9, ease: EASE_OUT, delay: 0.35 } }}
        exit={{ opacity: 0.6, transform: "translateY(-40px)", transition: { duration: 0.5, ease: EASE_IN_OUT } }}
      >
        {children}
      </motion.main>

      {/* sipario in entrata */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-ink"
        initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
        animate={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.7, ease: EASE_IN_OUT, delay: 0.3 } }}
        exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0 } }}
      >
        <span className="overflow-hidden">
          <motion.span
            className="block type-display text-7xl text-paper sm:text-[10rem]"
            initial={{ transform: "translateY(100%)" }}
            animate={{ transform: "translateY(0%)", transition: { duration: 0.45, ease: EASE_OUT } }}
          >
            {title}
          </motion.span>
        </span>
      </motion.div>

      {/* sipario in uscita */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 bg-ink"
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={{ clipPath: "inset(100% 0% 0% 0%)" }}
        exit={{ clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.5, ease: EASE_IN_OUT } }}
      />
    </>
  )
}
