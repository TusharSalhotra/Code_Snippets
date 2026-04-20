export interface IMovie {
  _id?: string
  title: string
  publishingYear: number
  poster: string | File
  isDeleted: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IMoviesResponse {
  movies: IMovie[]
  totalItems: number
  currentPage: number
  limit: number
  totalPages: number
}

export enum ApiState {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
  IDLE = "idle",
}
