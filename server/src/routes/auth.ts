import {
  generateAuthLink,
  sendProfileInfo,
  verifyAuthToken,
  logout,
  updateProfile,
} from "@/controllers/auth"
import { isAuth } from "@/middlewares/auth"
import { fileParser } from "@/middlewares/file"
import { validate } from "@/middlewares/validate"
import { emailValidationSchema, newUserSchema } from "@/types/schema"
import express from "express"

export default (router: express.Router) => {
  router.post(
    "/auth/generate-link",
    validate(emailValidationSchema),
    generateAuthLink
  )

  router.get("/auth/verify", verifyAuthToken)
  router.get("/auth/profile", isAuth, sendProfileInfo)
  router.post("/auth/logout", isAuth, logout)
  router.put(
    "/auth/profile",
    isAuth,
    fileParser,
    validate(newUserSchema),
    updateProfile
  )
}
