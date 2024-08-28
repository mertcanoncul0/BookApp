import express from "express"
import dotenv from "dotenv"
import router from "@/routes"

const app = express()
const port = process.env.PORT || 3000
dotenv.config()

app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`)
)

app.use("/", router())
