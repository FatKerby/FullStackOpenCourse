import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginUser = async (loginCredentials) => {  
    try {
      const user = await loginService.login(loginCredentials)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user)) 
      blogService.setToken(user.token)
      setUser(user)
    } catch (error) {
      handleError(error)
    }
  }

  const logOutUser = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (newBlog) => {
    try {
      const addedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(addedBlog))
      handleNotification(
        `A new blog "${addedBlog.title}" by ${addedBlog.author} was added.`,
        'success'
      )
      return true
    } catch (error) {
      handleError(error)
      return false
    }
  }

  const handleNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  const handleError = (err) => {
    if (err.response.data.error) {
      handleNotification(err.response.data.error, 'error')
    } else {
      handleNotification('Unknown error. ', 'error')
    }
  }

  return (
    <div>
      {!user ? (
        <>
          <h2>Log in to application:</h2>
          <Notification notification={notification} />
          <LoginForm loginUser={loginUser} />
        </>
      ) : (
        <>
          <h2>Blogs App</h2>
          <Notification notification={notification} />
          <p>
            {user.name} is logged in.
          </p>
          <button onClick={logOutUser}>Logout</button>
          <br />
          <h2>Create New:</h2>
          <BlogForm addBlog={addBlog} />
          <br />
          <h2>Blog List</h2>
          <div>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default App