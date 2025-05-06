import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import BlogList from './pages/BlogList'
import CreateBlog from './pages/CreateBlog'
import BlogDetail from './pages/BlogDetail'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/create" element={<CreateBlog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
