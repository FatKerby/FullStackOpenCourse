import { useMutation, useQuery } from '@apollo/client/react'
import { useState } from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

export const EditAuthor = (props) => {
  const [name, setName] = useState('')
  const [setBornTo, setBorn] = useState('')
  const result = useQuery(ALL_AUTHORS)

  const [updatedAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  if (!props.show) {
    return null
  }
  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  const submit = async (event) => {
    event.preventDefault()

    updatedAuthor({ variables: { name, setBornTo } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name:
          <select defaultValue={''} onChange={(e) => setName(e.target.value)}>
            {authors.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born:
          <input
            type="number"
            value={setBornTo}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default EditAuthor