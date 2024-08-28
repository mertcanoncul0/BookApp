import { RequestHandler, Request, Response } from "express"
import crypto from "crypto"
import {
  createVerificationToken,
  deleteVerificationToken,
} from "@/models/verificationToken"
import { createUser, findUserByEmail } from "@/models/user"
import { hashSync, compareSync, genSaltSync } from "bcrypt"

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

  return res.json({
    message: "Verification link has been sent to your email",
  })
}
