import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    addVote(state, action) {
      return state.map(anecdote => 
        anecdote.id !== action.payload.id 
          ? anecdote 
          : action.payload
      )
    }
  },
})

const { createAnecdote, setAnecdotes, addVote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const increaseVotes = (anecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.saveVote({
      ...anecdote,
      votes: anecdote.votes + 1
    })
    dispatch(addVote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer
