import { useDispatch, useSelector } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'


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
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote => (
          <Anecdote
            key={anecdote.id}
            anecdote={anecdote}
            handleClick={() => dispatch(vote(anecdote.id))}
          />
        ))
      }
    </>
  )
}

export default AnecdoteList