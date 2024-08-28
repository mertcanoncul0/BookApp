import express from "express"
import dotenv from "dotenv"
import router from "@/routes"

const app = express()
const port = process.env.PORT || 3000
dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use("/", router())

app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`)
)
