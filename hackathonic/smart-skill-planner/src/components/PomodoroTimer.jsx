import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer, Coffee } from 'lucide-react';
import { saveToStorage, getFromStorage } from '../utils/storage';
import confetti from 'canvas-confetti';

const PomodoroTimer = () => {
  const [mode, setMode] = useState(() => getFromStorage('pomodoroSettings', {}).mode || 'focus');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const settings = getFromStorage('pomodoroSettings', {});
    return settings.focusMinutes ? settings.focusMinutes * 60 : 25 * 60;
  });
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [customFocus, setCustomFocus] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);
  const [showCustom, setShowCustom] = useState(false);
  
  const intervalRef = useRef(null);

  const modes = {
    focus: { focus: 25, break: 5, label: 'Focus' },
    deepWork: { focus: 50, break: 10, label: 'Deep Work' },
    custom: { focus: customFocus, break: customBreak, label: 'Custom' },
  };

  const currentMode = modes[mode];
  const totalSeconds = (isBreak ? currentMode.break : currentMode.focus) * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    playNotificationSound();
    
    if (!isBreak) {
      // Focus session completed
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      
      // Save session data
      const sessions = getFromStorage('pomodoroSessions', []);
      sessions.push({
        date: new Date().toISOString(),
        type: mode,
        duration: currentMode.focus,
      });
      saveToStorage('pomodoroSessions', sessions);
      
      // Confetti after 4 sessions
      if (newSessions % 4 === 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      
      // Switch to break
      setIsBreak(true);
      setTimeLeft(currentMode.break * 60);
    } else {
      // Break completed, switch to focus
      setIsBreak(false);
      setTimeLeft(currentMode.focus * 60);
    }
  };

  const playNotificationSound = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(currentMode.focus * 60);
  };

  const handleModeChange = (newMode) => {
    if (newMode === 'custom') {
      setShowCustom(true);
      return;
    }
    setMode(newMode);
    setShowCustom(false);
    setIsRunning(false);
    setIsBreak(false);
    const settings = modes[newMode];
    setTimeLeft(settings.focus * 60);
    saveToStorage('pomodoroSettings', { mode: newMode });
  };

  const handleCustomSave = () => {
    setMode('custom');
    setShowCustom(false);
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(customFocus * 60);
    saveToStorage('pomodoroSettings', {
      mode: 'custom',
      focusMinutes: customFocus,
      breakMinutes: customBreak,
    });
  };

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
    >
      <div className="flex items-center gap-2 mb-6">
        {isBreak ? (
          <Coffee className="w-6 h-6 text-orange-500" />
        ) : (
          <Timer className="w-6 h-6 text-purple-500" />
        )}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {isBreak ? 'Break Time' : 'Focus Timer'}
        </h2>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {Object.entries(modes).map(([key, value]) => (
          <button
            key={key}
            onClick={() => handleModeChange(key)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              mode === key
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-700/80'
            }`}
          >
            {value.label}
          </button>
        ))}
      </div>

      {/* Custom Mode Input */}
      <AnimatePresence>
        {showCustom && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl"
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Focus (min)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={customFocus}
                  onChange={(e) => setCustomFocus(parseInt(e.target.value) || 25)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border-2 border-purple-300 dark:border-purple-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Break (min)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customBreak}
                  onChange={(e) => setCustomBreak(parseInt(e.target.value) || 5)}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border-2 border-purple-300 dark:border-purple-600"
                />
              </div>
            </div>
            <button
              onClick={handleCustomSave}
              className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Save Custom Mode
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circular Timer */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-64 h-64">
          <svg className="transform -rotate-90 w-64 h-64">
            <circle
              cx="128"
              cy="128"
              r="90"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="90"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1 }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              key={timeLeft}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-5xl font-bold gradient-text"
            >
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </motion.div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {isBreak ? 'Take a break!' : 'Stay focused!'}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center mb-6">
        {!isRunning ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Start
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePause}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Pause className="w-5 h-5" />
            Pause
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Reset
        </motion.button>
      </div>

      {/* Session Counter */}
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Sessions completed today: <span className="font-bold text-purple-600 dark:text-purple-400">{sessionsCompleted}</span>
        </p>
        {sessionsCompleted > 0 && sessionsCompleted % 4 === 0 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-purple-600 dark:text-purple-400 font-semibold mt-2"
          >
            🎉 Amazing! You've completed {sessionsCompleted} sessions!
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default PomodoroTimer;
