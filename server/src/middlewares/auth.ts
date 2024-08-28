import { formatUserProfile, sendErrorResponse } from "@/lib/helper"
import { findUserById } from "@/models/user"
import { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import { Types } from "mongoose"

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: Types.ObjectId
        name?: string
        email: string
        role: "user" | "author"
        avatar?: string
      }
    }
  }
}

export const isAuth: RequestHandler = async (req, res, next) => {
  const authToken = req.cookies.authToken

  if (!authToken) {
    return sendErrorResponse({
      status: 401,
      message: "Unauthorized request!",
      res,
    })
  }

  const payload = jwt.verify(authToken, process.env.JWT_SECRET as string) as {
    userId: Types.ObjectId
  }

  console.log(payload)

  const user = await findUserById(payload.userId)
  if (!user) {
    return sendErrorResponse({
      status: 401,
      message: "Unauthorized request user not found!",
      res,
    })
  }

  req.user = formatUserProfile(user)

  next()
}
