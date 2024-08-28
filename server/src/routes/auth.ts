import {
  generateAuthLink,
  sendProfileInfo,
  verifyAuthToken,
  logout,
} from "@/controllers/auth"
import { isAuth } from "@/middlewares/auth"
import { emailValidationSchema, validate } from "@/middlewares/validate"
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
}
