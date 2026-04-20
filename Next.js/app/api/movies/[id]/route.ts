import Movies from "@/models/movies"
import SendResponse from "@/utils/response"
import { RESPONSE_MESSAGES } from "@/utils/responseMessages"
import StatusCodes from "@/utils/statusCodeEnum"
import { IPARAMS } from "@/utils/types"

/**
 * Get movie
 * @param req @NextRequest
 * @returns @IMovie
 */
export const GET = async (req: Request, { params }: IPARAMS) => {
  try {
    // getting id form params
    const id = params.id
    // find movie from id
    const movie = await Movies.findById(id)
    // if not found movie
    if (!movie) {
      return SendResponse(
        { message: RESPONSE_MESSAGES.MOVIES.MOVIE_NOT_FOUND },
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    }
    // returning  movie
    return SendResponse(movie, StatusCodes.OK)
  } catch (error) {
    return SendResponse(
      { message: RESPONSE_MESSAGES.MOVIES.MOVIE_NOT_FOUND },
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}
