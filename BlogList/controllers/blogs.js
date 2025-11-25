const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title) {
    return response.status(400).json({ error: 'Title is missing'})
  }

  if (!body.url) {
    return response.status(400).json({ error: 'URL is missing'})
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blogToPut = await Blog.findByIdAndUpdate(
    request.params.id,  
    {  title, author, url, likes },
    { new: true },
  )

  response.status(200).json(blogToPut)
})


module.exports = blogsRouter