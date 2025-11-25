const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('All notes are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('Check "id" property name is not "_id"', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach((blog) => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

test('Check that a valid blog can be added', async () => {
  const newValidBlog = {
    "title": "newValidTitle",
    "author": "newValidTester",
    "url": "newValidURL",
    "likes": 999,
  }

  await api
    .post('/api/blogs')
    .send(newValidBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const title = blogsAtEnd.map(n => n.title)
  assert(title.includes('newValidTitle'))
})

test('Check that a 0 is added to likes is likes is missing', async () => {
  const noLikesBlog = {
    title: "newValidTitle",
    author: "newValidTester",
    url: "newValidURL",
  }

  const response = await api
    .post('/api/blogs')
    .send(noLikesBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const newBlog = response.body
  assert.strictEqual(newBlog.likes, 0)

})

test('Check that a 400 Bad Request is returned when title is missing', async () => {
  const noTitleBlog = {
    author: "newValidTester",
    url: "newValidURL",
    likes: 10
  }

  const response = await api
    .post('/api/blogs')
    .send(noTitleBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

})

test('Check that a 400 Bad Request is returned when URL is missing', async () => {
  const noURLBlog = {
    title: "newValidTitle",
    author: "newValidTester",
    likes: 10
  }

  const response = await api
    .post('/api/blogs')
    .send(noURLBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

})

describe('Updating a blog', () => {
  test('Succeeds when existing blog is updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    blogToUpdate.likes++

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(200)
    
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const updatedBlog = blogsAtEnd.find(
      (blog) => blog.id === blogToUpdate.id
    )
    assert.deepStrictEqual(updatedBlog, blogToUpdate)
  })
})

describe('Deleting a blog', () => {
  test('Succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const blogObjects = blogsAtEnd.map(n => n.title)
    assert(!blogObjects.includes(blogToDelete.title))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})