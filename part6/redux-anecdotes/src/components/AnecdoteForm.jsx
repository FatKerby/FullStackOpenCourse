import { useDispatch } from 'react-redux'
import { appendAnecdote } from '../reducers/anecdoteReducer'
import { displayNotification, removeNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(appendAnecdote(content))
    dispatch(displayNotification(`You added '${content}'`))
    setTimeout(() => {
      dispatch(removeNotification())
      }, 5000
    )
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">add</button>
      </form>
    </>
  )
}

export default AnecdoteForm