import { cn } from "@/utils"
import Image from "next/image"
import Link from "next/link"
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react"

type AddIconActionProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  height?: number
  width?: number
  link?: string
}

export function AddIconAction(props: AddIconActionProps) {
  const { link, ...other } = props

  if (!!link) {
    return (
      <Link
        href={link}
        className={cn(other.className, "relative", `h-5 w-5 md:h-8 md:w-8`)}
      >
        <Image src={"/icons/add-icon.svg"} alt="add-icon" fill />
      </Link>
    )
  }
  return (
    <button
      {...other}
      className={cn(other.className, "relative", `h-5 w-5 md:h-8 md:w-8`)}
    >
      <Image src={"/icons/add-icon.svg"} alt="add-icon" fill />
    </button>
  )
}
