import { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { getAllTodos, createTodo, updateTodo, deleteTodo } from './api';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllTodos();
      setTodos(response.data);
    } catch (error) {
      setError('Failed to fetch todos. Please try again later.');
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (text) => {
    try {
      setError(null);
      const response = await createTodo(text);
      setTodos([response.data, ...todos]);
    } catch (error) {
      setError('Failed to add todo. Please try again.');
      console.error('Error creating todo:', error);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      setError(null);
      const response = await updateTodo(id);
      setTodos(todos.map(todo => 
        todo._id === id ? response.data : todo
      ));
    } catch (error) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      setError(null);
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      setError('Failed to delete todo. Please try again.');
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="app">
      <h1>Todo App</h1>
      {error && <div className="error">{error}</div>}
      <TodoForm onAdd={handleAddTodo} />
      {loading ? (
        <div className="loading">Loading todos...</div>
      ) : (
        <TodoList
          todos={todos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
        />
      )}
    </div>
  );
}

export default App; 