const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const { GraphQLError } = require('graphql')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author) {
        const foundAuthor = await Author.findOne({ name: args.author })
        if (foundAuthor) {
          if (args.genre) {
            return await Book.find({ author: foundAuthor.id, genres: { $in: [args.genre] } }).populate('author')
          }
          return await Book.find({ author: foundAuthor.id }).populate('author')
        }
        return null
      }

      if (args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate('author')
      }

      return Book.find({}).populate('author')
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      const foundAuthor = await Author.findOne({ name: root.name })
      const foundBooks = await Book.find({ author: foundAuthor.id })
      return foundBooks.length
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const foundBook = await Book.findOne({ title: args.title })
      const foundAuthor = await Author.findOne({ name: args.author.name })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('User not authenticated.', {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
      }

      if (foundBook) {
        throw new GraphQLError(`Book must be unique: ${args.title}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }

      if (!foundAuthor) {
        const author = new Author({ ...args.author })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError(error.message, {
            invalidArgs: args,
          })
        }
      }

      const savedAuthor = await Author.findOne({ name: args.author.name })
      const book = new Book({ ...args, author: savedAuthor })

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          invalidArgs: args
        })
      }

      return book
    },
    editAuthor: async (root, args, context) => {
      const author = await Author.findOne({ name: args.name })
      
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('User not authenticated.', {
          extensions: {
            code: 'UNAUTHENTICATED',
          }
        })
      }

      if (!author) {
        return null
      }

      const filter = { name: args.name }
      const options = {}
      const updateDoc = {
        $set: {
          born: args.setBornTo
        },
      }
      console.log({updateDoc});
      
      
      await Author.updateOne(filter, updateDoc, options)
      const author2 = await Author.findOne({ name: args.name })
      console.log({author2})
      
      return await Author.findOne({ name: args.name })
    },
    createUser: (root, args) => {
      const user = new User({ ...args })

      return user.save()
        .catch(err => {
          throw new GraphQLError(err.message, {
            invalidArgs: args,
          })
        })
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
    },
  }
}

module.exports = resolvers