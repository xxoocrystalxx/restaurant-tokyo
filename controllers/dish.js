const dishRouter = require('express').Router()
const Dish = require('../models/dish')
const Allergen = require('../models/allergen')

dishRouter.get('/', async (request, response) => {
  const dish = await Dish.find({}).populate('allergens')
  response.json(dish)
})

dishRouter.post('/', async (request, response) => {
  const newDish = request.body
  if (
    !newDish.codice ||
    !newDish.name ||
    !newDish.category ||
    !newDish.feature ||
    !newDish.price
  ) {
    return response.status(400).json({
      error: 'missing contents!',
    })
  }

  const promiseArray = newDish.allergens.map(async (a) => {
    const allergen = await Allergen.find({ name: `${a}` })
    if (allergen.length > 0) return allergen[0]._id
  })
  const allergens = await Promise.all(promiseArray)
  newDish.allergens = allergens.filter((a) => a)
  const dishObject = new Dish({
    ...newDish,
  })

  const savedDish = await dishObject.save()

  response.status(201).json(savedDish)
})

dishRouter.delete('/:id', async (request, response) => {
  await Dish.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = dishRouter
