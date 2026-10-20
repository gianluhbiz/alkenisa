import { useSyncExternalStore } from "react"

/** Tono della pagina sotto la navbar: chiaro (carta) o scuro (serate, cripta). */
export type Tone = "light" | "dark"

let tone: Tone = "light"
const listeners = new Set<() => void>()

export function setTone(next: Tone) {
  if (next === tone) return
  tone = next
  listeners.forEach((l) => l())
}

export function useTone() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => tone,
  )
}
