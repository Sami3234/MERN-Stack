import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './BlogList.css'

const API_URL = 'http://localhost:5000/api'

const BlogList = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_URL}/blogs`)
        if (!response.ok) {
          throw new Error('Failed to fetch blogs')
        }
        const data = await response.json()
        setBlogs(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="blog-list">
      <h1>Latest Blog Posts</h1>
      <div className="blogs-grid">
        {blogs.map(blog => (
          <div key={blog._id} className="blog-card">
            <h2>{blog.title}</h2>
            <p className="blog-excerpt">{blog.content.substring(0, 150)}...</p>
            <div className="blog-meta">
              <span className="author">By {blog.author}</span>
              <span className="date">{new Date(blog.date).toLocaleDateString()}</span>
            </div>
            <Link to={`/blog/${blog._id}`} className="read-more">
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BlogList 