import { useApolloClient, useQuery } from '@apollo/client/react'
import { useState } from 'react'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import PhoneForm from './components/PhoneForm'
import { ALL_PERSONS } from './queries'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('phonebook-user-token'))
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)
  const client = useApolloClient()

  if (result.loading) {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <button onClick={onLogout}>logout</button>
      <Persons persons={result.data.allPersons} />
      <PersonForm setError={notify}/>
      <PhoneForm setError={notify} />
    </div>
  )
}

export default App