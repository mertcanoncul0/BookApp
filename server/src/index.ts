import express from "express"

const app = express()
const port = process.env.PORT || 3000

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>")
})

app.get("/login", (req, res) => {
  res.send("<h1>Login Page!</h1>")
})

app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`)
)
