"use client"
import { useTranslations } from "next-intl"
import { Button } from "./ui"

export function EmptyState() {
  const content = useTranslations("moviesList")
  return (
    <div className="my-auto flex flex-col items-center gap-4 self-center">
      <h1 className="text-center text-h2 font-semibold text-white">
        {content("empty")}
      </h1>
      <Button link="movies/create" className="w-full sm:w-auto">
        {content("emaptyAction")}
      </Button>
    </div>
  )
}
