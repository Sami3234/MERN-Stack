import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">MyBlog</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/blogs">Blogs</Link>
        <Link to="/create">Create Blog</Link>
      </div>
    </nav>
  )
}

export default Navbar