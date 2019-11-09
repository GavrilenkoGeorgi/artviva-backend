const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Some title',
    author: 'Some author',
    url: 'https://some.net',
    likes: 1
  },
  {
    title: 'Some other title',
    author: 'More famous author',
    url: 'https://big.org',
    likes: 2
  },
  {
    title: 'New Title',
    author: 'Alan Poe',
    url: 'https://crypt.com',
    likes: 22
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}
