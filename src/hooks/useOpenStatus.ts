import { useEffect, useState } from "react"

type Status = { open: boolean; label: string }

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function romeNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date())
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ""
  return { day: DAYS.indexOf(get("weekday")), minutes: Number(get("hour")) * 60 + Number(get("minute")) }
}

/** Lunedì chiuso. Mar - Dom 15:00 - 01:00 (la notte sfora nel giorno dopo). */
export function getStatus(): Status {
  const { day, minutes } = romeNow()
  const OPEN = 15 * 60
  const CLOSE = 60

  if (minutes < CLOSE && day !== 2) return { open: true, label: "Aperto ora · fino all'1:00" }
  if (day === 1) return { open: false, label: "Lunedì chiuso · martedì dalle 15:00" }
  if (minutes >= OPEN) return { open: true, label: "Aperto ora · fino all'1:00" }
  return { open: false, label: "Oggi apre alle 15:00" }
}

export function useOpenStatus() {
  const [status, setStatus] = useState(getStatus)

  useEffect(() => {
    const id = window.setInterval(() => setStatus(getStatus()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return status
}
