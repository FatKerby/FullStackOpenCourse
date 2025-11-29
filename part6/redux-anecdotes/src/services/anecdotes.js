const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json()
}

const createNew = async (content) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  }
  
  const response = await fetch(baseUrl, options)
  
  if (!response.ok) {
    throw new Error('Failed to create note')
  }
  
  return await response.json()
}

const saveVote = async (anecdote) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  }
  
  const response = await fetch(`${baseUrl}/${anecdote.id}`, options)
  
  if (!response.ok) {
    throw new Error('Failed to create note')
  }
  
  return await response.json()
}

export default { getAll, createNew, saveVote }