const Blog = require('../models/blog')

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

module.exports = {
    initialBlogs,
}