const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
<<<<<<< HEAD
const checkNameAndPass = require('../utils/val_user_input').checkNameAndPass
=======
>>>>>>> part4-notes

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

<<<<<<< HEAD
    if (checkNameAndPass(body.name, body.password)) {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(body.password, saltRounds)
      const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
      })

      const savedUser = await user.save()

      response.json(savedUser)
    } else {
      return response.status(400).json({ error: 'check username and/or password input' })
    }
=======
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
>>>>>>> part4-notes
  } catch (exception) {
    next(exception)
  }
})

usersRouter.get('/', async (request, response) => {
<<<<<<< HEAD
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
=======
  const users = await User.find({}).populate('notes', { content: 1 })
>>>>>>> part4-notes
  response.json(users.map(user => user.toJSON()))
})

module.exports = usersRouter
