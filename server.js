import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// define port for dev
const port = process.env.PORT || 8080
const app = express()

// add middlewares
app.use(cors())
app.use(bodyParser.json())

const mongoURL = process.env.MOMGO_URL || "mongodb://localhost/animals"
mongoose.connect(mongoURL, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.Promise = Promise

const Animal = mongoose.model('Animal', {
  name: String,
  age: Number,
  isFurry: Boolean
})

// we are clearing the db every time we reload the server which is not good practice but helps us in using the following example. the deleteMany.then function which wrapps our animals clears the db. so we only show 3 animals.
Animal.deleteMany().then(() => {
  new Animal({ name: 'Alfons', age: 2, isFurry: true }).save()
  new Animal({ name: 'Lucy', age: 5, isFurry: true }).save()
  new Animal({ name: 'Goldy da goldfish', age: 1, isFurry: false }).save()
})

// start defining routes
app.get('/', (request, response) => {
  Animal.find().then(animals => {
    response.json(animals)
  })
})


// define endpoint to get 1 single animal and its details
app.get('/:name', (req, res) => {
  Animal.findOne({name: req.params.name}).then(animal => {
    if(animal) {
      res.json(animal)
    } else {
      res.status(404).json({ error: 'Not found' })
    }
  })
})

// start server
app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`)
})