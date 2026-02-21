import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles, Target } from 'lucide-react';
import PomodoroTimer from '../components/PomodoroTimer';
import TodoList from '../components/TodoList';
import WeeklyAnalytics from '../components/WeeklyAnalytics';
import AchievementPopup from '../components/AchievementPopup';
import { getFromStorage, saveToStorage } from '../utils/storage';
import { checkAchievements } from '../utils/achievements';
import { checkDailyLogin, getStreakData } from '../utils/streak';
import { motivationalQuotes } from '../data/quizData';

const ProductivityDashboard = () => {
  const [streak, setStreak] = useState(0);
  const [newAchievement, setNewAchievement] = useState(null);
  const [productivityScore, setProductivityScore] = useState(0);

  useEffect(() => {
    // Check daily login and update streak
    const currentStreak = checkDailyLogin();
    setStreak(currentStreak);

    // Calculate productivity score
    const todos = getFromStorage('todos', []);
    const pomodoroSessions = getFromStorage('pomodoroSessions', []);
    const completedTodos = todos.filter((t) => t.completed).length;
    
    const today = new Date().toDateString();
    const todayPomodoros = pomodoroSessions.filter(
      (s) => new Date(s.date).toDateString() === today
    ).length;

    const score =
      completedTodos * 2 +
      pomodoroSessions.length * 3 +
      (pomodoroSessions.reduce((acc, s) => acc + (s.duration || 25), 0) / 60);

    setProductivityScore(Math.round(score));

    // Check for new achievements
    const currentAchievements = getFromStorage('achievements', []);
    const stats = {
      tasksCompleted: completedTodos,
      pomodoroSessions: pomodoroSessions.length,
      streak: currentStreak,
      monthsCompleted: 0,
      perfectQuizzes: getFromStorage('perfectQuizzes', 0),
      roadmapCompleted: false,
      deepWorkSessions: pomodoroSessions.filter((s) => s.type === 'deepWork').length,
      dailyPomodoroSessions: todayPomodoros,
    };

    const newAchievements = checkAchievements(stats, currentAchievements);
    if (newAchievements.length > 0) {
      setNewAchievement(newAchievements[0]);
      saveToStorage('achievements', [...currentAchievements, ...newAchievements.map((a) => a.id)]);
    }
  }, []);

  const handleTaskComplete = () => {
    // Update streak and check achievements when task is completed
    const currentStreak = getStreakData().streak;
    setStreak(currentStreak);
  };

  const currentQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="min-h-screen pt-20 p-4 pb-20 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Productivity Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Focus, organize, and track your progress
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="w-5 h-5" />
                  <span className="font-bold text-xl">{streak}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Day Streak</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-purple-500">
                  <Target className="w-5 h-5" />
                  <span className="font-bold text-xl">{productivityScore}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card mb-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-500 flex-shrink-0" />
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 italic">
              "{currentQuote}"
            </p>
          </div>
        </motion.div>

        {/* Main Content - Pomodoro and Todo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PomodoroTimer />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TodoList onTaskComplete={handleTaskComplete} />
          </motion.div>
        </div>

        {/* Weekly Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <WeeklyAnalytics />
        </motion.div>
      </div>

      {/* Achievement Popup */}
      {newAchievement && (
        <AchievementPopup
          achievement={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
      )}
    </div>
  );
};

export default ProductivityDashboard;
