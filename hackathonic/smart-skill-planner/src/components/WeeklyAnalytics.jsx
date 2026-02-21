import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Clock, CheckCircle2, Target } from 'lucide-react';
import { getFromStorage } from '../utils/storage';

const WeeklyAnalytics = () => {
  const [weeklyStats, setWeeklyStats] = useState(() => {
    return getFromStorage('weeklyStats', {
      hoursPracticed: 0,
      pomodoroSessions: 0,
      tasksCompleted: 0,
      dailyActivity: {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
      },
    });
  });

  useEffect(() => {
    // Calculate stats from localStorage data
    const todos = getFromStorage('todos', []);
    const pomodoroSessions = getFromStorage('pomodoroSessions', []);
    
    // Get this week's data
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    
    const thisWeekTodos = todos.filter((todo) => {
      if (!todo.completed) return false;
      const completedDate = new Date(todo.completedAt || todo.createdAt);
      return completedDate >= startOfWeek;
    });
    
    const thisWeekPomodoros = pomodoroSessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= startOfWeek;
    });
    
    // Calculate hours (estimate: each pomodoro = 25-50 min, each task = 1 hour)
    const pomodoroHours = thisWeekPomodoros.reduce((acc, session) => {
      return acc + (session.duration / 60);
    }, 0);
    const taskHours = thisWeekTodos.length;
    const totalHours = pomodoroHours + taskHours;
    
    // Daily activity
    const dailyActivity = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0,
    };
    
    thisWeekTodos.forEach((todo) => {
      const date = new Date(todo.completedAt || todo.createdAt);
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
      if (dailyActivity[dayName] !== undefined) {
        dailyActivity[dayName] += 1;
      }
    });
    
    thisWeekPomodoros.forEach((session) => {
      const date = new Date(session.date);
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
      if (dailyActivity[dayName] !== undefined) {
        dailyActivity[dayName] += 0.5;
      }
    });
    
    setWeeklyStats({
      hoursPracticed: totalHours,
      pomodoroSessions: thisWeekPomodoros.length,
      tasksCompleted: thisWeekTodos.length,
      dailyActivity,
    });
  }, []);

  const productivityScore =
    weeklyStats.tasksCompleted * 2 +
    weeklyStats.pomodoroSessions * 3 +
    weeklyStats.hoursPracticed;

  const chartData = Object.entries(weeklyStats.dailyActivity).map(([day, value]) => ({
    day: day.slice(0, 3),
    value: Math.round(value * 10) / 10,
  }));

  const COLORS = ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Weekly Analytics</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Hours</span>
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {weeklyStats.hoursPracticed.toFixed(1)}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sessions</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {weeklyStats.pomodoroSessions}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tasks</span>
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {weeklyStats.tasksCompleted}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Score</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {productivityScore}
          </div>
        </motion.div>
      </div>

      {/* Daily Activity Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Daily Activity</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Productivity Score Breakdown */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Productivity Score Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Tasks Completed</span>
            <span className="font-semibold">{weeklyStats.tasksCompleted} × 2 = {weeklyStats.tasksCompleted * 2}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Pomodoro Sessions</span>
            <span className="font-semibold">{weeklyStats.pomodoroSessions} × 3 = {weeklyStats.pomodoroSessions * 3}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Hours Practiced</span>
            <span className="font-semibold">{weeklyStats.hoursPracticed.toFixed(1)} × 1 = {Math.round(weeklyStats.hoursPracticed)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600">
            <span className="font-bold text-gray-800 dark:text-gray-200">Total Score</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">{productivityScore}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeeklyAnalytics;
