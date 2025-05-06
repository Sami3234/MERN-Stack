import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CreateBlog.css'

const API_URL = 'http://localhost:5000/api'

const CreateBlog = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: ''
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to create blog')
      }

      navigate('/blogs')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="create-blog">
      <h1>Create New Blog Post</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish Blog'}
        </button>
      </form>
    </div>
  )
}

export default CreateBlog 