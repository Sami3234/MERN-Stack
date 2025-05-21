import { useState } from 'react';

const TodoForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    text: '',
    mobileNumber: '',
    fatherName: '',
    address: '',
    priority: 'medium',
    dueDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;
    onAdd(formData);
    setFormData({
      text: '',
      mobileNumber: '',
      fatherName: '',
      address: '',
      priority: 'medium',
      dueDate: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-group">
        <input
          type="text"
          name="text"
          value={formData.text}
          onChange={handleChange}
          placeholder="Task description..."
          className="todo-input"
          required
        />
      </div>

      <div className="form-group">
        <input
          type="tel"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          placeholder="Mobile Number (10 digits)"
          className="todo-input"
          pattern="[0-9]{10}"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
          placeholder="Father's Name"
          className="todo-input"
        />
      </div>

      <div className="form-group">
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="todo-input"
        />
      </div>

      <div className="form-group">
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="todo-input"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      <div className="form-group">
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="todo-input"
        />
      </div>

      <button type="submit" className="add-button">Add Todo</button>
    </form>
  );
};

export default TodoForm; 