import "@/database/connection"
import Movies from "@/models/movies"
import SendResponse from "@/utils/response"
import { RESPONSE_MESSAGES } from "@/utils/responseMessages"
import StatusCodes from "@/utils/statusCodeEnum"
import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import * as fs from "fs"
import { IFILE } from "@/utils/types"
import { movieSchema, updateMovieSchema } from "./validation"
import { zodMessageHandler } from "@/utils/common"

/**
 * Create movie
 * @param req @NextRequest
 * @returns @IMovies
 */

export const POST = async (req: NextRequest) => {
  try {
    // storing payload from form data
    const formData = await req.formData()

    // storing file
    const file = formData.get("file") as unknown as IFILE

    // storing title
    const title = formData.get("title")

    // storing publishingYear
    const publishingYear = formData.get("publishingYear")

    // making payload
    const body = {
      title: title ? title : undefined,
      publishingYear: publishingYear ? +publishingYear : undefined,
      file: file ? file : undefined,
    }

    // validating payload
    const response = movieSchema.safeParse(body)

    // if get error
    if (!response.success) {
      // custom message for validation error
      const message = zodMessageHandler(response?.error?.issues)
      return SendResponse({ message }, StatusCodes.BAD_REQUEST)
    }
    // declaring a variable
    let imageUrl

    // if getting file
    if (file) {
      // Convert the file's ArrayBuffer to a Node.js Buffer
      const buffer = Buffer.from(await file.arrayBuffer())

      // Get the filename from the file object
      const filename = file.name

      // Construct the URL path where the image will be stored
      imageUrl = process.env.IMAGE_PATH + filename

      // Define the directory path where the file will be uploaded
      const uploadDir = path.join(process.cwd(), "public", "uploads")

      // Check if the upload directory exists
      if (!fs.existsSync(uploadDir)) {
        // If it doesn't exist, create the directory
        fs.mkdirSync(uploadDir, { recursive: true })
      }
      await writeFile(uploadDir + "/" + filename, buffer)
    }

    // making payload for update
    const payload = {
      poster: imageUrl ?? null,
      publishingYear,
      title,
    }

    // saving movies
    const movies = await Movies.create(payload)

    return SendResponse(movies, StatusCodes.OK)
  } catch (error) {
    return SendResponse(
      { message: RESPONSE_MESSAGES.COMMON.INVALID_REQUEST },
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}

/**
 * Update movie
 * @param req @NextRequest
 * @returns @IMovies
 */
export const PUT = async (req: NextRequest, res: NextResponse) => {
  try {
    // storing query params in query
    const query = req.nextUrl.searchParams
    // storing id from query params
    const id = query.get("id")
    // storing payload from form data
    const formData = await req.formData()

    // storing file
    const file = formData.get("file") as unknown as IFILE
    // storing title
    const title = formData.get("title")
    // storing publishingYear
    const publishingYear = formData.get("publishingYear")
    // storing poster
    const file_url = formData.get("file_url")
    // making payload
    const body = {
      title: title ? title : undefined,
      publishingYear: publishingYear ? +publishingYear : undefined,
    }

    // validating payload
    const response = updateMovieSchema.safeParse(body)
    // if get error
    if (!response.success) {
      // custom message for validation error
      const message = zodMessageHandler(response?.error?.issues)
      return SendResponse({ message }, StatusCodes.BAD_REQUEST)
    }
    // declaring a variable
    let imageUrl

    // if getting file
    if (file) {
      // Convert the file's ArrayBuffer to a Node.js Buffer
      const buffer = Buffer.from(await file.arrayBuffer())

      // Get the filename from the file object
      const filename = file.name

      // Construct the URL path where the image will be stored
      imageUrl = process.env.IMAGE_PATH + filename

      // Define the directory path where the file will be uploaded
      const uploadDir = path.join(process.cwd(), "public", "uploads")

      // Check if the upload directory exists
      if (!fs.existsSync(uploadDir)) {
        // If it doesn't exist, create the directory
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      // Write the file buffer to the upload directory with the specified filename
      await writeFile(uploadDir + filename, buffer)
    }

    // making payload for update
    const payload = {
      poster: imageUrl ?? file_url ?? null,
      id,
      publishingYear,
      title,
    }

    // updating movies
    const movies = await Movies.findByIdAndUpdate(id, payload)

    return SendResponse(movies, StatusCodes.OK)
  } catch (error) {
    const e = error as Error
    return SendResponse(
      { message: e?.message },
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}

/**
 * Delete movie
 * @param req @NextRequest
 * @returns @Message
 */
export const DELETE = async (req: NextRequest, res: NextResponse) => {
  try {
    // storing query params
    const query = req.nextUrl.searchParams
    // storing id from query params
    const id = query.get("id")
    // finding and updating is deleted true
    const movies = await Movies.findByIdAndUpdate(id, { isDeleted: true })
    // if not movies
    if (!movies) {
      return SendResponse(
        RESPONSE_MESSAGES.COMMON.CANNOT_DELETE_USER,
        StatusCodes.OK
      )
    }
    // returning message
    return SendResponse(
      RESPONSE_MESSAGES.COMMON.USER_DELETED_SUCCESSFULLY,
      StatusCodes.OK
    )
  } catch (error) {
    const e = error as Error
    return SendResponse(
      { message: e?.message },
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}

/**
 * Get movies
 * @param req @NextRequest
 * @returns @IMovies
 */
export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    // storing query params
    const query = req.nextUrl.searchParams
    // storing limit
    let limit = query.get("limit") as unknown as number
    // storing page
    let page = query.get("page") as unknown as number

    let title = query.get("title") as unknown as string
    let queryParam = {} as { title: Object }
    // Calculate the offset
    const offset = (page - 1) * limit
    if (title) {
      queryParam.title = { $regex: title, $options: "i" } // Case-insensitive search
    }
    // finding user
    const movies = await Movies.find(queryParam)
      .sort({ createdAt: -1 }) // Sort by latest first
      .skip(offset)
      .limit(limit)
      .exec()
    // finding total items
    const totalItems = await Movies.countDocuments()
    // finding total pages
    const totalPages = Math.ceil(totalItems / limit)

    return SendResponse(
      {
        movies,
        totalItems,
        currentPage: page | 1,
        limit: limit | 12,
        totalPages: totalPages | 1,
      },
      StatusCodes.OK
    )
  } catch (error) {
    console.log(error)
    return SendResponse(
      { message: RESPONSE_MESSAGES.COMMON.INVALID_REQUEST },
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}
