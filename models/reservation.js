const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({
  name: String,
  date: Date,
  people: Number,
  time: String,
})

reservationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Reservation', reservationSchema)
