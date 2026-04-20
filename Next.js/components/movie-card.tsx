import { IMovie } from "@/types/movies"
import Image from "next/image"
import Link from "next/link"

export function MovieCard(movie: IMovie) {
  return (
    <>
      <Link
        href={`/movies/edit/${movie._id}`}
        className="group flex min-h-[23rem] cursor-pointer flex-col rounded-xl bg-card pb-4 hover:bg-card/55 sm:px-2 sm:pt-2 md:min-h-[30rem]"
      >
        <div className="relative flex-1 rounded-[inherit]">
          <Image
            src={movie.poster as string}
            fill
            alt="movie-name"
            className="rounded-[inherit]"
          />
        </div>

        <div className="mt-4 flex flex-col gap-2 px-2">
          <h6 className="text-h5 font-medium text-white group-hover:font-semibold">
            {movie.title}
          </h6>
          <div className="flex justify-between">
            <p className="text-sm text-white">{movie.publishingYear}</p>
            <Image src={"/icons/edit.svg"} height={24} width={24} alt="Edit" />
          </div>
        </div>
      </Link>
    </>
  )
}

export function MovieCardSkelton() {
  return (
    <>
      <div className="min-h-[23rem] animate-pulse rounded-xl bg-card pb-4 sm:px-2 sm:pt-2 md:min-h-[30rem]" />
    </>
  )
}
