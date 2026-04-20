"use client"

import { cn } from "@/utils"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { ChangeEvent } from "react"

type DropImageProps = {
  image: string | File
  error?: string
  onImageChange: (image: File | undefined) => void
}
export function DropImage({ image, error, onImageChange }: DropImageProps) {
  const content = useTranslations("movieForm")
  const onImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 0) {
      return
    }

    onImageChange(e.target.files?.[0])
  }

  const imageUrl =
    image && typeof image !== "string" ? URL.createObjectURL(image) : image
  console.log({ imageUrl, image })

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      className={cn(
        "relative flex h-full flex-col items-center justify-center rounded-lg border border-dashed bg-input ",
        error ? "border-error text-error" : "border-white text-white"
      )}
    >
      {imageUrl?.length > 0 ? (
        <>
          <Image
            src={imageUrl}
            fill
            alt="add-image"
            className="rounded-[inherit]"
          />

          <button
            onClick={() => onImageChange(undefined)}
            className="relative -top-4 left-4 mb-auto h-8 w-8 self-end rounded-full bg-error p-1"
          >
            <Image
              src={"/icons/cancel.svg"}
              fill
              alt="cancel-image"
              className="tint-red"
            />
          </button>
        </>
      ) : (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={onImageSelect}
            className="absolute inset-0 opacity-0"
          />

          <div className="flex flex-col items-center gap-1">
            <Image
              src={"/icons/file.svg"}
              width={"16"}
              height={"16"}
              alt="add-image"
            />
            <p className="text-sm ">{content("form.Imagetext")}</p>
          </div>
        </>
      )}

      <p className="absolute -bottom-8 left-0 text-error">{error}</p>
    </div>
  )
}
