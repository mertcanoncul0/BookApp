import { RequestHandler, Request, Response } from "express"

export const generateAuthLink: RequestHandler = (
  req: Request,
  res: Response
) => {
  console.log(req.body)

  res.json({
    message: "Hello World",
  })
}
