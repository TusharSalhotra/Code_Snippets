import "@/database/connection"
import Users from "@/models/user"
import SendResponse from "@/utils/response"
import { RESPONSE_MESSAGES } from "@/utils/responseMessages"
import StatusCodes from "@/utils/statusCodeEnum"
import { NextRequest, NextResponse } from "next/server"
import { schema } from "./validation"
import { zodMessageHandler } from "@/utils/common"

/**
 * Create User
 * @param req @NextRequest
 * @returns @IUser
 */
export const POST = async (req: NextRequest) => {
  try {
    // storing payload in body
    const body = await req.json()

    // validating payload
    const response = schema.safeParse(body)

    // if getiing error
    if (!response.success) {
      // custom messagge handler
      const message = zodMessageHandler(response?.error?.issues)
      return SendResponse({ message }, StatusCodes.BAD_REQUEST)
    }
    // destucring email from body
    const { email } = body

    // finding existing email
    const findExistingEmail = await Users.findOne({ email }).lean()

    // returning error if already exist
    if (findExistingEmail) {
      return SendResponse(
        { Message: RESPONSE_MESSAGES.COMMON.EMAIL_ALREDY_TAKEN },
        StatusCodes.BAD_REQUEST
      )
    }
    // saving payload data in database
    const user = await Users.create(body)

    // returning response
    return SendResponse(user, StatusCodes.OK)
  } catch (error) {
    return SendResponse(
      { message: RESPONSE_MESSAGES.COMMON.INVALID_REQUEST },
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}

/**
 * Update User
 * @param req @NextRequest
 * @returns @IUser
 */
export const PUT = async (req: NextRequest) => {
  try {
    // storing query params in query key
    const query = req.nextUrl.searchParams

    // storing id from query param

    const id = query.get("id")

    // storing request payload in body
    const body = await req.json()

    // validating payload
    const response = schema.safeParse(body)
    if (!response.success) {
      const message = zodMessageHandler(response?.error?.issues)
      return SendResponse({ message }, StatusCodes.BAD_REQUEST)
    }
    // finding user from id
    const findUser = await Users.findById(id)

    // if not found returning error
    if (!findUser) {
      return SendResponse(
        { message: RESPONSE_MESSAGES.COMMON.USER_NOT_FOUND },
        StatusCodes.NOT_FOUND
      )
    }

    const { email } = body
    // finding existing email
    const findExistingEmail = await Users.findOne({
      email,
      _id: { $ne: id },
    }).lean()

    // returning error if already exist
    if (findExistingEmail) {
      return SendResponse(
        { Message: RESPONSE_MESSAGES.COMMON.EMAIL_ALREDY_TAKEN },
        StatusCodes.BAD_REQUEST
      )
    }
    // updating user
    const user = await Users.findByIdAndUpdate(id, body, { new: true })

    return SendResponse(user, StatusCodes.OK)
  } catch (error) {
    const e = error as Error
    return SendResponse(
      { message: e?.message },
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}

/**
 * Delete User
 * @param req @NextRequest
 * @returns @Message
 */
export const DELETE = async (req: NextRequest) => {
  try {
    // storing query params in query
    const query = req.nextUrl.searchParams

    // storing id from query param
    const id = query.get("id")

    // update is delete true
    const user = await Users.findByIdAndUpdate(id, { isDeleted: true })

    // if not update return error cannot delete
    if (!user) {
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
