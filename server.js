import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'


// connect to mongo/mongoose
const mongoUrl = process.env.MOMGO_URL || "mongodb://localhost/usersExample"
mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.Promise = Promise

// define model
const User = mongoose.model('User', {
  name: String
})

// set default port
const port = process.env.PORT || 8080
const app = express()

// middlewares
app.use(cors())
app.use(bodyParser.json())

// in order to catch errors and stop things from happening we can use the following. the next() function is the bit that stops things from proceeding.
// the placement of this bit matters and needs to be BEFORE any route definitions in order to work correctly.
// this middleware detects if the db is available or not and throws an error if it is unavailable.
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable'})
  }
})

// define route
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ error: 'User not found' })
  }
 } catch(err) {
   res.status(400).json({ error: 'Invalid user id' })
 }
})


// start server
app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`)
})