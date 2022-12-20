const express = require('express')
const app = express()
const http = require('http')
const mongoose = require('mongoose')
const cors = require('cors')
const express_fileupload = require('express-fileupload')

require('dotenv').config()

app.use(cors())

app.use(express())
app.use(express.json())
app.use(express_fileupload())

const server = http.createServer(app)

app.use('/general', require('./routes'))

app.get("/health", (req, res) => {
  res.status(200).send("api-seai-general is running fine")
})

const db_connection = async () => {
  try {
    const connect_db = await mongoose.connect(
      process.env.DB_CLUSTER,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    console.log('general mongoDB connected: ' + connect_db.connection.host)
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

const port = process.env.PORT || 8000;

db_connection().then(() => {
  server.listen(port, () => {
    console.log('API Server is running on port ' + port)
    console.log('check at http://localhost:' + port + '/health')
  })
})