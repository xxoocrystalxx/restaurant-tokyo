const mongoose = require('mongoose')

const allergenSchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String,
})

allergenSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Allergen', allergenSchema)
