import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { RESPONSE_MESSAGES } from "./utils/responseMessages"
import StatusCodes from "./utils/statusCodeEnum"
import { jwtVerify } from "jose"
import { appConstants } from "./utils"
import { env } from "./utils/env"

const protected_routes = ["/movies"]

const protected_apis = ["/api/movies"]

const publicRoutes = ["/signin"]
export async function middleware(req: NextRequest) {
  if (startsWithAny(req.nextUrl.pathname, protected_apis)) {
    return await authenticatedApiRoutes(req)
  }

  if (startsWithAny(req.nextUrl.pathname, protected_routes)) {
    return authenticatedRoutes(req)
  }

  if (startsWithAny(req.nextUrl.pathname, publicRoutes)) {
    return unAuthenticatedRoutes(req)
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

async function authenticatedApiRoutes(req: NextRequest) {
  const unauthError = {
    success: false,
    message: RESPONSE_MESSAGES.LOGIN.UNAUTHORIZED,
  }

  try {
    const token = req.cookies.get(appConstants.AUTH_COOKIE)?.value
    const secretKey = new TextEncoder().encode(env.secret_key)

    if (!token) {
      return NextResponse.json(unauthError, {
        status: StatusCodes.UNAUTHORIZED,
      })
    }

    ;(req as any).user = await jwtVerify(token, secretKey)
  } catch (err) {
    return NextResponse.json(unauthError, { status: StatusCodes.UNAUTHORIZED })
  }

  return NextResponse.next()
}

function authenticatedRoutes(req: NextRequest) {
  if (req.cookies.has(appConstants.AUTH_COOKIE)) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL("/signin", req.url))
}

function unAuthenticatedRoutes(req: NextRequest) {
  if (req.cookies.has(appConstants.AUTH_COOKIE)) {
    return NextResponse.redirect(new URL("/movies", req.url))
  }

  return NextResponse.next()
}

function startsWithAny(path: string, stringList: string[]) {
  for (let s of stringList) {
    if (path.startsWith(s)) {
      return true
    }
  }
  return false
}
