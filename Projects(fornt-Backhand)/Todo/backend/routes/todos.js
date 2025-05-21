import express from 'express';
import Todo from '../models/Todo.js';

const router = express.Router();

// Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new todo
router.post('/', async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
      mobileNumber: req.body.mobileNumber,
      fatherName: req.body.fatherName,
      address: req.body.address,
      priority: req.body.priority,
      dueDate: req.body.dueDate
    });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a todo
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    // Update all fields
    todo.text = req.body.text || todo.text;
    todo.mobileNumber = req.body.mobileNumber || todo.mobileNumber;
    todo.fatherName = req.body.fatherName || todo.fatherName;
    todo.address = req.body.address || todo.address;
    todo.priority = req.body.priority || todo.priority;
    todo.dueDate = req.body.dueDate || todo.dueDate;
    todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    await todo.deleteOne();
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 