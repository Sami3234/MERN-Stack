const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// Get all todos with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const {
      completed,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const query = {};
    
    // Filter by completion status
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }

    // Filter by priority
    if (priority) {
      query.priority = priority;
    }

    // Search in title and description
    if (search) {
      query.$text = { $search: search };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const todos = await Todo.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Todo.countDocuments(query);

    res.json({
      todos,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a todo
router.post('/', async (req, res) => {
  try {
    const todo = new Todo({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      tags: req.body.tags
    });

    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a todo
router.patch('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const updates = ['title', 'description', 'completed', 'priority', 'dueDate', 'tags'];
    updates.forEach(update => {
      if (req.body[update] !== undefined) {
        todo[update] = req.body[update];
      }
    });

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bulk operations
router.post('/bulk', async (req, res) => {
  try {
    const { operation, ids, data } = req.body;

    switch (operation) {
      case 'delete':
        await Todo.deleteMany({ _id: { $in: ids } });
        break;
      case 'update':
        await Todo.updateMany(
          { _id: { $in: ids } },
          { $set: data }
        );
        break;
      default:
        return res.status(400).json({ message: 'Invalid operation' });
    }

    res.json({ message: 'Bulk operation completed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 