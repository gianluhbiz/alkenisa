import { Link } from "react-router"
import { site } from "../data/site"

export function Footer() {
  return (
    <footer className="bg-ink pb-36 text-paper/70 sm:pb-10">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 pt-16 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="type-display text-7xl leading-[0.8] text-paper">
            <span className="font-serif font-normal normal-case italic">Al</span> Kenisa
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            Il nome viene dall'arabo <em className="font-serif text-base text-paper">al-kanīsa</em>, la chiesa. Un caffè letterario dentro una chiesa sconsacrata, nel centro di Enna.
          </p>
        </div>

        <div className="text-sm leading-relaxed md:col-span-3">
          <p className="mb-3 text-xs tracking-[0.2em] text-paper/40 uppercase">Dove</p>
          <p>{site.address}</p>
          <p>{site.city}</p>
          <a href={site.maps} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-paper underline-offset-4 hover:underline">
            Indicazioni <i className="ri-arrow-right-up-line" aria-hidden />
          </a>
        </div>

        <div className="text-sm leading-relaxed md:col-span-2">
          <p className="mb-3 text-xs tracking-[0.2em] text-paper/40 uppercase">Contatti</p>
          <a href={site.phone.href} className="block hover:text-paper">{site.phone.label}</a>
          <a href={site.landline.href} className="block hover:text-paper">{site.landline.label}</a>
          <a href={`mailto:${site.email}`} className="block hover:text-paper">{site.email}</a>
        </div>

        <div className="text-sm leading-relaxed md:col-span-2">
          <p className="mb-3 text-xs tracking-[0.2em] text-paper/40 uppercase">Altrove</p>
          <Link to="/menu" className="block hover:text-paper">Menu</Link>
          <a href={site.facebook} target="_blank" rel="noreferrer" className="block hover:text-paper">Facebook</a>
          <a href={site.tripadvisor} target="_blank" rel="noreferrer" className="block hover:text-paper">TripAdvisor</a>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1440px] flex-col gap-3 border-t border-paper/10 px-4 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} {site.fullName} · Via Roma 481, Enna</p>
        <p>
          Developed and Designed by{" "}
          <a href="https://gianluh.dev" target="_blank" rel="noreferrer" className="font-bold text-paper underline underline-offset-2">
            Gianluca De Maio<i className="ri-external-link-line ml-0.5" />
          </a>
        </p>
      </div>
    </footer>
  )
}
