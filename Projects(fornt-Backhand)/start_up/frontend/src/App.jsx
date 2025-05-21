import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    completed: undefined,
    priority: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1
  });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, [filter]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filter);
      const response = await axios.get(`${API_URL}?${params}`);
      setTodos(response.data.todos);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos. Please try again later.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      const response = await axios.post(API_URL, newTodo);
      setTodos([response.data, ...todos]);
      setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '' });
      setError(null);
    } catch (err) {
      setError('Failed to add todo. Please try again.');
      console.error('Error adding todo:', err);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, { completed: !completed });
      setTodos(todos.map(todo => todo._id === id ? response.data : todo));
      setError(null);
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    if (deletingId) return; // Prevent multiple deletions

    try {
      setDeletingId(id);
      await axios.delete(`${API_URL}/${id}`);
      
      // Start the fade-out animation
      const todoElement = document.querySelector(`[data-todo-id="${id}"]`);
      if (todoElement) {
        todoElement.classList.add('deleting');
      }

      // Wait for animation to complete before removing from state
      setTimeout(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
        setDeletingId(null);
      }, 500);
      
      setError(null);
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
      console.error('Error deleting todo:', err);
      setDeletingId(null);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleSort = (field) => {
    setFilter(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="app">
      <header>
        <h1>Professional Todo App</h1>
        {error && <div className="error-message">{error}</div>}
      </header>

      <div className="filters">
        <input
          type="text"
          name="search"
          value={filter.search}
          onChange={handleFilterChange}
          placeholder="Search todos..."
          className="search-input"
        />
        <select name="priority" value={filter.priority} onChange={handleFilterChange}>
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select name="completed" value={filter.completed} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="true">Completed</option>
          <option value="false">Pending</option>
        </select>
      </div>

      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={newTodo.title}
          onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Todo title..."
          className="todo-input"
          required
        />
        <textarea
          value={newTodo.description}
          onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Description (optional)"
          className="todo-description"
        />
        <select
          value={newTodo.priority}
          onChange={(e) => setNewTodo(prev => ({ ...prev, priority: e.target.value }))}
          className="priority-select"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <input
          type="date"
          value={newTodo.dueDate}
          onChange={(e) => setNewTodo(prev => ({ ...prev, dueDate: e.target.value }))}
          className="due-date"
        />
        <button type="submit" className="add-button">Add Todo</button>
      </form>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="todo-list">
          {todos.map(todo => (
            <div 
              key={todo._id} 
              data-todo-id={todo._id}
              className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.priority} ${deletingId === todo._id ? 'deleting' : ''}`}
            >
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo._id, todo.completed)}
                  className="todo-checkbox"
                />
                <div className="todo-details">
                  <h3>{todo.title}</h3>
                  {todo.description && <p>{todo.description}</p>}
                  <div className="todo-meta">
                    <span className={`priority ${todo.priority}`}>{todo.priority}</span>
                    {todo.dueDate && (
                      <span className={`due-date ${todo.isOverdue ? 'overdue' : ''}`}>
                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="delete-button"
                disabled={deletingId === todo._id}
              >
                {deletingId === todo._id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App; 