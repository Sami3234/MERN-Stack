import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'student'
  });
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  // COMSATS Campuses
  const campuses = [
    'Islamabad',
    'Lahore',
    'Sahiwal',
    'Attock',
    'Wah',
    'Abbottabad',
    'Vehari'
  ];

  // COMSATS Departments
  const departments = [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Business Administration',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Economics',
    'Psychology',
    'English'
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
      fetchStudents();
    }
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students');
      setStudents(response.data);
    } catch (error) {
      showNotification('Error fetching students', 'error');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Attempting login with:', formData); // Debug log
      const response = await axios.post('/api/auth/login', formData);
      console.log('Login response:', response.data); // Debug log
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setIsLoggedIn(true);
        setUser(user);
        showNotification('Login successful!', 'success');
        fetchStudents();
      } else {
        showNotification(response.data.message || 'Login failed', 'error');
      }
    } catch (error) {
      console.error('Login error:', error); // Debug log
      showNotification(
        error.response?.data?.message || 
        'Unable to connect to server. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    showNotification('Logged out successfully', 'success');
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <div className="comsats-header">
            <img src="/comsats-logo.png" alt="COMSATS Logo" className="comsats-logo" />
            <h2>COMSATS University Portal</h2>
          </div>
          <form onSubmit={handleLogin} className="auth-form">
            <h2>Welcome Back!</h2>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                className="form-control"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <img src="/comsats-logo.png" alt="COMSATS Logo" />
          <span>COMSATS University Portal</span>
        </div>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <span className="department-badge">{user?.role}</span>
          <button onClick={handleLogout} className="btn btn-primary">Logout</button>
        </div>
      </nav>

      <div className="dashboard">
        <div className="campus-selector">
          <select className="form-control">
            {campuses.map((campus) => (
              <option key={campus} value={campus}>{campus} Campus</option>
            ))}
          </select>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Total Students</h3>
            <p>{students.length}</p>
          </div>
          <div className="stat-card">
            <h3>Active Students</h3>
            <p>{students.filter(s => s.status === 'active').length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Teachers</h3>
            <p>50</p>
          </div>
          <div className="stat-card">
            <h3>Total Courses</h3>
            <p>100</p>
          </div>
        </div>

        <div className="students-list">
          <h2>Student Records</h2>
          {students.map((student) => (
            <div key={student._id} className="student-card">
              <div className="student-info">
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Roll Number:</strong> {student.rollNumber}</p>
                <p><strong>Department:</strong> {student.department}</p>
                <p><strong>Campus:</strong> {student.campus}</p>
                <p><strong>Status:</strong> 
                  <span className={`status-badge status-${student.status}`}>
                    {student.status}
                  </span>
                </p>
                <p><strong>CGPA:</strong> 
                  <span className="grade-display">
                    {student.cgpa}
                  </span>
                </p>
              </div>
              {user?.role === 'teacher' && (
                <div className="attendance-controls">
                  <button className="attendance-btn present">Present</button>
                  <button className="attendance-btn absent">Absent</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default App; 