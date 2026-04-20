"use client"

import { MovieCardSkelton, MovieForm } from "@/components"
import { LoadingUI } from "@/components/loading-ui"
import { ApiState, IMovie } from "@/types/movies"
import { getRequest } from "@/utils/api-client"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

export default function EditMovie({ params }: { params: { id: string } }) {
  const movieId = params.id
  const [movie, setMovie] = useState<IMovie | undefined>(undefined)
  const [getMovieState, setGetMovieState] = useState<ApiState>(ApiState.LOADING)

  useEffect(() => {
    if (!movieId) return
    const getMovieById = async () => {
      try {
        setGetMovieState(ApiState.LOADING)
        const movRes = await getRequest<IMovie>(`/movies/${movieId}`)
        if (movRes.data._id) {
          setMovie(movRes.data)
          setGetMovieState(ApiState.SUCCESS)
        }
      } catch (e: any) {
        toast.error(e.response.data.message)
        setGetMovieState(ApiState.ERROR)
      }
    }

    getMovieById()
    return () => setGetMovieState(ApiState.IDLE)
  }, [movieId])

  if (getMovieState === ApiState.LOADING) {
    return (
      <LoadingUI>
        <div className="col-span-2 min-h-[20rem] animate-pulse rounded-xl bg-card pb-4 sm:px-2 sm:pt-2 md:min-h-[24rem]" />
        <div className="col-span-2 min-h-[10rem] animate-pulse rounded-xl bg-card pb-4 sm:px-2 sm:pt-2 md:min-h-[12rem]" />
      </LoadingUI>
    )
  }

  if (getMovieState === ApiState.ERROR) {
    throw new Error("Oops! Looks Like No Such movie Exists")
  }
  return <MovieForm movie={movie} />
}
