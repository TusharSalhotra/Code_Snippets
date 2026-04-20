"use client"

import {
  EmptyState,
  MovieCard,
  MovieCardSkelton,
  Pagination,
} from "@/components"
import { LoadingUI } from "@/components/loading-ui"
import { ApiState, IMovie, IMoviesResponse } from "@/types/movies"
import { appConstants } from "@/utils"
import { getRequest } from "@/utils/api-client"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function AppListPage({ searchParams }: PageProps) {
  const page = (searchParams[appConstants.PAGINATION_PARAM] as string) || "1"
  const [movies, setMovies] = useState<IMovie[]>([])
  const [getMoviesState, setGetMoviesState] = useState<ApiState>(
    ApiState.LOADING
  )
  const [pages, setPages] = useState<number>(+page ?? 1)

  useEffect(() => {
    const getMovies = async () => {
      try {
        setGetMoviesState(ApiState.LOADING)
        const moviesRes = await getRequest<IMoviesResponse>(
          `/movies?page=${page}`
        )
        if (moviesRes.status === 200 && moviesRes.data.movies) {
          setMovies(moviesRes.data.movies)
          setPages(moviesRes.data.totalPages)
          setGetMoviesState(ApiState.SUCCESS)
        }
      } catch (e: any) {
        toast.error(e.response.data.message)
      }
    }

    getMovies()
    return () => setGetMoviesState(ApiState.IDLE)
  }, [page])

  if (getMoviesState === ApiState.LOADING) {
    return (
      <LoadingUI>
        {[1, 2, 3, 4].map((k) => {
          return <MovieCardSkelton key={k} />
        })}
      </LoadingUI>
    )
  }

  return (
    <div className="mt-20 flex flex-1 flex-col">
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-8 md:grid-cols-3 xl:grid-cols-4">
          {movies.map((i) => (
            <MovieCard key={i.title} {...i} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {movies.length > 0 && (
        <div className="mx-auto mt-10">
          <Pagination numberOfPages={pages} />
        </div>
      )}
    </div>
  )
}
