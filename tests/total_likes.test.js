const listHelper = require('../utils/list_helper')
const blogs = require('../utils/blogs_mockup.js')

describe('total likes', () => {
  test('of empty list is zero', () => {
    let emptyList = []
    const result = listHelper.totalLikes(emptyList)
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(blogs.listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs.all)
    expect(result).toBeGreaterThanOrEqual(0)
  })
})

describe('favorite blog', () => {
  test('blog with most likes', () => {
    const thisBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    }
    const blog = listHelper.favoriteBlog(blogs.all)

    expect(blog).toEqual(thisBlog)
  })
})

describe('most blogs author', () => {
  test('author with most blogs', () => {
    const author = {
      author: 'Robert C. Martin',
      blogs: 3
    }

    const result = listHelper.mostBlogs(blogs.all)

    expect(author).toEqual(result)
  })
})

describe('most likes author', () => {
  test('author with most likes', () => {
    const author = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }

    const result = listHelper.mostLikes(blogs.all)

    expect(author).toEqual(result)
  })
})