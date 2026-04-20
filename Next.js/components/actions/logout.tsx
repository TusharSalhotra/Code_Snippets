"use client"

import Image from "next/image"
import { appConstants, deleteCookie } from "@/utils"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

export function LogoutAction() {
  const contentNav = useTranslations("logout")
  const { replace } = useRouter()
  const logout = () => {
    deleteCookie(appConstants.AUTH_COOKIE)
    replace("/signin")
  }
  return (
    <button
      onClick={logout}
      className="flex gap-sm text-base font-semibold text-white"
    >
      <span className="hidden md:inline-block">{contentNav("title")}</span>
      <Image src={"/icons/logout.svg"} alt="logout" height={24} width={24} />
    </button>
  )
}
