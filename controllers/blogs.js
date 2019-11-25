const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blogs => blogs.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const body = new Blog(request.body) //?

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
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
        likes: body.likes ? body.likes : 0,
        user: user._id
      })
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)

      await user.save()
      response.json(savedBlog.toJSON())
    }
  } catch (exception) {
    next(exception)
  }
})

// increase amount of likes
blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { $inc: { likes : 1 } })
    response.json(updatedBlog.toJSON())
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).send({ error: 'blog not found' })
    } else if (blog.user.toString() !== decodedToken.id.toString()) {
      return response.status(400).send({ error: 'not allowed to delete other users entries' })
    }

    await Blog.findByIdAndRemove(blog._id)
    response.status(204).end()

  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter
