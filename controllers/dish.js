const dishRouter = require('express').Router()
const Dish = require('../models/dish')
const Allergen = require('../models/allergen')

dishRouter.get('/featured', async (request, response) => {
  const dish = await Dish.find({ feature: true })
  response.json(dish)
})

dishRouter.get('/', async (request, response) => {
  const dish = await Dish.find({}).populate('allergens')
  response.json(dish)
})

dishRouter.post('/', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'missing or invalid token' })
  }
  const newDish = request.body
  if (!newDish.codice) {
    return response.status(400).json({
      error: 'missing codice!',
    })
  }
  if (!newDish.name) {
    return response.status(400).json({
      error: 'missing name!',
    })
  }
  if (!newDish.category) {
    return response.status(400).json({
      error: 'missing category!',
    })
  }
  if (newDish.feature === null) {
    return response.status(400).json({
      error: 'missing feature!',
    })
  }
  if (!newDish.price) {
    return response.status(400).json({
      error: 'missing price!',
    })
  }

  if (newDish.allergens) {
    const promiseArray = newDish.allergens?.map(async (a) => {
      const allergen = await Allergen.find({ name: `${a}` })
      if (allergen.length > 0) return allergen[0]._id
    })
    const allergens = await Promise.all(promiseArray)
    newDish.allergens = allergens.filter((a) => a)
  } else {
    delete newDish.allergens
  }

  const dishObject = new Dish({
    ...newDish,
  })

  const savedDish = await dishObject.save()

  response.status(201).json(savedDish)
})

dishRouter.post('/images', async (request, response) => {
  if (!request.files) {
    return response.status(400).json({
      error: 'No file uploaded!',
    })
  }
  let file = request['files'].dishImage
  file.mv('./images/dishes/' + file.name)
  response.status(201).end()
})

dishRouter.delete('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'missing or invalid token' })
  }
  await Dish.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = dishRouter
