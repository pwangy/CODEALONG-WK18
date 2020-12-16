import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
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
  // fetch('...', { headers: { Authorization: 'super secret key' }})
  // irl we would never pass the variable to the user, however to show how this works in this example, Damien has the following line to make the point:
  res.send(process.env.MY_KEY) 
  // res.send('Hello world')
})

// start server
app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`)
})