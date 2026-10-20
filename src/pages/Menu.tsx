import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router"
import { Footer } from "../components/Footer"
import { Magnetic } from "../components/Motion"
import { Photo } from "../components/Photo"
import { MaskedLines, Reveal } from "../components/Reveal"
import { menu, site } from "../data/site"
import { EASE_IN_OUT } from "../lib/motion"

const wrap = "mx-auto max-w-[1440px] px-4 sm:px-8"
const pad = (n: number) => String(n + 1).padStart(2, "0")

function useActiveCategory() {
  const [active, setActive] = useState(menu[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: "-35% 0px -60% 0px" },
    )
    menu.forEach((c) => {
      const el = document.getElementById(c.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return active
}

export default function Menu() {
  const active = useActiveCategory()
  const current = menu.find((c) => c.id === active) ?? menu[0]
  const chips = useRef<HTMLDivElement>(null)

  // tiene visibile il chip attivo nella barra mobile, senza muovere la pagina
  useEffect(() => {
    const bar = chips.current
    const chip = bar?.querySelector<HTMLElement>(`[data-id="${active}"]`)
    if (bar && chip) bar.scrollTo({ left: chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" })
  }, [active])

  return (
    <>
      <section className={`${wrap} pt-28 pb-12 sm:pt-32`}>
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-3 text-xs tracking-[0.22em] text-ink-soft uppercase">
              <span className="h-px w-8 bg-crimson" />
              Al Kenisa · Via Roma 481
            </p>
            <h1 className="mt-6 type-display text-[clamp(5.5rem,19vw,14rem)] leading-[0.78]">
              <MaskedLines
                animateOnMount
                delay={0.75}
                lines={[
                  <span key="la" className="font-serif text-[0.8em] font-normal normal-case italic">
                    La
                  </span>,
                  "carta",
                ]}
              />
            </h1>
          </div>
          <Reveal delay={0.9} className="lg:col-span-5 lg:pb-4">
            <p className="font-serif text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.02]">Dal tè delle quattro all'ultimo calice dell'una.</p>
            <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
              Si ordina al banco, davanti all'altare. Allergie o intolleranze? Chiedi allo staff: ti diciamo cosa c'è dentro ogni piatto.
            </p>
          </Reveal>
        </div>
      </section>

      {/* indice mobile */}
      <div className="sticky top-16 z-20 border-y border-ink/10 bg-paper/90 backdrop-blur-md lg:hidden">
        <div ref={chips} className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-8">
          {menu.map((c) => (
            <a
              key={c.id}
              data-id={c.id}
              href={`#${c.id}`}
              className={`inline-flex h-10 shrink-0 items-center rounded-full px-4 text-sm whitespace-nowrap transition-colors duration-200 ${
                c.id === active ? "bg-ink text-paper" : "bg-ink/5 text-ink-soft"
              }`}
            >
              {c.title}
            </a>
          ))}
        </div>
      </div>

      <div className={`${wrap} grid gap-12 pb-24 lg:grid-cols-12`}>
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-24">
            <div className="relative aspect-[4/5] overflow-hidden bg-stone/30">
              <AnimatePresence initial={false}>
                <motion.img
                  key={current.photo}
                  src={current.photo}
                  alt={current.photoAlt}
                  className="absolute inset-0 size-full object-cover"
                  initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.15, zIndex: 1 }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1, zIndex: 1 }}
                  exit={{ zIndex: 0, transition: { duration: 0.7 } }}
                  transition={{ duration: 0.7, ease: EASE_IN_OUT }}
                />
              </AnimatePresence>
            </div>

            <nav aria-label="Sezioni del menu" className="mt-6">
              <ol className="grid grid-cols-2 gap-x-4">
                {menu.map((c, i) => {
                  const on = c.id === active
                  return (
                    <li key={c.id}>
                      <a href={`#${c.id}`} className={`group flex items-baseline gap-2 py-1.5 transition-colors duration-200 ${on ? "text-crimson" : "text-ink-soft hover:text-ink"}`}>
                        <span className="font-serif text-sm italic">{pad(i)}</span>
                        <span className="type-display text-xl">{c.title}</span>
                      </a>
                    </li>
                  )
                })}
              </ol>
            </nav>
          </div>
        </aside>

        <div className="lg:col-span-7 lg:col-start-6">
          {menu.map((c, i) => (
            <section key={c.id} id={c.id} className="scroll-mt-36 border-t border-ink/15 pt-8 pb-14 lg:scroll-mt-24">
              <Reveal>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-serif text-2xl text-crimson italic">{pad(i)}</span>
                  <span className="text-xs tracking-[0.2em] text-ink-soft uppercase">{c.kicker}</span>
                </div>
                <h2 className="mt-3 type-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.82]">{c.title}</h2>
              </Reveal>

              <Photo src={c.photo} alt={c.photoAlt} frame="aspect-[16/10]" className="mt-6 lg:hidden" reveal={i % 2 ? "right" : "left"} />

              <ul className="mt-8 space-y-5">
                {c.items.map((item) => (
                  <li key={item.name} className="group">
                    <Reveal className="flex items-baseline gap-3">
                      <div className="min-w-0 transition-transform duration-300 ease-(--ease-out-strong) group-hover:translate-x-1.5">
                        <p className="text-lg leading-tight font-semibold sm:text-xl">{item.name}</p>
                        {item.note && <p className="mt-1 text-sm text-ink-soft">{item.note}</p>}
                      </div>
                      <span aria-hidden className="mb-1.5 min-w-6 flex-1 self-end border-b border-dotted border-ink/30 transition-colors duration-300 group-hover:border-crimson" />
                      <span className="shrink-0 text-lg font-semibold tabular-nums transition-colors duration-300 group-hover:text-crimson sm:text-xl">
                        <span className="sr-only">Prezzo: </span>€ {item.price}
                      </span>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <p className="border-t border-ink/15 pt-6 text-sm leading-relaxed text-ink-soft">
            Prezzi in euro, IVA inclusa. Carta e disponibilità possono cambiare con le stagioni.
          </p>
        </div>
      </div>

      <section className="bg-paper-2">
        <div className={`${wrap} grid items-center gap-10 py-24 lg:grid-cols-12`}>
          <div className="lg:col-span-7">
            <p className="type-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.82]">
              Hai già scelto?
              <br />
              <span className="font-serif font-normal text-crimson normal-case italic">Tieniti un tavolo.</span>
            </p>
            <p className="mt-5 max-w-md text-ink-soft">Dal martedì alla domenica, dalle 15:00 all'una. Nelle sere di concerto la navata si riempie presto.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <Magnetic>
              <a
                href={site.phone.href}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-crimson px-6 text-sm font-medium text-paper transition-[background-color,transform] duration-200 hover:bg-crimson-deep active:scale-[0.97]"
              >
                <i className="ri-phone-line" aria-hidden />
                Prenota un tavolo
              </a>
            </Magnetic>
            <Link
              to="/"
              className="group inline-flex h-12 items-center gap-2 rounded-full border border-ink/25 px-6 text-sm font-medium transition-[background-color,transform] duration-200 hover:bg-ink/5 active:scale-[0.97]"
            >
              <i className="ri-arrow-left-line transition-transform duration-200 group-hover:-translate-x-0.5" aria-hidden />
              Torna in chiesa
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
