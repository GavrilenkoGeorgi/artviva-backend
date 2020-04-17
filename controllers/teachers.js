const teachersRouter = require('express').Router()
// const Blog = require('../models/blog')
const Teacher = require('../models/teacher')
// const Comment = require('../models/comment')
const jwt = require('jsonwebtoken')
const { getTokenFromReq } = require('../utils/getTokenFromReq')

teachersRouter.post('/', async (request, response, next) => {
	// const teacher = new Teacher(request.body)

	console.log('New teacher body', request.body)

	const token = getTokenFromReq(request)

	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
			return response.status(401).json({
				error: 'Unauthorized. Token is missing or invalid'
			})
		}

		const { name } = { ...request.body }

		if (!name) {
			return response.status(400).send({
				error: 'Some data fields are missing.'
			}).end()
		}

		const teacher = new Teacher(request.body)
		const newTeacher = await teacher.save()

		return response.status(200).json({ newTeacher })

		/*
		const user = await User.findById(decodedToken.id)

		if (!body.title || !body.url) {
			response.status(400).json({
				error: 'Title or url is missing'
			}).end()
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
		} */
	} catch (exception) {
		next(exception)
	}
})

teachersRouter.get('/', async (request, response) => {
	const blogs = await Blog
		.find({})
		.populate('user', { username: 1, name: 1 })
		.populate('comments', { content: 1 })
	response.json(blogs.map(blogs => blogs.toJSON()))
})

teachersRouter.post('/:id/comments', async (request, response, next) => {
	const blog = await Blog.findById(request.params.id)
	const comment = new Comment({
		content: request.body.content,
		blog: blog._id
	})

	try {
		const savedComment = await comment.save()
		blog.comments = blog.comments.concat(savedComment._id)
		await blog.save()
		response.json(savedComment.toJSON())
	} catch (exception) {
		next(exception)
	}
})

// increase amount of likes
teachersRouter.put('/:id', async (request, response, next) => {
	try {
		const updatedBlog = await Blog
			.findByIdAndUpdate(request.params.id, { $inc: { likes : 1 } })
			.populate('user', { username: 1, name: 1 })
		response.json(updatedBlog.toJSON())
	} catch (exception) {
		next(exception)
	}
})

teachersRouter.delete('/:id', async (request, response, next) => {
	const token = getTokenFrom(request)
	try {
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
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

module.exports = teachersRouter
