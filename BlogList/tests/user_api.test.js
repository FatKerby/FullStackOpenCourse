const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

describe('Adding users.', () => {
  test('Missing username returns 400 error and does not add to DB.', async () => {
    await api
      .post('/api/users')
      .send(helper.userWithOutUsername)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
  })

  test('Missing password returns 400 error and does not add to DB.', async () => {
    await api
      .post('/api/users')
      .send(helper.userWithOutPassword)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
  })

  test('Password under 3 characters returns 400 error and does not add to DB.', async () => {
    await api
      .post('/api/users')
      .send(helper.userWithShortPassword)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})