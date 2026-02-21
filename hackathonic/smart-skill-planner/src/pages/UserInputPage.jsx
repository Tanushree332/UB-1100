import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import AvatarSelector from '../components/AvatarSelector';

const UserInputPage = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    dailyHours: 2,
    durationMonths: 3,
    skillLevel: 'Beginner',
    avatar: 'avatar-1',
  });

  const domains = [
    'Game Development',
    'AI',
    'Drawing',
    'Singing',
    'Coding',
  ];

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.domain) {
      alert('Please fill in all required fields!');
      return;
    }
    onSubmit(formData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="glass-card">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-block mb-4"
            >
              <Sparkles className="w-16 h-16 text-purple-500" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-2 gradient-text">
              Smart Skill Planner
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create your personalized learning roadmap in minutes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Your Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-200"
                placeholder="Enter your name"
                required
              />
            </div>

            <AvatarSelector
              selectedAvatar={formData.avatar}
              onSelect={(avatar) => setFormData({ ...formData, avatar })}
            />

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Interested Domain *
              </label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-200"
                required
              >
                <option value="">Select a domain</option>
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Daily Free Hours: {formData.dailyHours}h
              </label>
              <input
                type="range"
                min="1"
                max="8"
                value={formData.dailyHours}
                onChange={(e) => setFormData({ ...formData, dailyHours: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>1h</span>
                <span>8h</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Roadmap Duration: {formData.durationMonths} months
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[1, 2, 3, 4, 6, 12].map((months) => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setFormData({ ...formData, durationMonths: months })}
                    className={`py-2 rounded-lg font-semibold transition-all duration-200 ${
                      formData.durationMonths === months
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                        : 'bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-700/80'
                    }`}
                  >
                    {months}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Skill Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {skillLevels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, skillLevel: level })}
                    className={`py-3 rounded-xl font-semibold transition-all duration-200 ${
                      formData.skillLevel === level
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-700/80'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              Create My Roadmap
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default UserInputPage;
