import { RequestHandler, Request, Response } from "express"
import crypto from "crypto"
import {
  createVerificationToken,
  deleteVerificationToken,
  deleteVerificationTokenById,
  findVerificationToken,
} from "@/models/verificationToken"
import {
  createUser,
  findByIdAndUpdateName,
  findUserByEmail,
  findUserById,
} from "@/models/user"
import mail from "@/lib/mail"
import { formatUserProfile, sendErrorResponse } from "@/lib/helper"
import { Types } from "mongoose"
import jwt from "jsonwebtoken"
import cloudinary from "@/cloud/cloudinary"
import { uploadAvatarToCloudinary } from "@/lib/fileUpload"

export const generateAuthLink: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body
  let user = await findUserByEmail(email)

  if (!user) {
    user = await createUser(email)
  }

  await deleteVerificationToken(user._id)

  const randomToken = crypto.randomBytes(36).toString("hex")
  await createVerificationToken(user._id, randomToken)

  const link = `${process.env.VERIFICATION_LINK}?token=${randomToken}&userId=${user._id}`

  await mail.sendVerificationEmail({
    link,
    to: user.email,
  })

  res.json({
    message: "Please check you email for link.",
  })
}

export const verifyAuthToken: RequestHandler = async (req, res) => {
  const { token, userId } = req.query

  const id = userId as string

  if (!token || !userId) {
    return sendErrorResponse({
      status: 403,
      message: "Invalid request",
      res,
    })
  }

  const verificationToken = await findVerificationToken(id)

  if (!verificationToken || !verificationToken.compare(token as string)) {
    return sendErrorResponse({
      status: 403,
      message: "Invalid request, token mismatch!",
      res,
    })
  }

  const user = await findUserById(id)

  if (!user) {
    return sendErrorResponse({
      status: 500,
      message: "Something went wrong, user not found!",
      res,
    })
  }

  await deleteVerificationTokenById(verificationToken._id.toString())

  const payload = { userId: user._id }

  const authToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "15d",
  })

  res.cookie("authToken", authToken, {
    httpOnly: true,
    secure: true, // process.env.NODE_ENV === "production"
    sameSite: "strict",
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  })

  res.redirect(
    `${process.env.AUTH_SUCCESS_URL}?profile=${JSON.stringify(
      formatUserProfile(user)
    )}`
  )
}

export const sendProfileInfo: RequestHandler = async (
  req: Request,
  res: Response
) => {
  res.json({
    profile: req.user,
  })
}

export const logout: RequestHandler = async (req: Request, res: Response) => {
  res.clearCookie("authToken").send()
}

export const updateProfile: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const user = await findByIdAndUpdateName(req.user.id, req.body.name)

  if (!user) {
    return sendErrorResponse({
      status: 500,
      message: "Something went wrong, user not found!",
      res,
    })
  }

  const file = req.files.avatar
  if (file && !Array.isArray(file)) {
    user.avatar = await uploadAvatarToCloudinary(file, user.avatar?.id)

    await user.save()
  }

  res.json({ profile: formatUserProfile(user) })
}
