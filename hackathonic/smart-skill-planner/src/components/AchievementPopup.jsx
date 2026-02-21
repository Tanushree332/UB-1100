import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import confetti from 'canvas-confetti';

const AchievementPopup = ({ achievement, onClose }) => {
  if (!achievement) return null;

  // Trigger confetti when achievement is shown
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card max-w-md w-full mx-4 p-8 relative"
          onAnimationComplete={triggerConfetti}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-8xl mb-4"
            >
              {achievement.icon}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-3xl font-bold mb-2 gradient-text">Achievement Unlocked!</h2>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                {achievement.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {achievement.description}
              </p>
            </motion.div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Awesome!
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AchievementPopup;
