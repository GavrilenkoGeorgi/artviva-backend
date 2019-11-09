const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))

  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// Verify that the blog list application returns the
// correct amount of blog posts in the JSON format
test ('returns the correct amount of blog posts in the JSON format', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(helper.initialBlogs.length)
})

// Verify that the unique identifier property
// of the blog post is named id
test ('uid property of the blog post is named id', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToCheck = blogsAtStart[0]
  expect(blogToCheck).toHaveProperty('id')
})

afterAll(() => {
  mongoose.connection.close()
})
