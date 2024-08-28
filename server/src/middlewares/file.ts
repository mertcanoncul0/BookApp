import { RequestHandler } from "express"
import formidable, { File } from "formidable"

declare global {
  namespace Express {
    export interface Request {
      files: Record<string, File | File[] | undefined>
    }
  }
}

export const fileParser: RequestHandler = async (req, res, next) => {
  const form = formidable()
  const [fields, files] = await form.parse(req)

  if (!req.body) req.body = {}
  if (!req.files) req.files = {}

  for (const key in fields) {
    const fieldValue = fields[key]
    if (fieldValue) req.body[key] = fieldValue[0]
  }

  for (const key in files) {
    const filedValue = files[key]
    if (filedValue) {
      if (filedValue.length > 1) {
        req.files[key] = filedValue
      } else {
        req.files[key] = filedValue[0]
      }
    }
  }

  next()
}
