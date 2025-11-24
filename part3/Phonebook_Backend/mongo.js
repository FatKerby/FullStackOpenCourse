const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://admin:${password}@cluster0.mya568p.mongodb.net/phonebookApp?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('Phonebook:')
  Person
    .find({})
    .then(result => {
      result.forEach(persons => {
        console.log(`${persons.name} ${persons.number}`)
      })
      mongoose.connection.close()
    })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person
    .save()
    .then(() => {
      console.log(`Added ${process.argv[3]} with number ${process.argv[4]} to phonebook.`)
      mongoose.connection.close()
    })
}