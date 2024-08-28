import "express-async-errors"
import "@/lib/db"
import express from "express"
import dotenv from "dotenv"
import router from "@/routes"
import cookieParser from "cookie-parser"
import { errorhandler } from "@/middlewares/error"

const app = express()
const port = process.env.PORT || 3000
dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use("/", router())

app.use(errorhandler)

app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`)
)
