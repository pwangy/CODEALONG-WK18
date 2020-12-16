import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// import dotenv from 'dotenv'
// dotenv.config()

const Author = mongoose.model('Author', {
  name: String
})


// To create a db which has a relationship to another defined db.
const Book = mongoose.model('Book', {
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
})

// we continue to bump into the issue of replicating db entries upon server restart. 
// how to deal with this?
// method 1: to clear everything every time the server is loaded ["await Author.deleteMany()"], n.b. this also results in generating new ids for each item every time.
// method 2: instead of clearing the data and rewriting the db every time the server is loaded... wrap everything in an envronment variable in order to choose when to run the seed task which will reset everything. note: "RESET_DATABASE" can be renamed to anything you want. in order to invoke the process. you would have to write "RESET_DATABASE=TRUE npm run dev" in your console.
if (process.env.RESET_DATABASE) {
  console.log('Resetting database!')

  const seedDatabase = async () => {
    await Author.deleteMany()
    await Book.deleteMany()
  
    const tolkien = new Author({ name: 'J.R.R. Tolkien' })
    await tolkien.save()
  
    const rowling = new Author({ name: 'J.K. Rowling' })
    await rowling.save()
  
    await new Book({ title: "Harry Potter and the Philosopher's Stone", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Chamber of Secrets", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Prisoner of Azkaban", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Goblet of Fire", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Order of the Phoenix", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Half-Blood Prince", author: rowling }).save()
    await new Book({ title: "Harry Potter and the Deathly Hallows", author: rowling }).save()
    await new Book({ title: "The Lord of the Rings", author: tolkien }).save()
    await new Book({ title: "The Hobbit", author: tolkien }).save()
  }
  seedDatabase()
}

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

// all authors
app.get('/authors', async (req, res) => {
  const authors = await Author.find()
  res.json(authors)
})

// a single author
app.get('/authors/:id', async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    res.json(author)
  } else {
    res.status(404).json({ error: 'Author not found' })
  }
})

// all books by author
app.get('/authors/:id/books', async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) })
    res.json(books)
  } else {
    res.status(404).json({ error: 'Author not found' })
  }
  
})

// all books
app.get('/books', async (req, res) => {
  const books = await Book.find().populate('author')
  res.json(books)
})

// start server
app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`)
})

// next step here could be to add the error handling for the mongo connection as from the other video