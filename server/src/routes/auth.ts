import { generateAuthLink } from "@/controllers/auth"
import express from "express"

export default (router: express.Router) => {
  router.post("/auth/generate-link", generateAuthLink)

  router.post("/auth/verify", (req, res) => {})

  router.post("/auth/profile", (req, res) => {})
}
