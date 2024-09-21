import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { FaPencilAlt, FaTrash, FaCheck } from 'react-icons/fa';  // Importing icons

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Fetch tasks when the component mounts
  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks when component mounts
  }, [token]);

  // Toggle task completion status
  const toggleTaskCompletion = async (taskId, completed) => {
    try {
      await axiosInstance.put(
        `/tasks/${taskId}`,
        { completed: !completed },  // Toggle completed status
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();  // Refresh tasks after updating
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Edit a task
  const handleEditTask = async (taskId) => {
    try {
      await axiosInstance.put(
        `/tasks/${taskId}`,
        { title: editTitle, description: editDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();  // Fetch tasks again after editing
      setEditingTaskId(null);  // Exit edit mode
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();  // Fetch tasks again after deleting
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Enter edit mode and pre-fill inputs with the task data
  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);  // Pre-fill title for editing
    setEditDescription(task.description);  // Pre-fill description for editing
  };

  return (
    <div className="min-h-screen bg-dark-gray p-6">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Your Tasks</h1>

      {/* Task list */}
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="bg-gray-800 p-4 rounded-lg flex justify-between items-center text-white"
          >
            {editingTaskId === task._id ? (
              <div className="flex flex-col w-full">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2 mb-2 bg-gray-700 text-white border border-green-500 rounded-md focus:outline-none focus:ring-4 focus:ring-green-600"
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2 mb-4 bg-gray-700 text-white border border-green-500 rounded-md focus:outline-none focus:ring-4 focus:ring-green-600"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => handleEditTask(task._id)}
                    className="p-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-all"
                  >
                    <FaCheck /> {/* Save Icon */}
                  </button>
                  <button
                    onClick={() => setEditingTaskId(null)}
                    className="p-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-all"
                  >
                    <FaTrash /> {/* Cancel/Delete Icon */}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                  {/* Rounded Checkbox */}
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task._id, task.completed)}
                    className="h-6 w-6 rounded-full border-gray-400 focus:ring-green-500"
                  />
                  <span className={`ml-4 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.title} - {task.description}
                  </span>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleEditClick(task)}
                    className="p-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition-all"
                  >
                    <FaPencilAlt /> {/* Edit Icon */}
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="p-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-all"
                  >
                    <FaTrash /> {/* Delete Icon */}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
