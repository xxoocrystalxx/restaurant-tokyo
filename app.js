const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
require('express-async-errors')
require('dotenv').config()
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const dishRouter = require('./controllers/dish')
const allergenRouter = require('./controllers/allergens')
const reservationRouter = require('./controllers/reservations')

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(fileUpload())
app.use('/images', express.static('images'))
app.use(middleware.tokenExtractor)
app.use('/api/dishes', middleware.userExtractor, dishRouter)
app.use('/api/register', usersRouter)
app.use('/admin', loginRouter)
app.use('/api/allergens', allergenRouter)
app.use('/api/reservations', middleware.userExtractor, reservationRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
