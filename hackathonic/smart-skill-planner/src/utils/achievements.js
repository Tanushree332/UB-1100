// Achievement system utilities

export const achievementDefinitions = [
  {
    id: 'first-task',
    name: 'First Step',
    description: 'Complete your first task',
    icon: '🎯',
    condition: (stats) => stats.tasksCompleted >= 1,
  },
  {
    id: 'first-focus',
    name: 'First Focus Session',
    description: 'Complete your first Pomodoro session',
    icon: '🍅',
    condition: (stats) => stats.pomodoroSessions >= 1,
  },
  {
    id: 'week-streak',
    name: 'Week Warrior',
    description: 'Complete 7 days in a row',
    icon: '🔥',
    condition: (stats) => stats.streak >= 7,
  },
  {
    id: 'month-complete',
    name: 'Month Master',
    description: 'Complete a full month',
    icon: '🏆',
    condition: (stats) => stats.monthsCompleted >= 1,
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Score 100% on a quiz',
    icon: '🧠',
    condition: (stats) => stats.perfectQuizzes >= 1,
  },
  {
    id: 'roadmap-complete',
    name: 'Roadmap Champion',
    description: 'Complete entire roadmap',
    icon: '👑',
    condition: (stats) => stats.roadmapCompleted,
  },
  {
    id: '20-tasks',
    name: 'Task Master',
    description: 'Complete 20 tasks',
    icon: '✅',
    condition: (stats) => stats.tasksCompleted >= 20,
  },
  {
    id: 'deep-work-master',
    name: 'Deep Work Master',
    description: 'Complete 10 Deep Work sessions',
    icon: '🧘',
    condition: (stats) => stats.deepWorkSessions >= 10,
  },
  {
    id: 'consistency-hero',
    name: 'Consistency Hero',
    description: 'Maintain a 30-day streak',
    icon: '💪',
    condition: (stats) => stats.streak >= 30,
  },
  {
    id: '4-sessions',
    name: 'Focus Champion',
    description: 'Complete 4 Pomodoro sessions in a day',
    icon: '⭐',
    condition: (stats) => stats.dailyPomodoroSessions >= 4,
  },
];

export const checkAchievements = (stats, currentAchievements = []) => {
  const newAchievements = [];
  
  achievementDefinitions.forEach((achievement) => {
    if (
      !currentAchievements.includes(achievement.id) &&
      achievement.condition(stats)
    ) {
      newAchievements.push(achievement);
    }
  });

  return newAchievements;
};

export const getAchievementById = (id) => {
  return achievementDefinitions.find((a) => a.id === id);
};
