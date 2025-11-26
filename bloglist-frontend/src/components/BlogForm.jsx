import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: '',
  })

  const handleAddBlog = async (event) => {
    event.preventDefault()
    const success = await addBlog(newBlog)
    if (success) setNewBlog({ title: '', author: '', url: '' })
  }

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog((newBlog) => ({
      ...newBlog,
      [name]: value,
    }))
  }

  return (
    <form onSubmit={handleAddBlog}>
      <div>
        Title: 
        <input
          id="title"
          type="text"
          value={newBlog.title}
          name="title"
          onChange={handleBlogChange}
        />
      </div>
      <div>
        Author: 
        <input
          id="author"
          type="text"
          value={newBlog.author}
          name="author"
          onChange={handleBlogChange}
        />
      </div>
      <div>
        URL: 
        <input
          id="url"
          type="text"
          value={newBlog.url}
          name="url"
          onChange={handleBlogChange}
        />
      </div>
      <br />
      <button id="create-button" type="submit">Create</button>
    </form>
  )
}

export default BlogForm