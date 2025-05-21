import axios from 'axios';

const API_URL = 'http://localhost:5000/api/todos';

export const getAllTodos = () => axios.get(API_URL);

export const createTodo = (todoData) => axios.post(API_URL, todoData);

export const updateTodo = (id, todoData) => axios.put(`${API_URL}/${id}`, todoData);

export const deleteTodo = (id) => axios.delete(`${API_URL}/${id}`); 