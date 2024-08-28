import { ErrorRequestHandler } from "express"
import { JsonWebTokenError } from "jsonwebtoken"

export const errorhandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({ error: err.message })
  }

  res.status(500).json({ error: err.message })
}
