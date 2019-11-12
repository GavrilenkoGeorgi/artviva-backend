const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blogs => blogs.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const body = new Blog(request.body)

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

module.exports = blogsRouter
