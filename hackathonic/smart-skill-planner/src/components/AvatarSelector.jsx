import { motion } from 'framer-motion';
import { avatars } from '../data/avatars';

const AvatarSelector = ({ selectedAvatar, onSelect }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
        Choose Your Avatar
      </label>
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-3">
        {avatars.map((avatar) => (
          <motion.button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-xl text-3xl transition-all duration-200 ${
              selectedAvatar === avatar.id
                ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg ring-2 ring-purple-300 dark:ring-purple-600'
                : 'bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-700/80'
            }`}
          >
            {avatar.emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default AvatarSelector;
