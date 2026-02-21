// Streak management utilities

export const updateStreak = () => {
  const today = new Date().toDateString();
  const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');
  
  const lastDate = streakData.lastDate;
  const currentStreak = streakData.streak || 0;
  
  if (lastDate === today) {
    // Already updated today
    return currentStreak;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toDateString();
  
  let newStreak;
  if (lastDate === yesterdayString) {
    // Consecutive day
    newStreak = currentStreak + 1;
  } else if (!lastDate) {
    // First time
    newStreak = 1;
  } else {
    // Streak broken
    newStreak = 1;
  }
  
  const updatedData = {
    lastDate: today,
    streak: newStreak,
    longestStreak: Math.max(newStreak, streakData.longestStreak || 0),
  };
  
  localStorage.setItem('streakData', JSON.stringify(updatedData));
  return newStreak;
};

export const getStreakData = () => {
  return JSON.parse(localStorage.getItem('streakData') || '{"streak": 0, "longestStreak": 0}');
};

export const checkDailyLogin = () => {
  const today = new Date().toDateString();
  const lastLogin = localStorage.getItem('lastLogin');
  
  if (lastLogin !== today) {
    localStorage.setItem('lastLogin', today);
    return updateStreak();
  }
  
  return getStreakData().streak;
};
