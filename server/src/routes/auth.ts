import { generateAuthLink } from "@/controllers/auth"
import { emailValidationSchema, validate } from "@/middlewares/validate"
import express, { RequestHandler } from "express"
import { z, ZodRawShape } from "zod"

export default (router: express.Router) => {
  router.post(
    "/auth/generate-link",
    validate(emailValidationSchema),
    generateAuthLink
  )

  router.post("/auth/verify", (req, res) => {})

  router.post("/auth/profile", (req, res) => {})
}
