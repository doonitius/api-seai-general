const express = require('express')
const app = express()
const http = require('http')
const mongoose = require('mongoose')
const cors = require('cors')

require('dotenv').config()

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const server = http.createServer(app)

app.get("/health", (req, res) => {
  res.status(200).send("api-seai-general is running fine")
})

mongoose.connect(
  process.env.DB_CLUSTER,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log('general: connected to database')
)

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log("API Server is running on port" + port)
  console.log("go to http://localhost:" + port + "/health")
})