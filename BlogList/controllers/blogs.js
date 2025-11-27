const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { user } = request
  if (!user) {
    return response.status(401).json({ error: 'Invalid token.' })
  }

  const body = request.body

  if (!body.title) {
    return response.status(400).json({ error: 'Title is missing.'})
  }
  if (!body.url) {
    return response.status(400).json({ error: 'URL is missing.'})
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const { user } = request
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() === user._id.toString() ) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()  
  } else {
    response.status(401).json({ error: 'Authentication failed.'})
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blogToPut = await Blog
    .findByIdAndUpdate(
      request.params.id,  
      {  title, author, url, likes },
      { new: true },
    )
    .populate('user', { username: 1, name: 1 })

  response.status(200).json(blogToPut)
})


module.exports = blogsRouter