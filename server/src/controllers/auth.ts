import { RequestHandler, Request, Response } from "express"

export const generateAuthLink: RequestHandler = (
  req: Request,
  res: Response
) => {
  res.json({
    message: "Hello World",
  })
}
