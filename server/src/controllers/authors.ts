import { sendErrorResponse } from "@/lib/helper"
import { createAuthor, findAuthorBySlug } from "@/models/author"
import { findByIdAndUpdateRole } from "@/models/user"
import { RequestAuthorHandler } from "@/types"
import { RequestHandler } from "express"
import slugify from "slugify"

export const registerAuthor: RequestAuthorHandler = async (req, res) => {
  const { body, user } = req

  if (!user.signedUp) {
    return sendErrorResponse({
      res,
      status: 401,
      message: "User must be signed up before registering as an author!",
    })
  }

  const newAuthor = await createAuthor({
    userId: user.id,
    name: body.name,
    about: body.about,
    socialLinks: body.socialLinks,
  })

  const uniqueSlug = slugify(`${newAuthor.name} ${newAuthor._id}`, {
    lower: true,
    replacement: "-",
  })

  newAuthor.slug = uniqueSlug
  await newAuthor.save()

  await findByIdAndUpdateRole(user.id, newAuthor._id.toString())

  res.json({ message: "Thanks for registering as an author" })
}

export const getAuthorDetail: RequestHandler = async (req, res) => {
  const { slug } = req.params

  const author = await findAuthorBySlug(slug)

  if (!author) {
    return sendErrorResponse({
      res,
      status: 404,
      message: "Author not found!",
    })
  }

  res.json({
    id: author._id,
    name: author.name,
    about: author.about,
    socialLinks: author.socialLinks,
  })
}
