"use client"

import * as Yup from "yup"
import { toast } from "react-hot-toast"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { yupResolver } from "@hookform/resolvers/yup"

import { Button, DropImage, Input, Select } from "./ui"
import { IMovie } from "@/types/movies"
import { postRequest, updateRequest } from "@/utils/api-client"
import { getOptionsTillYear } from "@/utils"
import { useTranslations } from "next-intl"

// Fields
enum Fields {
  TITLE = "title",
  YEAR = "publishingYear",
  IMAGE = "poster",
}

// Form Type
export type MovieFormFields = {
  [Fields.TITLE]: string
  [Fields.YEAR]: string
  [Fields.IMAGE]: File | string
}

// Form Schema
const movieFormSchema = Yup.object().shape({
  [Fields.TITLE]: Yup.string()
    .required("Title is required")
    .min(2, "Title must be at least 2 characters long")
    .max(100, "Title must be at most 100 characters long"),
  [Fields.YEAR]: Yup.string()
    .required("Year is required")
    .matches(/^[0-9]{4}$/, "Year must be a 4-digit number"),
  [Fields.IMAGE]: Yup.mixed<File | string>()
    .required("Poster Image is required")
    .test("fileSize", "File is too large", (value) => {
      if (typeof value === "string") {
        return true
      }

      console.log("Validation Schema - ", "Passed")
      if (value instanceof File) {
        return value && value.size <= 1024 * 1024 // 1MB
      }
      return false
    })
    .test("fileType", "Unsupported File Format", (value) => {
      if (typeof value === "string") {
        return true
      }

      return (
        value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
      )
    }),
})

type MovieFormProps = {
  movie?: IMovie
}
export function MovieForm({ movie }: MovieFormProps) {
  const isEdit = !!movie
  const content = useTranslations("movieForm")
  const router = useRouter()
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MovieFormFields>({
    resolver: yupResolver(movieFormSchema),
    defaultValues: {
      [Fields.TITLE]: movie?.title || "",
      [Fields.IMAGE]: movie?.poster || undefined,
      [Fields.YEAR]: movie?.publishingYear?.toString() || "",
    },
  })

  const onSubmit = (data: MovieFormFields) => {
    if (movie) {
      onMovieEdit({
        ...movie,
        title: data[Fields.TITLE],
        publishingYear: +data[Fields.YEAR],
        poster: data[Fields.IMAGE],
      })
    } else {
      onMovieCreate({
        title: data[Fields.TITLE],
        publishingYear: +data[Fields.YEAR],
        poster: data[Fields.IMAGE],
      })
    }
  }

  const onMovieEdit = async (movie: Partial<IMovie>) => {
    try {
      const formData = new FormData()
      if (typeof movie.poster === "string") {
        formData.append("file_url", movie.poster as string)
      } else {
        formData.append("file", movie.poster as File)
      }

      formData.append("title", movie.title as string)
      formData.append(
        "publishingYear",
        movie.publishingYear?.toString() as string
      )

      await updateRequest(`/movies?id=${movie._id}`, formData, {
        "Content-Type": "multipart/form-data; boundary=12345",
      })
      toast.success("Movie Updated successfully!")
      router.push("/")
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
  }

  const onMovieCreate = async (movie: Partial<IMovie>) => {
    try {
      const formData = new FormData()
      formData.append("file", movie.poster as File)
      formData.append("title", movie.title as string)
      formData.append(
        "publishingYear",
        movie.publishingYear?.toString() as string
      )

      await postRequest("/movies", formData, {
        "Content-Type": "multipart/form-data; boundary=12345",
      })
      toast.success("Movie Created successfully!")
      router.push("/")
      reset()
    } catch (e: any) {
      toast.error(e.response.data.message)
    }
  }

  const dropImgJsx = (
    <DropImage
      image={getValues(Fields.IMAGE)}
      error={errors[Fields.IMAGE]?.message}
      onImageChange={(image) => {
        setValue(Fields.IMAGE, image as File, {
          shouldValidate: true,
        })
      }}
    />
  )

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-12 md:grid-cols-2"
    >
      <h2 className="mb-12 text-h2 font-semibold text-white md:col-span-2">
        {isEdit ? content("editTitle") : content("addTitle")}
      </h2>

      <div className="hidden min-h-96 md:inline-block">{dropImgJsx}</div>

      <div className="flex flex-col gap-6 md:items-start">
        <Input
          placeholder={content("form.name")}
          containerStyles="w-full"
          error={errors[Fields.TITLE]?.message}
          name={Fields.TITLE}
          disabled={isSubmitting}
          register={register}
        />
        <Select
          options={[
            { label: content("form.year"), value: "" },
            ...getOptionsTillYear(),
          ]}
          containerStyles="w-full md:w-auto"
          error={errors[Fields.YEAR]?.message}
          name={Fields.YEAR}
          disabled={isSubmitting}
          register={register}
        />

        <div className="min-h-96 md:hidden">{dropImgJsx}</div>

        <div className="mt-10 flex gap-4">
          <Button
            type="button"
            variant="secondary"
            className="w-full md:w-48"
            disabled={isSubmitting}
            onClick={() => router.back()}
          >
            {content("form.cancel")}
          </Button>
          <Button
            type="submit"
            className="w-full md:w-48"
            disabled={isSubmitting}
          >
            {isSubmitting ? content("form.submitting") : content("form.submit")}
          </Button>
        </div>
      </div>
    </form>
  )
}
