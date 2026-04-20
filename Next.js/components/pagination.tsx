"use client"

import { appConstants, cn } from "@/utils"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

type PaginationProps = {
  numberOfPages: number
}

export function Pagination(props: PaginationProps) {
  const { numberOfPages } = props
  const content = useTranslations("moviesList")
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const pageNum = params.get(appConstants.PAGINATION_PARAM) || 1

  const onPageChange = (pageNum: number) => {
    const newPage = pageNum > 0 ? pageNum.toString() : "1"
    router.push(
      pathname + "?" + createQueryString(appConstants.PAGINATION_PARAM, newPage)
    )
  }

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const newParams = new URLSearchParams(params.toString())
      newParams.set(name, value)

      return newParams.toString()
    },
    [params]
  )

  const pages = Array.from({ length: numberOfPages }, (_, i) => i + 1)
  return (
    <div className="flex items-center justify-start gap-4">
      <button
        className="font-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-opacity-60"
        disabled={+pageNum === 1}
        onClick={() => {
          onPageChange(+pageNum - 1)
        }}
      >
        {content("prev")}
      </button>

      <div className="flex max-w-[24rem] items-center gap-2 overflow-auto">
        {pages.map((num) => {
          if (num <= 5) {
            return (
              <PageBlock
                pageNum={num}
                onClick={(num) => {
                  onPageChange(num)
                }}
                isSelected={num === +pageNum}
                key={`${num}`}
              />
            )
          }

          if (num >= 6 && num <= numberOfPages - 2) {
            if (num === +pageNum) {
              return (
                <PageBlock
                  pageNum={num}
                  onClick={(num) => {
                    onPageChange(num)
                  }}
                  isSelected={num === +pageNum}
                  key={`${num}`}
                />
              )
            }

            if (num < 10) {
              return (
                <div key={`${num}`} className="h-1 w-1 rounded-full bg-white" />
              )
            }
          }

          if (num > numberOfPages - 2) {
            return (
              <PageBlock
                pageNum={num}
                onClick={(num) => {
                  onPageChange(num)
                }}
                isSelected={num === +pageNum}
                key={`${num}`}
              />
            )
          }
        })}
      </div>

      <button
        disabled={+pageNum === numberOfPages}
        onClick={() => {
          onPageChange(+pageNum + 1)
        }}
        className="font-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-opacity-60"
      >
        {content("next")}
      </button>
    </div>
  )
}

function PageBlock({
  pageNum,
  onClick,
  isSelected,
}: {
  pageNum: number
  isSelected: boolean
  onClick: (pageNum: number) => void
}) {
  const clsnm = cn(
    "h-8 min-w-8 rounded-sm text-white font-bold px-1",
    isSelected ? "bg-primary" : "bg-card"
  )
  return (
    <button className={clsnm} onClick={() => onClick(pageNum)}>
      {pageNum}
    </button>
  )
}
