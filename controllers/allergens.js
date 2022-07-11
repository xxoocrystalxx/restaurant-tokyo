const allergenRouter = require('express').Router()
const Allergen = require('../models/allergen')

allergenRouter.get('/', async (request, response) => {
  const allergens = await Allergen.find({})
  response.json(allergens)
})

allergenRouter.post('/', async (request, response) => {
  const allergen = new Allergen({ ...request.body })

  if (!allergen.name || !allergen.description || !allergen.icon) {
    return response.status(400).json({
      error: 'missing contents!',
    })
  }

  const savedAllergen = await allergen.save()
  response.status(201).json(savedAllergen)
})

module.exports = allergenRouter
