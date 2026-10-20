import { motion, useReducedMotion } from "framer-motion"
import { Fragment, type ReactNode } from "react"
import { EASE_OUT, VIEWPORT } from "../lib/motion"

/** Entrata leggera per blocchi di testo: opacità + 14px di salita. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, transform: reduce ? "none" : "translateY(14px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  )
}

const CHAR_STAGGER = 0.028

/** Lettere che salgono da dietro una maschera, con una leggera rotazione. Le parole restano intere. */
function SplitChars({ text, delay, reduce }: { text: string; delay: number; reduce: boolean | null }) {
  let index = 0
  return (
    <>
      {text.split(" ").map((word, w, words) => (
        <Fragment key={w}>
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((ch) => {
              const d = delay + index++ * CHAR_STAGGER
              return (
                <motion.span
                  key={index}
                  className="inline-block origin-bottom-left"
                  variants={{
                    hide: reduce ? { opacity: 0 } : { transform: "translateY(110%) rotate(8deg)" },
                    show: reduce ? { opacity: 1 } : { transform: "translateY(0%) rotate(0deg)" },
                  }}
                  transition={{ duration: 0.9, ease: EASE_OUT, delay: d }}
                >
                  {ch}
                </motion.span>
              )
            })}
          </span>
          {/* lo spazio sta fuori dallo span inline-block, altrimenti il browser lo elimina */}
          {w < words.length - 1 && " "}
        </Fragment>
      ))}
    </>
  )
}

/** Titolo che sale da dietro una maschera: le stringhe lettera per lettera, gli altri nodi riga per riga. */
export function MaskedLines({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  animateOnMount = false,
}: {
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  delay?: number
  animateOnMount?: boolean
}) {
  const reduce = useReducedMotion()
  const trigger = animateOnMount ? { animate: "show" } : { whileInView: "show", viewport: VIEWPORT }

  return (
    <motion.span className={`block ${className}`} initial="hide" {...trigger}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          {typeof line === "string" ? (
            <span className={`block ${lineClassName}`}>
              <SplitChars text={line} delay={delay + i * 0.12} reduce={reduce} />
            </span>
          ) : (
            <motion.span
              className={`block ${lineClassName}`}
              variants={{
                hide: { transform: reduce ? "translateY(0%)" : "translateY(105%)", opacity: reduce ? 0 : 1 },
                show: { transform: "translateY(0%)", opacity: 1 },
              }}
              transition={{ duration: 1, ease: EASE_OUT, delay: delay + i * 0.12 }}
            >
              {line}
            </motion.span>
          )}
        </span>
      ))}
    </motion.span>
  )
}
