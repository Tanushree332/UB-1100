import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import UserInputPage from './pages/UserInputPage';
import Dashboard from './pages/Dashboard';
import ProductivityDashboard from './pages/ProductivityDashboard';
import Navbar from './components/Navbar';
import ThemeToggle from './components/ThemeToggle';
import AchievementPopup from './components/AchievementPopup';
import { generateRoadmap } from './utils/roadmapGenerator';
import { saveToStorage, getFromStorage } from './utils/storage';
import { checkAchievements } from './utils/achievements';
import { checkDailyLogin } from './utils/streak';

function App() {
  const [userData, setUserData] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [newAchievement, setNewAchievement] = useState(null);

  // Load saved data on mount
  useEffect(() => {
    const savedUserData = getFromStorage('userData');
    const savedRoadmap = getFromStorage('roadmap');

    if (savedUserData && savedRoadmap) {
      setUserData(savedUserData);
      setRoadmap(savedRoadmap);
    }

    // Check daily login for streak
    checkDailyLogin();

    // Check for achievements on load
    checkForAchievements();
  }, []);

  const checkForAchievements = () => {
    const todos = getFromStorage('todos', []);
    const pomodoroSessions = getFromStorage('pomodoroSessions', []);
    const streakData = getFromStorage('streakData', { streak: 0 });
    const currentAchievements = getFromStorage('achievements', []);

    const stats = {
      tasksCompleted: todos.filter((t) => t.completed).length,
      pomodoroSessions: pomodoroSessions.length,
      streak: streakData.streak || 0,
      monthsCompleted: 0,
      perfectQuizzes: getFromStorage('perfectQuizzes', 0),
      roadmapCompleted: false,
      deepWorkSessions: pomodoroSessions.filter((s) => s.type === 'deepWork').length,
      dailyPomodoroSessions: pomodoroSessions.filter(
        (s) => new Date(s.date).toDateString() === new Date().toDateString()
      ).length,
    };

    const newAchievements = checkAchievements(stats, currentAchievements);
    if (newAchievements.length > 0) {
      setNewAchievement(newAchievements[0]);
      saveToStorage('achievements', [
        ...currentAchievements,
        ...newAchievements.map((a) => a.id),
      ]);
    }
  };

  const handleFormSubmit = (formData) => {
    // Generate roadmap
    const newRoadmap = generateRoadmap(
      formData.domain,
      formData.dailyHours,
      formData.durationMonths,
      formData.skillLevel
    );

    // Save to storage
    saveToStorage('userData', formData);
    saveToStorage('roadmap', newRoadmap);

    // Update state
    setUserData(formData);
    setRoadmap(newRoadmap);
  };

  const handleTaskToggle = (taskId, monthIndex, weekIndex) => {
    const updatedRoadmap = { ...roadmap };
    const task = updatedRoadmap.months[monthIndex].weeks[weekIndex].tasks.find(
      (t) => t.id === taskId
    );

    if (task) {
      task.completed = !task.completed;
      updatedRoadmap.completedTasks = task.completed
        ? updatedRoadmap.completedTasks + 1
        : updatedRoadmap.completedTasks - 1;

      setRoadmap(updatedRoadmap);
      saveToStorage('roadmap', updatedRoadmap);
      
      // Check for achievements after task completion
      setTimeout(() => checkForAchievements(), 500);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset? This will clear all your progress.')) {
      localStorage.clear();
      setUserData(null);
      setRoadmap(null);
      window.location.href = '/';
    }
  };

  return (
    <Router>
      <div className="min-h-screen">
        <ThemeToggle />
        <Navbar />

        {userData && roadmap && (
          <button
            onClick={handleReset}
            className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors text-sm"
          >
            Reset
          </button>
        )}

        <Routes>
          <Route
            path="/"
            element={
              userData && roadmap ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <UserInputPage onSubmit={handleFormSubmit} />
                </motion.div>
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              userData && roadmap ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Dashboard
                    userData={userData}
                    roadmap={roadmap}
                    onTaskToggle={handleTaskToggle}
                    onTestComplete={() => {
                      checkForAchievements();
                    }}
                  />
                </motion.div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/productivity"
            element={
              userData ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProductivityDashboard />
                </motion.div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>

        {/* Achievement Popup */}
        {newAchievement && (
          <AchievementPopup
            achievement={newAchievement}
            onClose={() => setNewAchievement(null)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
