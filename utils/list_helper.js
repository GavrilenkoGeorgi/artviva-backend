const totalLikes = blogsList => {
  if (!blogsList.length) {
    return 0
  } else if (blogsList.length === 1) {
    return blogsList[0].likes
  } else {
    return blogsList.reduce((total, blog) => total + blog.likes, 0)
  }
}

const favoriteBlog = blogsList => {
  const favBlog = blogsList.reduce(function(prev, current) {
    return (prev.likes > current.likes) ? prev : current
  })
  const { title: title, author: author, likes: likes } = favBlog

  const result = {
    title: title,
    author: author,
    likes: likes
  }

  return result
}


const mostBlogs = blogsList => {
  // array of author names and number of blog entries for each
  const authorsAndBlogsData = blogsList.reduce((obj, blog) => {
    obj[blog.author] = (obj[blog.author] || 0) + 1
    return obj
  }, {})

  // max number of blogs in array
  const blogsQuantity = Object.values(authorsAndBlogsData)
  const max = Math.max(...blogsQuantity)

  // and the winner is..
  const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value)
  }
  const author = getKeyByValue(authorsAndBlogsData, max)

  const result = {
    author: author,
    blogs: max
  }
  return result
}

const mostLikes = blogsList => {

  const listOfAuthors = blogsList.map(blog => blog.author)
  const authorSet = new Set(listOfAuthors) // Set removes duplications, but it's still a set
  const uniqueAuthors = [...authorSet] // Spread operator to transform a set into an Array

  // calc sum of likes for every author
  const sumOfLikes = author =>
    blogsList.filter(post => post.author === author)
      .reduce((a, b) => a + b.likes, 0)

  const result = []
  for (let author of uniqueAuthors) {
    const entry = {
      author: author,
      likes: sumOfLikes(author)
    }
    result.push(entry)
  }

  const maxLikesAuthor =
    result.reduce((prev, current) =>
      (prev.likes > current.likes) ? prev : current)
  return maxLikesAuthor
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}