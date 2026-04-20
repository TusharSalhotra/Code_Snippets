import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Cookie helpers
export function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=${value}`
}

export function getCookie(name: string) {
  if (typeof document === "undefined") return
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
  return null
}

export function deleteCookie(name: string) {
  const cookies = document.cookie.split(";")

  cookies.forEach((cookie) => {
    const eqPos = cookie.indexOf("=")
    const cookieName =
      eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
    if (cookieName === name) {
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    }
  })
}

// Options foryear helper
export function getOptionsTillYear() {
  const currentYear = new Date().getFullYear()
  const years = []

  for (let year = 1900; year <= currentYear; year++) {
    years.unshift({ label: year.toString(), value: year.toString() })
  }

  return years
}

export const appConstants = {
  PAGINATION_PARAM: "page",
  AUTH_COOKIE: "authorization",
  LOCALE_COOKIE: "locale",
  DEFAULT_LOCALE: "en",
}
