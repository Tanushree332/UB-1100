import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import confetti from 'canvas-confetti';

const TaskCard = ({ task, onToggle, index }) => {
  const handleToggle = () => {
    onToggle(task.id);
    if (!task.completed) {
      // Trigger confetti on completion
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`glass-card mb-4 cursor-pointer hover:shadow-2xl transition-all duration-200 ${
        task.completed ? 'opacity-75' : ''
      }`}
      onClick={handleToggle}
    >
      <div className="flex items-start gap-3">
        <button className="mt-1">
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400" />
          )}
        </button>
        <div className="flex-1">
          <h3 className={`font-semibold mb-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
            <span>⏱️ {task.estimatedHours}h</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
