import { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleVisibility = () => {
    setShowDetails(!showDetails)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    paddingBottom: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog)
    }
  }

  return (
    <div className='blog' style={blogStyle}>
      <div>
        {'"'}{blog.title}{'"'} {'by'} {blog.author}{' '}
        <button id='toggle-visibility-button' onClick={() => toggleVisibility()}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <>
          <a href={blog.url}>{blog.url}</a>
          <div>
            {blog.likes} likes{' '}
            <button id='likes-button' onClick={() => updateLikes(blog)}>like</button>
          </div>
          <div>
            {blog.user.name}
          </div>
          {blog.user.username === user.username && (
            <div>
              <button id='remove-button' onClick={handleDelete}>remove</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Blog