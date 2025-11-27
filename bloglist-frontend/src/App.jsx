import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs( sortBlogs(blogs) )
    })
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
      blogFormRef.current.toggleVisibility()
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

  const deleteBlog = async ({ id, title, author }) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))
      handleNotification(`Blog "${title}" by ${author} was deleted.`, 'success')
    } catch (error) {
      handleError(error)
    }
  }

  const sortBlogs = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }

  const updateLikes = async (blog) => {
    const { id, title, author, url, likes } = blog
    try {
      const updatedBlog = await blogService.update({
        id,
        title,
        author,
        url,
        likes: likes + 1,
      })
      setBlogs(
        sortBlogs(blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog)))
      )
    } catch (error) {
      handleError(error)
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

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <h2>Create New:</h2>
      <BlogForm addBlog={addBlog} />
    </Togglable>
  )

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
          {blogForm()}
          <br />
          <h2>Blog List</h2>
          <div>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} updateLikes={updateLikes} deleteBlog={deleteBlog} user={user}/>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default App