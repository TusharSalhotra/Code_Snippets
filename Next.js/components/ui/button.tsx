import { cn } from "@/utils"
import Link from "next/link"
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react"

type ButtonProps = {
  variant?: "primary" | "secondary"
  link?: string
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  React.PropsWithChildren
export function Button(props: ButtonProps) {
  const { link, variant, children, ...other } = props
  const styles = [
    "h-3xl px-4 rounded-lg font-semibold flex items-center justify-center",
    other.className,
  ]

  switch (variant) {
    case "secondary":
      styles.push("text-white border border-white")
      break
    case "primary":
    default:
      styles.push("bg-primary text-white")
      break
  }

  if (!!link) {
    return (
      <Link href={link} className={cn(styles)}>
        {children}
      </Link>
    )
  }

  return (
    <button {...other} className={cn(styles)}>
      {children}
    </button>
  )
}
