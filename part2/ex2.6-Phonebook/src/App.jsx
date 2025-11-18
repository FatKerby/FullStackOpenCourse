import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [allPersons, setAllPersons] = useState([])
  const [newPerson, setNewPerson] = useState({ name: "", number: "" })
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setAllPersons(initialPersons)
      })
  }, [])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [notification])

  const addPerson = (event) => {
    event.preventDefault()
    const isDuplicate = allPersons.find(
      (person) => person.name === newPerson.name.trim()
    )

    if (!isDuplicate) {
      personService
        .create(newPerson)
        .then((returnedPerson) => {
          setAllPersons(allPersons.concat(returnedPerson))
          setNewPerson({ name: "", number: "" })
          setNotification({
            type: "success",
            text: `${returnedPerson.name} was added.`,
          })
        })
        .catch((error) => {
          setNotification({
            type: "error",
            text: error.response?.data?.error || "unknown error",
          })
        })
    } else {
      if (
        window.confirm(
          `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(isDuplicate.id, newPerson)
          .then((updatedPerson) => {
            setAllPersons((prevPersons) =>
              prevPersons.map((person) =>
                person.id !== updatedPerson.id ? person : updatedPerson
              )
            )
            setNewPerson({ name: "", number: ""})
            setNotification({
              type: "success",
              text: `${updatedPerson.name} was updated.`
            })
          })
          .catch((error) => {
            if (error.response?.status === 404) {
              setAllPersons((prevPersons) =>
              prevPersons.filter((person) => person.id !== isDuplicate.id)
            )
            setNotification({
              type: "error",
              text: `Information of ${newPerson.name} has already removed from server`,
            })
            } else {
              setNotification({
                type: "error",
                text: error.response?.data?.error || "unknown error",
              })
            }

          })
      }
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

  const handleRemove = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setAllPersons((prevPersons) =>
            prevPersons.filter((person) => person.id !== id)
          )
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
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
        handleRemove={handleRemove}
      />
    </div>
  )
}

export default App