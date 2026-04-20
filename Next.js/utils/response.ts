import StatusCodes from "./statusCodeEnum"
import { RESPONSE_MESSAGES } from "./responseMessages"
import { NextResponse } from "next/server"
const SendResponse = (
  data: any = { message: RESPONSE_MESSAGES.COMMON },
  status = StatusCodes.OK
) => {
  return NextResponse.json(data, { status })
}
export default SendResponse
