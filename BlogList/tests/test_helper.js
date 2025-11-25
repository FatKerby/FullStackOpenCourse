const Blog = require('../models/blog')
const User = require('../models/user')

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

const initialUsers = [
  {
    username: 'user-1',
    name: 'user1',
    password: 'user1'
  },
  {
    username: 'user-2',
    name: 'user2',
    password: 'user2'
  }
]

const userWithOutUsername = {
  name: 'user3',
  password: 'user3'
}

const userWithOutPassword = {
  username: 'user-4',
  name: 'user4'
}

const userWithShortPassword = {
  username: 'user-5',
  name: 'user5',
  password: 'u5'
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDb,
    initialUsers,
    userWithOutUsername,
    userWithOutPassword,
    userWithShortPassword,
    usersInDb
}