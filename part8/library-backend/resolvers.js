const { GraphQLError } = require('graphql')
const { v1: uuid } = require('uuid')
const Book = require('./models/book')
const Author = require('./models/author')

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
  },
  Author: {
    bookCount: (root) => {
      const foundBooks = books.filter(book => book.author === root.name)
      return foundBooks.length
    }
  },
  Mutation: {
    addBook: async (root, args) => {
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
    editAuthor: (root, args) => {
      const author = authors.find(author => author.name === args.name)
      if (!author) {
        return null
      }

      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map(author => author.name === args.name ? updatedAuthor : author)
      return updatedAuthor
    }
  }
}

module.exports = resolvers