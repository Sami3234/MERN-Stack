const TodoItem = ({ todo, onToggle, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#2ecc71';
      default:
        return '#95a5a6';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="todo-item" style={{ borderLeft: `4px solid ${getPriorityColor(todo.priority)}` }}>
      <div className="todo-header">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo._id)}
          className="todo-checkbox"
        />
        <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
          {todo.text}
        </span>
        <button onClick={() => onDelete(todo._id)} className="delete-button">
          Delete
        </button>
      </div>

      <div className="todo-details">
        {todo.mobileNumber && (
          <div className="detail-item">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{todo.mobileNumber}</span>
          </div>
        )}
        
        {todo.fatherName && (
          <div className="detail-item">
            <span className="detail-label">Father's Name:</span>
            <span className="detail-value">{todo.fatherName}</span>
          </div>
        )}
        
        {todo.address && (
          <div className="detail-item">
            <span className="detail-label">Address:</span>
            <span className="detail-value">{todo.address}</span>
          </div>
        )}
        
        {todo.dueDate && (
          <div className="detail-item">
            <span className="detail-label">Due Date:</span>
            <span className="detail-value">{formatDate(todo.dueDate)}</span>
          </div>
        )}
        
        <div className="detail-item">
          <span className="detail-label">Priority:</span>
          <span className="detail-value" style={{ color: getPriorityColor(todo.priority) }}>
            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TodoItem; 