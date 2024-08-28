import mongoose from "mongoose"

const uri = process.env.MONGO_URI

if (!uri) throw new Error("database is not defined")

mongoose.Promise = Promise

mongoose
  .connect(uri)
  .then(() => console.log("db connected!"))
  .catch((err) => console.log("db connected failed: ", err.message))
