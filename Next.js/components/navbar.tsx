"use client"

import { useTranslations } from "next-intl"
import { LogoutAction } from "./actions"
import { AddIconAction } from "./icon-actions"
import { LanguageSwitcher } from "./actions/lang-switcher"

export function AppNavbar() {
  const content = useTranslations("moviesList")
  return (
    <div className="flex items-center justify-between">
      <h2 className="flex items-baseline gap-x-4 text-nowrap text-h3 font-semibold text-white md:text-h2">
        <span>{content("title")}</span>
        <AddIconAction link={"movies/create"} />
      </h2>

      <LogoutAction />
    </div>
  )
}
