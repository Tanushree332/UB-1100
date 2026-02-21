import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Check, X, Calendar, Flag } from 'lucide-react';
import { saveToStorage, getFromStorage } from '../utils/storage';
import confetti from 'canvas-confetti';

const TodoList = ({ onTaskComplete }) => {
  const [todos, setTodos] = useState(() => getFromStorage('todos', []));
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  useEffect(() => {
    saveToStorage('todos', todos);
  }, [todos]);

  const addTask = () => {
    if (!newTask.trim()) return;

    const newTodo = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      priority: priority,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
    };

    setTodos([...todos, newTodo]);
    setNewTask('');
    setPriority('Medium');
    setDueDate('');
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const wasCompleted = todo.completed;
          const nowCompleted = !wasCompleted;
          
          if (nowCompleted && !wasCompleted) {
            // Task just completed
            confetti({
              particleCount: 30,
              spread: 50,
              origin: { y: 0.6 },
            });
            if (onTaskComplete) onTaskComplete();
            return { ...todo, completed: nowCompleted, completedAt: new Date().toISOString() };
          } else {
            return { ...todo, completed: nowCompleted, completedAt: null };
          }
        }
        return todo;
      })
    );
  };

  const deleteTask = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
    setPriority(todo.priority);
    setDueDate(todo.dueDate || '');
  };

  const saveEdit = () => {
    setTodos(
      todos.map((todo) =>
        todo.id === editingId
          ? { ...todo, text: editText, priority, dueDate: dueDate || null }
          : todo
      )
    );
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'Medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'Low':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-gray-300 bg-gray-50 dark:bg-gray-800';
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
    >
      <div className="flex items-center gap-2 mb-6">
        <Check className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">To-Do List</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="text-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{todos.length}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
        </div>
        <div className="text-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{activeCount}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Active</div>
        </div>
        <div className="text-center p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <div className="text-xl font-bold text-green-600 dark:text-green-400">{completedCount}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Done</div>
        </div>
      </div>

      {/* Add Task Form */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addTask}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:outline-none"
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold capitalize transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white/50 dark:bg-gray-700/50 hover:bg-white/80'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Todo List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {sortedTodos.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No tasks yet. Add one above!
            </p>
          ) : (
            sortedTodos.map((todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`glass-card p-4 border-l-4 ${getPriorityColor(todo.priority)} ${
                  todo.completed ? 'opacity-75' : ''
                }`}
              >
                {editingId === todo.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border-2 border-purple-500 focus:outline-none"
                      autoFocus
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border-2 border-purple-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border-2 border-purple-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleComplete(todo.id)}
                      className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        todo.completed
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {todo.completed && <Check className="w-4 h-4 text-white" />}
                    </motion.button>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium ${
                          todo.completed
                            ? 'line-through text-gray-500 dark:text-gray-400'
                            : 'text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {todo.text}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Flag className="w-3 h-3" />
                          <span className="capitalize">{todo.priority}</span>
                        </div>
                        {todo.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(todo.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {!todo.completed && (
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEdit(todo)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteTask(todo.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TodoList;
