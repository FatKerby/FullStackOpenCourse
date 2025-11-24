const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {  
    "title": "Test Blog 1",
    "author": "Tester 1",
    "url": "test1.url",
    "likes": 1,
  },
  {
    "title": "Test Blog 2",
    "author": "Tester 2",
    "url": "test2.url",
    "likes": 2,
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(initialBlogs)
})

test('All notes are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
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

  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)

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

  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length)

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

  const blogsAtEnd = await blogsInDb()
  assert.strictEqual(blogsAtEnd.length, initialBlogs.length)

})

describe('Deletion of a note', () => {
  test('Succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[0]
console.log(blogToDelete.id);

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()

    const blogObjects = blogsAtEnd.map(n => n.title)
    assert(!blogObjects.includes(blogToDelete.title))

    assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})