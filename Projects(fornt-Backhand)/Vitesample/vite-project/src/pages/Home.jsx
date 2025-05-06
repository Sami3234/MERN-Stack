import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <h1>Welcome to MyBlog</h1>
        <p>Share your thoughts and stories with the world</p>
        <div className="hero-buttons">
          <Link to="/blogs" className="btn btn-primary">Read Blogs</Link>
          <Link to="/create" className="btn btn-secondary">Write a Blog</Link>
        </div>
      </div>
      
      <div className="features">
        <div className="feature">
          <h3>Write</h3>
          <p>Share your thoughts and experiences with our easy-to-use editor</p>
        </div>
        <div className="feature">
          <h3>Connect</h3>
          <p>Connect with other writers and readers in our community</p>
        </div>
        <div className="feature">
          <h3>Discover</h3>
          <p>Find interesting stories and perspectives from around the world</p>
        </div>
      </div>
    </div>
  )
}

export default Home 