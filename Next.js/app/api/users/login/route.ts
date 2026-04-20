import "@/database/connection"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { NextRequest } from "next/server"

import Users from "@/models/user"
import SendResponse from "@/utils/response"
import { RESPONSE_MESSAGES } from "@/utils/responseMessages"
import StatusCodes from "@/utils/statusCodeEnum"
import { IUSERS } from "@/utils/types"

/**
 * Login User
 * @param req @NextRequest
 * @returns @Token
 */
export const POST = async (req: NextRequest) => {
  try {
    // storing request payload in body
    const body = await req.json()

    // finding user by email
    const user = (await Users.findOne({
      email: body.email,
    })) as unknown as IUSERS

    // return error user not found
    if (!user) {
      return SendResponse(
        { message: RESPONSE_MESSAGES.COMMON.USER_NOT_FOUND },
        StatusCodes.OK
      )
    }

    //validating password
    const validPassword = await bcrypt.compare(body?.password, user?.password)

    //if password validated
    if (validPassword) {
      // storing secret key from env
      const secretKey: string = process.env.SECRET_KEY as string

      // using jwt sign for token generate
      const token = jwt.sign({ _id: user._id, email: user?.email }, secretKey)

      // making response payload for token
      const resPayload = {
        token: token,
      }
      // sending response
      return SendResponse(resPayload, StatusCodes.OK)
    }
    // if password not valid returning unauthorized
    return SendResponse(
      { message: RESPONSE_MESSAGES.LOGIN.UNAUTHORIZED },
      StatusCodes.BAD_REQUEST
    )
  } catch (error) {
    const e = error as Error
    return SendResponse(
      { message: e.message },
      StatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}
