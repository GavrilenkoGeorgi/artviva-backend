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

// verifies that making an HTTP POST request to the
// /api/blogs url successfully creates a new blog post
test('a valid blog post can be added', async () => {
  const newBlog = {
    'title': 'Valid blog added',
    'author': 'Homer',
    'url': 'some.url',
    'likes': 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogs = await helper.blogsInDb()
  expect(blogs.length).toBe(helper.initialBlogs.length + 1)

  const title = blogs.map(blog => blog.title)
  expect(title).toContain(
    'Valid blog added'
  )
})

// verifies that if the likes property is missing
// from the request, it will default to the value 0
test ('default likes property is set correctly', async () => {
  const newBlog = {
    'title': 'New one',
    'author': 'Homer',
    'url': 'some.url'
  }

  const resultBlog = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultBlog.body.likes).toEqual(0)
})

// verifies that if the title and url properties are missing
// from the request data, the backend responds to the request
// with the status code 400 Bad Request.
test('blog without title or url is not added', async () => {
  const newBlog = {
    'author': 'Homer',
    'likes': 23
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})
