const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const { GraphQLError } = require('graphql')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      /*
      if (args.author && args.genre) {
        return books.filter(book => book.author === args.author && book.genres.includes(args.genre))
      }
      if (args.author) {
        return books.filter(book => book.author === args.author)
      }
      if (args.genre) {
        return books.filter(book => book.genres.includes(args.genre))
      }
      */
      return Book.find({})
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: (root) => {
      const foundBooks = books.filter(book => book.author === root.name)
      return foundBooks.length
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('User not authenticated.', {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
      }

      const bookExists = await Book.exists({ title: args.title })

      if (bookExists) {
        throw new GraphQLError(`Book must be unique: ${args.title}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }

      const book = new Book({ ...args })
      return book.save()
    },
    editAuthor: async (root, args) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('User not authenticated.', {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
      }
      
      const author = await Author.findOne({ name: args.name })
      if (author) {
        author.born = args.setBornTo
      }
      return null
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })

      try {
        return await user.save()
      } catch (error) {
        let errorMessage = "Creating user failed"

        if (error instanceof mongoose.Error.ValidationError) {
          console.log(error.message)

          if (error.errors.hasOwnProperty("username")) {
            errorMessage = "Create user failed. Username not valid."
          } else if (error.errors.hasOwnProperty("favoriteGenre")) {
            errorMessage = "Create user failed. Favorite genre not valid."
          }
          throw new GraphQLError(errorMessage, {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          })
        } else {
          console.log(error)
          throw new GraphQLError(errorMessage)
        }
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'QWERTY' ) {
        throw new GraphQLError('Wrong credentials.', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  }
}

module.exports = resolvers