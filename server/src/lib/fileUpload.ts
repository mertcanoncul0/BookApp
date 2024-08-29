import cloudinary from "@/cloud/cloudinary"
import { File } from "formidable"
import fs from "fs"
import { Types } from "mongoose"
import path from "path"
import slugify from "slugify"

export const uploadAvatarToCloudinary = async (
  file: File,
  avatarId?: string
) => {
  if (avatarId) {
    await cloudinary.uploader.destroy(avatarId)
  }

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    file.filepath,
    {
      width: 300,
      height: 300,
      gravity: "face",
      crop: "fill",
    }
  )

  return { id: public_id, url: secure_url }
}

export const uploadCoverToCloudinary = async (file: File) => {
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    file.filepath
  )

  return { id: public_id.toString(), url: secure_url }
}

export const uploadBookToLocalDir = (file: File, uniqueFileName: string) => {
  const bookStoragePath = path.join(__dirname, "../public/books")

  if (!fs.existsSync(bookStoragePath)) {
    fs.mkdirSync(bookStoragePath, { recursive: true })
  }

  const filePath = path.join(bookStoragePath, uniqueFileName)
  fs.writeFileSync(filePath, fs.readFileSync(file.filepath))
}
