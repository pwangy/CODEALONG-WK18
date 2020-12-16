import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books"

import dotenv from 'dotenv'


dotenv.config()

// set default port
const port = process.env.PORT || 8080
const app = express()

// middlewares
app.use(cors())
app.use(bodyParser.json())

// define route
app.get('/', (req, res) => {
  res.send('Hallå!') 
})

// start server
app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`)
})