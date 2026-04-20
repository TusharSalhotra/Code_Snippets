import "@/styles/globals.css"
import Image from "next/image"
import type { Metadata } from "next"
import { Toaster } from "react-hot-toast"
import { Montserrat } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { LanguageSwitcher } from "@/components/actions"

const font = Montserrat({ subsets: ["latin"], weight: ["400", "600", "800"] })

export const metadata: Metadata = {
  title: "Movies List",
  description: "My List of Movies",
  icons: "/icons/favicon.ico",
}

export default async function RootLayout({
  children,
}: React.PropsWithChildren) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body
        className={`${font.className} relative flex min-h-screen flex-col bg-bg px-4 md:px-0`}
      >
        <NextIntlClientProvider messages={messages}>
          <>
            {children}

            <Image
              priority
              src={"/images/bg.png"}
              alt="background"
              fill
              className="bottom-0 left-0 right-0 top-[unset!important] -z-10 h-[8rem_!important] md:h-[15rem_!important]"
            />
            <Toaster />

            <LanguageSwitcher />
          </>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
