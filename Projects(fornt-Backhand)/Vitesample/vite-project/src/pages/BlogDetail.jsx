import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './BlogDetail.css'

const API_URL = 'http://localhost:5000/api'

const BlogDetail = () => {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${API_URL}/blogs/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch blog')
        }
        const data = await response.json()
        setBlog(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!blog) {
    return <div className="error">Blog not found</div>
  }

  return (
    <div className="blog-detail">
      <article className="blog-content">
        <h1>{blog.title}</h1>
        <div className="blog-meta">
          <span className="author">By {blog.author}</span>
          <span className="date">{new Date(blog.date).toLocaleDateString()}</span>
        </div>
        <div className="blog-body">
          {blog.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  )
}

export default BlogDetail 