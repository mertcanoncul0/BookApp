import "express-async-errors"
import "@/lib/db"
import express from "express"
import dotenv from "dotenv"
import router from "@/routes"
import cookieParser from "cookie-parser"
import { errorhandler } from "@/middlewares/error"
import path from "path"
import formidable from "formidable"

const app = express()
const port = process.env.PORT || 3000
dotenv.config()

const publicPath = path.join(__dirname, "./public/books")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use("/public/books", express.static(publicPath))
app.use("/", router())

app.post("/test", async (req, res) => {
  const form = formidable({
    uploadDir: path.join(__dirname, "./public/books"),
    filename(name, ext, part, form) {
      console.log(name, ext, part, form)

      return name + ".jpg"
    },
  })

  await form.parse(req)

  res.json({})
})
app.use(errorhandler)

app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`)
)
