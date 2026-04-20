"use client"

import { Button } from "@/components/ui"

export default function ErrorPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <h2 className="text-h2 text-white">Something went wrong</h2>
      <h2 className="text-base text-white">
        Oops! Looks like some error occured. Please try again
      </h2>
      <Button link="/">Go to Home</Button>
    </div>
  )
}
