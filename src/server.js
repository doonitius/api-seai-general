const express = require('express')
const app = express()
const http = require('http')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const server = http.createServer(app)

app.get("/health", (req, res) => {
  res.status(200).send("api-seai-general is running fine")
})

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log("API Server is running on port" + port)
  console.log("go to http://localhost:" + port + "/health")
})