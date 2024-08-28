import { UserDoc } from "@/models/user"
import { Request, Response } from "express"

type ErrorResponseType = {
  res: Response
  message: string
  status: number
}

export const sendErrorResponse = ({
  res,
  message,
  status,
}: ErrorResponseType) => {
  res.status(status).json({ message })
}

export const formatUserProfile = (user: UserDoc): Request["user"] => ({
  id: user._id,
  name: user?.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar?.url,
})
