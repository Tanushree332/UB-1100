import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const AchievementBadge = ({ achievement, unlocked }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: unlocked ? 1 : 0.8 }}
      whileHover={{ scale: unlocked ? 1.1 : 0.9 }}
      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
        unlocked
          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 dark:border-yellow-600 shadow-lg'
          : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-60'
      }`}
    >
      <div className="text-center">
        <div className="text-4xl mb-2">{achievement.icon}</div>
        <h4 className={`font-bold text-sm ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
          {achievement.name}
        </h4>
        <p className={`text-xs mt-1 ${unlocked ? 'text-gray-700' : 'text-gray-400'}`}>
          {achievement.description}
        </p>
        {unlocked && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2"
          >
            <Trophy className="w-4 h-4 mx-auto text-yellow-600" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AchievementBadge;
