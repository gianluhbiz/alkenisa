import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { Link } from "react-router"
import { Footer } from "../components/Footer"
import { CountUp, Magnetic, ScrollMarquee } from "../components/Motion"
import { Photo } from "../components/Photo"
import { MaskedLines, Reveal } from "../components/Reveal"
import { hours, quotes, site } from "../data/site"
import { EASE_IN_OUT } from "../lib/motion"
import { setTone, useTone } from "../lib/tone"

const wrap = "mx-auto max-w-[1440px] px-4 sm:px-8 lg:pl-28"

const stations = [
  { id: "soglia", num: "I", title: "La soglia" },
  { id: "navata", num: "II", title: "La navata" },
  { id: "altare", num: "III", title: "L'altare" },
  { id: "serate", num: "IV", title: "Le serate" },
  { id: "cripta", num: "V", title: "La cripta" },
  { id: "colophon", num: "VI", title: "Colophon" },
] as const

type StationId = (typeof stations)[number]["id"]
type ActiveId = StationId | "top"
const DARK: StationId[] = ["serate", "cripta"]

function useActiveStation() {
  const [active, setActive] = useState<ActiveId | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as ActiveId)
      },
      { rootMargin: "-45% 0px -54% 0px" },
    )
    const hero = document.getElementById("top")
    if (hero) observer.observe(hero)
    stations.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setTone(active && active !== "top" && DARK.includes(active) ? "dark" : "light")
  }, [active])

  return active
}

/* ------------------------------------------------------------------ */

export default function Home() {
  const active = useActiveStation()

  return (
    <>
      <Rail active={active} />
      <Hero />
      <Contents />
      <Soglia />
      <Navata />
      <ScrollMarquee
        big={["Libri", "Vino", "Concerti", "Cripta"]}
        small={["il tè delle quattro", "lo spritz delle sette", "il concerto delle dieci", "l'ultimo calice all'una"]}
      />
      <Altare />
      <Serate />
      <Cripta />
      <Colophon />
      <Footer />
    </>
  )
}

/* ------------------------------------------------------------------ */

function Rail({ active }: { active: ActiveId | null }) {
  const dark = useTone() === "dark"
  const visible = active !== null && active !== "top"

  // portal: il <main> animato ha un transform che romperebbe position: fixed
  return createPortal(
    <motion.nav
      aria-label="Stazioni del percorso"
      className="fixed top-1/2 left-6 z-30 hidden -translate-y-1/2 lg:block"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <ol className="flex flex-col gap-1">
        {stations.map((s) => {
          const on = s.id === active
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`group flex h-9 items-center gap-3 transition-colors duration-300 ${
                  on ? (dark ? "text-moss" : "text-crimson") : dark ? "text-paper/35 hover:text-paper/80" : "text-ink/30 hover:text-ink/70"
                }`}
              >
                <span className="w-7 text-right font-serif text-base italic">{s.num}</span>
                <span
                  className={`h-px transition-[width] duration-300 ease-(--ease-out-strong) ${on ? "w-8" : "w-3 group-hover:w-5"} ${
                    on ? "bg-current" : "bg-current/60"
                  }`}
                />
                <span
                  className="rounded-sm bg-paper/90 px-1.5 py-0.5 text-[11px] tracking-[0.18em] whitespace-nowrap text-ink uppercase opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                >
                  {s.title}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </motion.nav>,
    document.body,
  )
}

function StationHeader({
  num,
  place,
  title,
  dark,
  accent,
  compact,
}: {
  num: string
  place: string
  title: ReactNode
  dark?: boolean
  accent?: string
  /** per colonne strette */
  compact?: boolean
}) {
  return (
    <header>
      <Reveal>
        <div className={`flex items-baseline gap-4 border-t pt-4 ${dark ? "border-paper/15" : "border-ink/15"}`}>
          <span className={`font-serif text-3xl italic ${accent ?? (dark ? "text-moss" : "text-crimson")}`}>{num}</span>
          <span className={`text-xs tracking-[0.2em] uppercase ${dark ? "text-paper/55" : "text-ink-soft"}`}>{place}</span>
        </div>
      </Reveal>
      <h2 className={`mt-6 type-display leading-[0.8] ${compact ? "text-[clamp(3.75rem,16vw,7rem)] lg:text-[clamp(3rem,7.5vw,7rem)]" : "text-[clamp(3.75rem,11vw,10rem)]"}`}>
        <MaskedLines lines={[title]} />
      </h2>
    </header>
  )
}

function Quote({ q, dark, className = "" }: { q: { text: string; author: string; where: string }; dark?: boolean; className?: string }) {
  return (
    <Reveal className={className}>
      <figure>
        <blockquote className="font-serif text-3xl leading-[1.1] italic sm:text-4xl">
          <span className={dark ? "text-moss" : "text-crimson"}>“</span>
          {q.text}
          <span className={dark ? "text-moss" : "text-crimson"}>”</span>
        </blockquote>
        <figcaption className={`mt-3 text-xs tracking-[0.16em] uppercase ${dark ? "text-paper/50" : "text-ink-soft"}`}>
          {q.author} · {q.where}
        </figcaption>
      </figure>
    </Reveal>
  )
}

function CTAButton({ href, to, children, variant = "solid", dark }: { href?: string; to?: string; children: ReactNode; variant?: "solid" | "line"; dark?: boolean }) {
  const cls =
    variant === "solid"
      ? "bg-crimson text-paper hover:bg-crimson-deep"
      : dark
        ? "border border-paper/30 text-paper hover:bg-paper/10"
        : "border border-ink/25 text-ink hover:bg-ink/5"
  const base = `group inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium transition-[background-color,transform] duration-200 active:scale-[0.97] ${cls}`
  if (to)
    return (
      <Magnetic>
        <Link to={to} className={base}>
          {children}
        </Link>
      </Magnetic>
    )
  const external = href?.startsWith("http")
  return (
    <Magnetic>
      <a href={href} className={base} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {children}
      </a>
    </Magnetic>
  )
}

/* ------------------------------------------------------------------ */

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  // tre piani che scorrono a velocità diverse
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"])
  // in % della propria altezza, così su mobile si muovono meno
  const backY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-6%"])
  const frontY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-55%"])
  const topY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-110%"])

  return (
    <section ref={ref} id="top" className={`${wrap} relative pt-24 pb-16 sm:pt-28 lg:min-h-svh lg:pb-24`}>
      <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 lg:pb-10">
          <motion.p
            className="flex items-center gap-3 text-xs tracking-[0.22em] text-ink-soft uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="h-px w-8 bg-crimson" />
            Caffè letterario · Enna
          </motion.p>

          <motion.h1 style={{ y: titleY }} className="mt-6 type-display text-[clamp(5.5rem,24vw,13rem)] leading-[0.78] lg:text-[clamp(5.5rem,14.5vw,13rem)]">
            <MaskedLines
              animateOnMount
              delay={0.15}
              lines={[
                <span key="al" className="font-serif text-[0.8em] font-normal normal-case italic">
                  Al
                </span>,
                "Kenisa",
              ]}
            />
          </motion.h1>

          <Reveal delay={0.45}>
            <p className="mt-8 max-w-xl font-serif text-[clamp(2rem,3.6vw,3rem)] leading-[1.02]">
              Libri, vino e concerti dentro una chiesa sconsacrata.
            </p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink-soft">
              Entri da Via Roma, ordini davanti all'altare barocco e, se lo chiedi allo staff, scendi a vedere la cripta. Dal martedì alla domenica, dalle 15:00 all'una.
            </p>
          </Reveal>

          <Reveal delay={0.6} className="mt-8 flex flex-wrap gap-3">
            <CTAButton href={site.phone.href}>
              <i className="ri-phone-line" aria-hidden />
              Prenota un tavolo
            </CTAButton>
            <CTAButton to="/menu" variant="line">
              Sfoglia il menu
              <i className="ri-arrow-right-line transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </CTAButton>
          </Reveal>

          <Reveal delay={0.75} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-soft">
            <a href={site.tripadvisor} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-ink">
              <span className="flex text-crimson" aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                  <i key={i} className="ri-star-fill" />
                ))}
                <i className="ri-star-half-fill" />
              </span>
              <span>
                <strong className="font-semibold text-ink">
                  <CountUp to={4.3} decimals={1} />
                </strong> su TripAdvisor · {site.rating.reviews} recensioni
              </span>
            </a>
            <span>
              <strong className="font-semibold text-ink">
                <CountUp to={94} suffix="%" />
              </strong> lo consiglia su Facebook
            </span>
          </Reveal>
        </div>

        <div className="relative lg:col-span-6">
          <motion.div style={{ y: backY }}>
            <Photo
              src="/photos/navata-notte.jpg"
              alt="La navata di Al Kenisa di sera, con l'altare barocco illuminato e la scultura di carta sospesa"
              frame="aspect-[3/4] rounded-t-full"
              className="ml-auto w-[82%] sm:w-[70%] lg:w-[78%]"
              priority
              delay={0.2}
            />
          </motion.div>
          <motion.div style={{ y: frontY }} className="absolute bottom-[-4%] left-0 z-10 w-[42%] sm:w-[34%] lg:w-[40%]">
            <Photo
              src="/photos/porta-aperta.jpg"
              alt="Il portone d'ingresso aperto sul cortile, con gli stendardi rossi di Al Kenisa"
              frame="aspect-square"
              priority
              reveal="up"
              delay={0.55}
            />
          </motion.div>
          <motion.div style={{ y: topY }} className="absolute top-[18%] left-[6%] hidden w-[24%] sm:block lg:left-[-2%]">
            <Photo
              src="/photos/gin-tonic.jpg"
              alt="Un gin tonic con limone su un tavolo di Al Kenisa"
              frame="aspect-[3/4]"
              priority
              reveal="left"
              delay={0.75}
              depth={0}
            />
          </motion.div>
          <p className="absolute top-8 right-0 hidden font-serif text-base italic tracking-[0.3em] text-ink-soft uppercase [writing-mode:vertical-rl] sm:block lg:-right-6">
            al-kanīsa · la chiesa
          </p>
        </div>
      </div>
    </section>
  )
}

function Contents() {
  return (
    <section aria-label="Indice" className={`${wrap} pb-24`}>
      <Reveal>
        <div className="border-y border-ink/15 py-6">
          <p className="mb-4 text-xs tracking-[0.22em] text-ink-soft uppercase">Indice del percorso</p>
          <ol className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 lg:grid-cols-6">
            {stations.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="group flex items-baseline gap-2 py-1.5">
                  <span className="font-serif text-lg text-crimson italic">{s.num}</span>
                  <span className="type-display text-2xl transition-colors duration-200 group-hover:text-crimson">{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  )
}

/* ---------------------------- I. La soglia --------------------------- */

function Soglia() {
  return (
    <section id="soglia" className={`${wrap} scroll-mt-20 pb-32`}>
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <StationHeader num="I" place="Via Roma 481" title="La soglia" compact />
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-sm text-lg leading-relaxed text-ink-soft">
                Un portone di legno su Via Roma, due stendardi rossi e un cortile di ciottoli con le piante in vaso. Quando il tempo lo permette, i tavolini escono nel cortile.
              </p>
              <a
                href={site.maps}
                target="_blank"
                rel="noreferrer"
                className="group mt-6 inline-flex items-center gap-2 border-b border-ink/30 pb-1 text-sm font-medium transition-colors hover:border-crimson hover:text-crimson"
              >
                <i className="ri-map-pin-2-line" aria-hidden />
                Portami in Via Roma 481
                <i className="ri-arrow-right-up-line transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </a>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-8 gap-4 sm:gap-6 lg:col-span-8">
          <Photo
            src="/photos/portale-notte.jpg"
            reveal="left"
            alt="L'ingresso di Al Kenisa di notte, con il portale illuminato su Via Roma"
            frame="aspect-[4/3]"
            className="col-span-8"
            caption="Via Roma, dopo cena"
            fig={1}
          />
          <Photo
            src="/photos/insegna.jpg"
            reveal="up"
            alt="Gli stendardi rossi con il nome Al Kenisa accanto al portone"
            frame="aspect-[3/4]"
            className="col-span-4 sm:col-span-3"
            caption="Gli stendardi"
            fig={2}
          />
          <Photo
            src="/photos/cortile.jpg"
            reveal="right"
            alt="Il cortile di ciottoli con piante e ombrelloni"
            frame="aspect-[4/3]"
            className="col-span-4 mt-16 sm:col-span-5 sm:mt-24"
            caption="Il cortile, di giorno"
            fig={3}
          />
          <Photo
            src="/photos/cortile-sera.jpg"
            alt="Un tavolino nel cortile al tramonto, con un caffè e una piantina"
            frame="aspect-[3/4]"
            className="col-span-6 col-start-2 sm:col-span-4 sm:col-start-3"
            caption="Lo stesso cortile, al tramonto"
            fig={4}
          />
        </div>
      </div>
    </section>
  )
}

/* ---------------------------- II. La navata -------------------------- */

const notes = [
  { n: 1, x: "47%", y: "38%", text: "L'altare barocco, illuminato dal basso. Di sera è la luce principale della sala." },
  { n: 2, x: "86%", y: "62%", text: "Il bancone e il frigo dei vini: si ordina qui, si porta al tavolo." },
  { n: 3, x: "24%", y: "74%", text: "I tavolini bianchi al posto dei banchi. Si legge, si chiacchiera, si resta." },
]

function Navata() {
  const [note, setNote] = useState<number | null>(null)

  return (
    <section id="navata" className="scroll-mt-20 pb-32">
      <div className={wrap}>
        <StationHeader num="II" place="Libri, tavolini, una scultura di carta" title="La navata" />

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="relative lg:col-span-8">
            <Photo
              src="/photos/navata-altare.jpg"
              alt="La navata di Al Kenisa con l'altare barocco in fondo, i tavolini bianchi e il bancone"
              frame="aspect-[1200/830]"
            />
            {notes.map((m) => (
              <button
                key={m.n}
                type="button"
                onMouseEnter={() => setNote(m.n)}
                onMouseLeave={() => setNote(null)}
                onFocus={() => setNote(m.n)}
                onBlur={() => setNote(null)}
                onClick={() => setNote(note === m.n ? null : m.n)}
                aria-label={`Nota ${m.n}`}
                className={`absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-serif text-xl italic transition-[background-color,color,transform] duration-200 active:scale-95 ${
                  note === m.n ? "scale-110 bg-crimson text-paper" : "bg-paper/90 text-ink"
                }`}
                style={{ left: m.x, top: m.y }}
              >
                {m.n}
              </button>
            ))}
          </div>

          <aside className="lg:col-span-4">
            <p className="mb-6 text-xs tracking-[0.2em] text-ink-soft uppercase">Note a margine</p>
            <ol className="space-y-6">
              {notes.map((m) => (
                <li
                  key={m.n}
                  onMouseEnter={() => setNote(m.n)}
                  onMouseLeave={() => setNote(null)}
                  className={`flex gap-4 border-l-2 pl-4 transition-[border-color,opacity] duration-300 ${
                    note === null ? "border-ink/15" : note === m.n ? "border-crimson" : "border-ink/10 opacity-40"
                  }`}
                >
                  <span className="font-serif text-2xl text-crimson italic">{m.n}</span>
                  <p className="leading-relaxed">{m.text}</p>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-12">
          <div className="col-span-2 lg:col-span-4 lg:pr-6">
            <Reveal>
              <p className="text-lg leading-relaxed text-ink-soft">
                Gli scaffali corrono lungo le pareti: guide, romanzi, saggi. Li prendi, li sfogli al tavolo e, se uno non riesci a lasciarlo, lo compri al banco.
              </p>
            </Reveal>
            <Quote q={quotes.salotti} className="mt-10" />
          </div>
          <Photo
            src="/photos/sala-libri.jpg"
            reveal="up"
            alt="La sala con gli scaffali bianchi pieni di libri"
            frame="aspect-[3/4]"
            className="lg:col-span-4"
            caption="Gli scaffali"
            fig={5}
          />
          <Photo
            src="/photos/ingresso-sera.jpg"
            reveal="right"
            alt="La sala vista dall'ingresso, di sera, con i tavolini e le lampade accese"
            frame="aspect-[3/4]"
            className="lg:col-span-4 lg:-mt-40"
            caption="La sala vista dall'ingresso"
            fig={6}
          />
          <Photo
            src="/photos/navata-scultura.jpg"
            reveal="left"
            alt="La scultura di carta sospesa sotto la volta della navata"
            frame="aspect-[3/4]"
            className="lg:col-span-5 lg:col-start-2"
            caption="La scultura di carta sotto la volta"
            fig={7}
          />
          <Photo
            src="/photos/lampada-libri.jpg"
            alt="Una lampada da lettura accesa su un tavolo con libri"
            frame="aspect-[3/4]"
            className="lg:col-span-4 lg:col-start-8 lg:mt-32"
            caption="Le lampade da lettura"
            fig={8}
          />
        </div>
      </div>
    </section>
  )
}

/* ---------------------------- III. L'altare -------------------------- */

const firstOrder = [
  { img: "/photos/gin-tonic.jpg", alt: "Un gin tonic con limone sul tavolo", title: "Un gin tonic", text: "Al banco o al tavolo, sotto l'altare." },
  { img: "/photos/aperitivo.jpg", alt: "Spritz con noccioline e patatine", title: "Lo spritz delle sette", text: "Con noccioline e patatine. Il tavolo si riempie da solo." },
  { img: "/photos/lurisia.jpg", alt: "Bottiglie di chinotto e gazzosa Lurisia", title: "Chinotto Lurisia", text: "Per chi guida e per chi torna a casa a piedi su per Enna." },
]

function Altare() {
  return (
    <section id="altare" className="scroll-mt-20 bg-paper-2 pt-28 pb-32">
      <div className={`${wrap} grid gap-12 lg:grid-cols-12`}>
        <Photo
          src="/photos/altare-verticale.jpg"
          alt="L'altare barocco con il logo di Al Kenisa al centro"
          frame="aspect-[3/4] rounded-t-full"
          className="lg:col-span-5"
          caption="L'altare, rimasto al suo posto"
          fig={9}
        />

        <div className="lg:col-span-7 lg:pl-8">
          <StationHeader num="III" place="Il banco, davanti all'altare" title="L'altare" />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink-soft">
              Colonne, stucchi e la nicchia sono quelli di sempre. Davanti adesso si ordina: caffè e tè nel pomeriggio, cocktail e vini siciliani dopo il tramonto, birre artigianali fino all'una.
            </p>
          </Reveal>

          <p className="mt-14 mb-5 text-xs tracking-[0.2em] text-ink-soft uppercase">Da ordinare la prima volta</p>
          <ul className="divide-y divide-ink/15 border-y border-ink/15">
            {firstOrder.map((o, i) => (
              <li key={o.title}>
                <Reveal delay={i * 0.06} className="flex items-center gap-5 py-4">
                  <img src={o.img} alt={o.alt} loading="lazy" className="size-20 shrink-0 object-cover sm:size-24" />
                  <div>
                    <p className="type-display text-3xl">{o.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{o.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal className="mt-10 flex flex-wrap items-center gap-4">
            <CTAButton to="/menu">
              Leggi tutta la carta
              <i className="ri-arrow-right-line transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </CTAButton>
            <Quote q={quotes.miller} className="mt-6 w-full" />
          </Reveal>
        </div>
      </div>

      <div className={`${wrap} mt-24 grid grid-cols-12 gap-4 sm:gap-6`}>
        <Photo
          src="/photos/bancone.jpg"
          reveal="up"
          alt="Il bancone con la macchina del caffè e le bottiglie"
          frame="aspect-[3/4]"
          className="col-span-5 lg:col-span-3"
          caption="Il bancone"
          fig={10}
        />
        <Photo
          src="/photos/altare-dettaglio.jpg"
          reveal="right"
          alt="Dettaglio dell'altare barocco con le colonne in pietra"
          frame="aspect-[16/9]"
          className="col-span-7 self-end lg:col-span-9"
          caption="Colonne e stucchi dell'altare barocco"
          fig={11}
        />
      </div>
    </section>
  )
}

/* ---------------------------- IV. Le serate -------------------------- */

const evenings = [
  {
    title: "Concerti dal vivo",
    img: "/photos/concerto.jpg",
    alt: "Un duo di pianoforte e tromba suona davanti all'altare",
    text: "Pianoforte, jazz, cantautori. Nella navata hanno suonato artisti arrivati da Australia, Svezia e Stati Uniti.",
  },
  {
    title: "Presentazioni di libri",
    img: "/photos/presentazione.jpg",
    alt: "Il pubblico ai tavolini durante una presentazione di un libro",
    text: "L'autore seduto davanti all'altare, il pubblico tra i tavolini. Dopo si resta a parlarne con un calice.",
  },
  {
    title: "Incontri e letture",
    img: "/photos/presentazione-2.jpg",
    alt: "Un incontro con il pubblico seduto in cerchio",
    text: "Circoli di lettura, società di storia patria, serate a tema sulla Sicilia.",
  },
  {
    title: "Feste e dj set",
    img: "/photos/serata-pubblico.jpg",
    alt: "La navata piena di gente durante una serata",
    text: "Halloween, Natale, i sabati d'inverno: le sere in cui la navata si riempie.",
  },
]

function Serate() {
  const [i, setI] = useState(0)

  return (
    <section id="serate" className="scroll-mt-20 bg-cellar pt-28 pb-32 text-paper">
      <div className={wrap}>
        <StationHeader num="IV" place="Dopo le 21:00" title="Le serate" dark />

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <ol className="lg:col-span-7">
            {evenings.map((e, idx) => (
              <li key={e.title} className="border-b border-paper/15 first:border-t">
                <button
                  type="button"
                  onMouseEnter={() => setI(idx)}
                  onFocus={() => setI(idx)}
                  onClick={() => setI(idx)}
                  className="group flex w-full items-baseline gap-5 py-6 text-left"
                >
                  <span className={`font-serif text-xl italic transition-colors duration-300 ${i === idx ? "text-moss" : "text-paper/40"}`}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 transition-transform duration-300 ease-(--ease-out-strong) group-hover:translate-x-2">
                    <span
                      className={`block type-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.88] transition-colors duration-300 ${
                        i === idx ? "text-paper" : "text-paper/45 group-hover:text-paper/80"
                      }`}
                    >
                      {e.title}
                    </span>
                    <span
                      className={`mt-3 block max-w-md text-sm leading-relaxed text-paper/65 transition-opacity duration-300 ${
                        i === idx ? "lg:opacity-100" : "lg:opacity-0"
                      }`}
                    >
                      {e.text}
                    </span>
                  </span>
                </button>
                <img src={e.img} alt={e.alt} loading="lazy" className="mb-6 aspect-[4/3] w-full object-cover lg:hidden" />
              </li>
            ))}
          </ol>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28 aspect-[4/5] overflow-hidden bg-paper/5">
              <AnimatePresence initial={false}>
                <motion.img
                  key={evenings[i].img}
                  src={evenings[i].img}
                  alt={evenings[i].alt}
                  className="absolute inset-0 size-full object-cover"
                  initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.15, zIndex: 1 }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1, zIndex: 1 }}
                  exit={{ zIndex: 0, transition: { duration: 0.7 } }}
                  transition={{ duration: 0.7, ease: EASE_IN_OUT }}
                />
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-12">
          <Quote q={quotes.serate} dark className="lg:col-span-6" />
          <Reveal className="lg:col-span-6 lg:justify-self-end">
            <p className="max-w-sm text-paper/65">Il calendario delle serate lo trovi sulla pagina Facebook.</p>
            <div className="mt-5">
              <CTAButton href={site.facebook} variant="line" dark>
                <i className="ri-facebook-circle-line" aria-hidden />
                Vedi il programma
              </CTAButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------- V. La cripta --------------------------- */

function Cripta() {
  return (
    <section id="cripta" className="relative scroll-mt-20 overflow-x-clip bg-crypt pt-28 pb-0 text-paper">
      <div className={wrap}>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <StationHeader num="V" place="Un piano sotto la navata" title="La cripta" dark />
          </div>
          <Reveal delay={0.1} className="self-end lg:col-span-5 lg:col-start-8">
            <p className="text-lg leading-relaxed text-paper/70">
              Sotto il pavimento della chiesa c'è la cripta: gradini consumati, sedili scavati nella pietra lungo le pareti, una luce verde che arriva dal basso. Chiedi al banco: qualcuno dello staff ti accompagna giù.
            </p>
          </Reveal>
        </div>

        {/* scalinata: ogni foto scende di un gradino verso destra */}
        <div className="relative mt-20 grid grid-cols-12 gap-4 sm:gap-6">
          <Photo
            src="/photos/cripta-scale.jpg"
            reveal="up"
            alt="I gradini di pietra che scendono nella cripta, illuminati di verde"
            frame="aspect-[3/4]"
            className="col-span-7 sm:col-span-4 sm:col-start-1 sm:row-start-1"
            caption="Il primo gradino"
            fig={12}
            dark
          />
          <Photo
            src="/photos/cripta-verde.jpg"
            reveal="up"
            alt="Le nicchie scavate nella pietra lungo la parete della cripta"
            frame="aspect-[4/3]"
            className="col-span-8 col-start-5 -mt-10 sm:col-span-5 sm:col-start-5 sm:row-start-1 sm:mt-40 lg:mt-56"
            caption="I sedili di pietra"
            fig={13}
            dark
          />
          <Photo
            src="/photos/cripta-sedili.jpg"
            reveal="up"
            alt="Scorcio della cripta con i sedili e la scala"
            frame="aspect-[3/4]"
            className="col-span-6 col-start-2 sm:col-span-3 sm:col-start-10 sm:row-start-1 sm:mt-80 lg:mt-[28rem]"
            caption="Più in basso"
            fig={14}
            dark
          />
        </div>

        <div className="mt-20 grid grid-cols-12 gap-4 sm:gap-6 lg:-mt-24">
          <Quote q={quotes.cripta} dark className="col-span-12 sm:col-span-6 lg:col-span-5" />
        </div>

        <div className="mt-16 grid grid-cols-12 gap-4 sm:gap-6">
          <Photo
            src="/photos/cripta-luce.jpg"
            reveal="left"
            alt="La cripta illuminata da una luce calda"
            frame="aspect-square"
            className="col-span-6 lg:col-span-3"
            dark
          />
          <Photo
            src="/photos/cripta-buio.jpg"
            reveal="window"
            alt="Un passaggio buio della cripta con i sedili di pietra"
            frame="aspect-[4/3]"
            className="col-span-6 mt-12 lg:col-span-4 lg:mt-24"
            dark
          />
          <Photo
            src="/photos/cripta-pietra.jpg"
            reveal="right"
            alt="La pietra viva della cripta, illuminata da una torcia"
            frame="aspect-[16/9]"
            className="col-span-12 lg:col-span-5 lg:mt-48"
            dark
          />
        </div>
      </div>

      <CryptDescent />
    </section>
  )
}

/** Finale della cripta: la foto parte come una finestrella e si apre a tutto schermo mentre scorri. */
function CryptDescent() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const clip = useTransform(scrollYProgress, [0, 0.55], ["inset(22% 30% 22% 30% round 40px)", "inset(0% 0% 0% 0% round 0px)"])
  const scale = useTransform(scrollYProgress, [0, 0.6], [1.3, 1])
  const shade = useTransform(scrollYProgress, [0.3, 0.7], [0.1, 0.6])
  const hint = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const textOpacity = useTransform(scrollYProgress, [0.5, 0.72], [0, 1])
  const textY = useTransform(scrollYProgress, [0.5, 0.72], [60, 0])
  const textEvents = useTransform(textOpacity, (v) => (v > 0.6 ? "auto" : "none"))

  return (
    <div ref={ref} className={reduce ? "relative mt-24" : "relative mt-24 h-[260svh]"}>
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div className="absolute inset-0" style={reduce ? undefined : { clipPath: clip }}>
          <motion.img
            src="/photos/cripta-corridoio.jpg"
            alt="Il corridoio della cripta con i sedili di pietra, in luce verde"
            loading="lazy"
            className="size-full object-cover"
            style={reduce ? undefined : { scale }}
          />
          <motion.div className="absolute inset-0 bg-crypt" style={{ opacity: reduce ? 0.6 : shade }} />
        </motion.div>

        {!reduce && (
          <motion.p
            style={{ opacity: hint }}
            className="absolute inset-x-0 bottom-36 flex flex-col items-center gap-2 sm:bottom-10 text-xs tracking-[0.22em] text-paper/60 uppercase"
          >
            Scorri per scendere
            <i className="ri-arrow-down-line text-base" aria-hidden />
          </motion.p>
        )}

        <motion.div
          style={reduce ? undefined : { opacity: textOpacity, y: textY, pointerEvents: textEvents }}
          className={`${wrap} relative flex h-full flex-col items-start justify-center`}
        >
          <p className="type-display text-[clamp(3.25rem,10vw,9rem)] leading-[0.8]">
            Stasera
            <br />
            <span className="font-serif font-normal text-moss normal-case italic">scendi anche tu.</span>
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <CTAButton href={site.phone.href}>
              <i className="ri-phone-line" aria-hidden />
              Prenota un tavolo
            </CTAButton>
            <CTAButton to="/menu" variant="line" dark>
              Sfoglia il menu
            </CTAButton>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ---------------------------- VI. Colophon --------------------------- */

function romeWeekday() {
  const d = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", weekday: "short" }).format(new Date())
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(d)
}

function Colophon() {
  const today = romeWeekday()

  return (
    <section id="colophon" className={`${wrap} scroll-mt-20 pt-28 pb-32`}>
      <StationHeader num="VI" place="Orari, contatti, come arrivare" title="Colophon" />

      <div className="mt-16 grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="font-serif text-[clamp(2.1rem,3.6vw,3.25rem)] leading-[1.02]">
              Ti aspettiamo dal martedì alla domenica, dalle 15:00 all'una di notte.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-3">
            <CTAButton href={site.phone.href}>
              <i className="ri-phone-line" aria-hidden />
              Chiama {site.phone.label}
            </CTAButton>
            <CTAButton href={site.maps} variant="line">
              <i className="ri-direction-line" aria-hidden />
              Indicazioni
            </CTAButton>
          </Reveal>
          <Photo
            src="/photos/facciata.jpg"
            reveal="left"
            alt="La facciata in pietra della chiesa con il portone e gli stendardi"
            frame="aspect-[16/9]"
            className="mt-14"
            caption="Via Roma 481, Enna"
            fig={15}
          />
        </div>

        <div className="grid gap-12 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="mb-5 text-xs tracking-[0.2em] text-ink-soft uppercase">Orari</p>
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {hours.map((h, i) => (
                <li key={h.day} className={`flex justify-between py-3 text-sm ${i === today ? "font-semibold text-ink" : h.closed ? "text-ink-soft/70" : "text-ink-soft"}`}>
                  <span className="flex items-center gap-2">
                    {i === today && <span className="size-1.5 rounded-full bg-crimson" aria-hidden />}
                    {h.day}
                    {i === today && <span className="sr-only">(oggi)</span>}
                  </span>
                  <span className="tabular-nums">{h.time}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08} className="space-y-8 text-sm">
            <div>
              <p className="mb-3 text-xs tracking-[0.2em] text-ink-soft uppercase">Indirizzo</p>
              <p className="type-display text-3xl leading-[0.95]">
                {site.address}
                <br />
                {site.city}
              </p>
              <p className="mt-2 leading-relaxed text-ink-soft">In centro, a due passi dal Duomo e dal Museo Alessi.</p>
            </div>
            <div>
              <p className="mb-3 text-xs tracking-[0.2em] text-ink-soft uppercase">Telefono</p>
              <a href={site.phone.href} className="block type-display text-3xl hover:text-crimson">{site.phone.label}</a>
              <a href={site.landline.href} className="block text-ink-soft hover:text-crimson">{site.landline.label}</a>
            </div>
            <div>
              <p className="mb-3 text-xs tracking-[0.2em] text-ink-soft uppercase">Scrivici</p>
              <a href={`mailto:${site.email}`} className="hover:text-crimson">{site.email}</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
