import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [allPersons, setAllPersons] = useState([])
  const [newPerson, setNewPerson] = useState({ name: "", number: "" })
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setAllPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const isDuplicate = allPersons.some((person) => person.name === newPerson.name)

    if (!isDuplicate) {
      personService
        .create(newPerson)
        .then((returnedPerson) => {
          setAllPersons(allPersons.concat(returnedPerson))
          setNewPerson({ name: "", number: "" })
        })
    } else {
      alert(newPerson.name + ' is already added to phonebook.')
    }
  }

  const handleFormChange = ({ target: { name, value } }) => {
    setNewPerson((newPerson) => ({
      ...newPerson,
      [name]: value,
    }))
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
}  

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm 
        newPerson={newPerson}
        handleSubmit={addPerson}
        handleFormChange={handleFormChange}
      />
      <h3>Numbers</h3>
      <Persons
        filterStr={newFilter}
        allPersons={allPersons}
      />
    </div>
  )
}

export default App