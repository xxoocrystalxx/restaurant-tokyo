const reservationRouter = require('express').Router()
const Reservation = require('../models/reservation')
const { sendMail } = require('../utils/mailer')

reservationRouter.get('/', async (request, response) => {
  const reservation = await Reservation.find({})
  response.json(reservation)
})

reservationRouter.post('/', async (request, response) => {
  const newReservation = new Reservation({ ...request.body })
  if (
    !newReservation.name ||
    !newReservation.date ||
    !newReservation.time ||
    !newReservation.people
  ) {
    return response.status(400).json({
      error: 'missing contents!',
    })
  }

  const savedReservation = await newReservation.save()

  const mailData = {
    from: 'inkloud3@gmail.com', // sender address
    to: 'inkloud3@gmail.com', // list of receivers
    subject: `Reservation ${
      savedReservation.name
    } ${savedReservation.date.toDateString()}`,
    text: `time: ${savedReservation.time}, people: ${savedReservation.people}`,
  }
  await sendMail(mailData, (error) => {
    if (error) {
      console.log(error)
    }
  })

  response.status(201).json(savedReservation)
})

reservationRouter.delete('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'missing or invalid token' })
  }
  await Reservation.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

module.exports = reservationRouter
