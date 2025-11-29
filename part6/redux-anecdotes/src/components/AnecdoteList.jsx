import { useDispatch, useSelector } from 'react-redux'
import { increaseVotes } from '../reducers/anecdoteReducer'
import { newNotification } from '../reducers/notificationReducer'


const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </>
  )
}

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    return ( filter === 'ALL' )
      ? anecdotes
      : anecdotes.filter((anecdote => 
          anecdote.content.includes(filter)
      ))
  })

  return (
    <>
      {anecdotes
        .slice()
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote => (
          <Anecdote
            key={anecdote.id}
            anecdote={anecdote}
            handleClick={() => {
              dispatch(increaseVotes(anecdote))
              dispatch(newNotification(`You voted '${anecdote.content}'`, 10))
            }}
          />
        ))
      }
    </>
  )
}

export default AnecdoteList