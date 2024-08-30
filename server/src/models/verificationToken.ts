import { compareSync, genSaltSync, hashSync } from "bcrypt"
import { model, Schema, Types } from "mongoose"

interface VerificationTokenDoc {
  userId: string
  token: string
  expires: Date
}

interface Methods {
  compare: (token: string) => boolean
}

const verifyTokenSchema = new Schema<VerificationTokenDoc, {}, Methods>({
  userId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    default: Date.now(),
    expires: 60 * 60 * 24,
  },
})

verifyTokenSchema.pre("save", function (next) {
  if (this.isModified("token")) {
    const salt = genSaltSync(10)
    this.token = hashSync(this.token, salt)
  }

  next()
})

verifyTokenSchema.methods.compare = function (token) {
  return compareSync(token, this.token)
}

const VerificationTokenModel = model("VerificationToken", verifyTokenSchema)

export const createVerificationToken = async (userId: string, token: string) =>
  await VerificationTokenModel.create({ userId, token })

export const deleteVerificationToken = async (userId: string) =>
  await VerificationTokenModel.findOneAndDelete({ userId })

export const findVerificationToken = async (userId: string) =>
  await VerificationTokenModel.findOne({ userId })

export const deleteVerificationTokenById = async (userId: string) =>
  await VerificationTokenModel.findOneAndDelete({ userId })
