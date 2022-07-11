const mongoose = require('mongoose')

const dishSchema = new mongoose.Schema({
  name: String,
  codice: String,
  category: String,
  feature: Boolean,
  price: Number,
  allergens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Allergen',
    },
  ],
  ingredients: [String],
})

dishSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Dish', dishSchema)
