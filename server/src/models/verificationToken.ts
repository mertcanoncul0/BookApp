import { compareSync, genSaltSync, hashSync } from "bcrypt"
import { model, Schema, Types } from "mongoose"

interface VerificationTokenDoc {
  userId: Types.ObjectId
  token: string
  expires: Date
}

interface Methods {
  compare: (token: string) => boolean
}

const verifyTokenSchema = new Schema<VerificationTokenDoc, {}, Methods>({
  userId: {
    type: "ObjectID",
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

export const createVerificationToken = async (
  userId: Types.ObjectId,
  token: string
) => await VerificationTokenModel.create({ userId, token })

export const deleteVerificationToken = async (userId: Types.ObjectId) =>
  await VerificationTokenModel.findOneAndDelete({ userId })

export const findVerificationToken = async (userId: Types.ObjectId) =>
  await VerificationTokenModel.findOne({ userId })

export const deleteVerificationTokenById = async (userId: Types.ObjectId) =>
  await VerificationTokenModel.findOneAndDelete({ userId })
