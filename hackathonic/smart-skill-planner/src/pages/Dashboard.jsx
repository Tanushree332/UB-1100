import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, BookOpen, Trophy, Flame, Sparkles } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import TaskCard from '../components/TaskCard';
import DailyTest from '../components/DailyTest';
import AchievementBadge from '../components/AchievementBadge';
import { motivationalQuotes, achievements } from '../data/quizData';
import { avatars } from '../data/avatars';
import { saveToStorage, getFromStorage } from '../utils/storage';
import { checkDailyLogin, getStreakData } from '../utils/streak';

const Dashboard = ({ userData, roadmap, onTaskToggle, onTestComplete }) => {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [showTest, setShowTest] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    return getFromStorage('achievements', []);
  });
  const [streak, setStreak] = useState(() => {
    return getStreakData().streak || 0;
  });

  useEffect(() => {
    // Update streak on mount
    const currentStreak = checkDailyLogin();
    setStreak(currentStreak);
  }, []);

  const currentMonth = roadmap.months[selectedMonth];
  const currentWeek = currentMonth?.weeks[selectedWeek];
  const currentTasks = currentWeek?.tasks || [];

  // Calculate overall progress
  const totalTasks = roadmap.totalTasks;
  const completedTasks = roadmap.months.reduce((acc, month) => {
    return acc + month.weeks.reduce((weekAcc, week) => {
      return weekAcc + week.tasks.filter(task => task.completed).length;
    }, 0);
  }, 0);
  const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Get today's tasks (simplified - show current week's tasks)
  const todayTasks = currentTasks.filter(task => !task.completed).slice(0, 3);

  // Check for achievements
  useEffect(() => {
    const newAchievements = [];
    
    if (completedTasks >= 1 && !unlockedAchievements.includes('first-task')) {
      newAchievements.push('first-task');
    }
    if (streak >= 7 && !unlockedAchievements.includes('week-streak')) {
      newAchievements.push('week-streak');
    }
    if (selectedMonth === roadmap.months.length - 1 && completedTasks === totalTasks && !unlockedAchievements.includes('roadmap-complete')) {
      newAchievements.push('roadmap-complete');
    }

    if (newAchievements.length > 0) {
      const updated = [...unlockedAchievements, ...newAchievements];
      setUnlockedAchievements(updated);
      saveToStorage('achievements', updated);
    }
  }, [completedTasks, streak, selectedMonth, totalTasks, unlockedAchievements]);

  const selectedAvatar = avatars.find(a => a.id === userData.avatar) || avatars[0];
  const currentQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const handleTaskToggle = (taskId) => {
    onTaskToggle(taskId, selectedMonth, selectedWeek);
    
    // Update streak (simplified - increment on any task completion)
    const newStreak = streak + 1;
    setStreak(newStreak);
    saveToStorage('streak', newStreak);
  };

  return (
    <div className="min-h-screen pt-20 p-4 pb-20 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{selectedAvatar.emoji}</div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  Welcome back, {userData.name}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {userData.domain} • {userData.skillLevel}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="w-5 h-5" />
                  <span className="font-bold text-xl">{streak}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Day Streak</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Your Progress</h2>
          </div>
          <ProgressBar progress={overallProgress} label="Overall Progress" />
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{completedTasks}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
            </div>
            <div className="text-center p-4 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{totalTasks - completedTasks}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Remaining</div>
            </div>
            <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalTasks}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
            </div>
          </div>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card mb-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-500 flex-shrink-0" />
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 italic">
              "{currentQuote}"
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Month Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card"
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-6 h-6 text-purple-500" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Roadmap</h2>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Select Month
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {roadmap.months.map((month, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedMonth(index);
                        setSelectedWeek(0);
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 ${
                        selectedMonth === index
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-700/80'
                      }`}
                    >
                      Month {month.month}
                    </button>
                  ))}
                </div>
              </div>

              {currentMonth && (
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                    {currentMonth.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{currentMonth.goals}</p>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Select Week
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {currentMonth.weeks.map((week, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedWeek(index)}
                          className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all duration-200 ${
                            selectedWeek === index
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                              : 'bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-700/80'
                          }`}
                        >
                          {week.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {currentWeek && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                        Daily Practice: {currentWeek.dailyPractice.learning}, {currentWeek.dailyPractice.practice}, {currentWeek.dailyPractice.test}
                      </h4>
                      <div className="mb-4">
                        <h5 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Resources:</h5>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                          {currentMonth.resources.map((resource, idx) => (
                            <li key={idx}>{resource}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Tasks */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card"
            >
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-6 h-6 text-purple-500" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Tasks</h2>
              </div>
              {currentTasks.length > 0 ? (
                <div>
                  {currentTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={handleTaskToggle}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No tasks available for this week.
                </p>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Daily Test */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {showTest ? (
                <DailyTest
                  domain={userData.domain}
                  onComplete={() => {
                    setShowTest(false);
                    if (onTestComplete) onTestComplete();
                  }}
                />
              ) : (
                <div className="glass-card">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-6 h-6 text-purple-500" />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Daily Test</h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Test your knowledge with a quick quiz!
                  </p>
                  <button
                    onClick={() => setShowTest(true)}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Start Test
                  </button>
                </div>
              )}
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card"
            >
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Achievements</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3">
                {achievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    unlocked={unlockedAchievements.includes(achievement.id)}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
