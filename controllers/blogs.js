const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('User', { username: 1, name: 1 })
  response.json(blogs.map(blogs => blogs.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const body = new Blog(request.body) //?

  const token = getTokenFrom(request)

  // try {
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({
      error: 'token is missing or invalid'
    })
  }
  const user = await User.findById(decodedToken.id)

  if (!body.title || !body.url) {
    response.status(400).end()
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ? body.likes : 0
    })

    try {
      const savedBlog = await blog.save()
      response.json(savedBlog.toJSON())
    } catch (exception) {
      next(exception)
    }
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

// increase amount of likes
blogsRouter.put('/:id', async (request, response, next) => {
  try {
    // const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { $inc: { likes : 1 } })
    response.json(updatedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter
