"use client"
import { useRouter } from "next/navigation"
import { appConstants, cn, getCookie, setCookie } from "@/utils"
import Image from "next/image"

const languages = [
  {
    label: "icons/british.svg",
    value: "en",
  },
  {
    label: "icons/france.svg",
    value: "fr",
  },
  {
    label: "icons/spanish.svg",
    value: "sp",
  },
]

export function LanguageSwitcher() {
  const router = useRouter()
  const selectedLanguage =
    getCookie(appConstants.LOCALE_COOKIE) || appConstants.DEFAULT_LOCALE
  return (
    <div className="absolute right-6 top-6 flex gap-6">
      {languages.map((l) => {
        return (
          <div
            key={l.value}
            className={cn(
              `cursor-pointer p-1 hover:bg-white`,
              selectedLanguage === l.value ? "bg-white" : ""
            )}
          >
            <Image
              key={l.value}
              priority
              onClick={(e) => {
                setCookie(appConstants.LOCALE_COOKIE, l.value)
                router.refresh()
              }}
              src={l.label}
              height={24}
              width={24}
              alt={l.value}
            />
          </div>
        )
      })}
    </div>
  )
}
