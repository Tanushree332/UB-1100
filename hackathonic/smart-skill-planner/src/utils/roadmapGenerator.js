// Roadmap generator logic based on domain, hours, and duration

export const generateRoadmap = (domain, dailyHours, durationMonths, skillLevel) => {
  const roadmap = {
    domain,
    dailyHours,
    durationMonths,
    skillLevel,
    months: [],
    totalTasks: 0,
    completedTasks: 0,
  };

  const domainData = getDomainData(domain);
  const weeksPerMonth = 4;
  const totalWeeks = durationMonths * weeksPerMonth;
  const hoursPerWeek = dailyHours * 7;

  // Generate monthly structure
  for (let month = 1; month <= durationMonths; month++) {
    const monthData = {
      month,
      title: getMonthTitle(domain, month, durationMonths, skillLevel),
      weeks: [],
      goals: getMonthlyGoals(domain, month, durationMonths, skillLevel),
      resources: getMonthlyResources(domain, month, skillLevel),
    };

    // Generate weekly structure
    const weeksInMonth = month === durationMonths 
      ? totalWeeks - (month - 1) * weeksPerMonth 
      : weeksPerMonth;

    for (let week = 1; week <= weeksInMonth; week++) {
      const weekData = {
        week: (month - 1) * weeksPerMonth + week,
        title: getWeekTitle(domain, month, week, skillLevel),
        tasks: [],
        dailyPractice: getDailyPractice(domain, dailyHours, skillLevel),
      };

      // Generate tasks for the week
      const tasksPerWeek = Math.max(3, Math.floor(hoursPerWeek / 2));
      for (let task = 1; task <= tasksPerWeek; task++) {
        weekData.tasks.push({
          id: `${month}-${week}-${task}`,
          title: getTaskTitle(domain, month, week, task, skillLevel),
          description: getTaskDescription(domain, month, week, task, skillLevel),
          estimatedHours: Math.ceil(dailyHours * 0.5),
          completed: false,
        });
        roadmap.totalTasks++;
      }

      monthData.weeks.push(weekData);
    }

    roadmap.months.push(monthData);
  }

  return roadmap;
};

const getDomainData = (domain) => {
  const domains = {
    'Game Development': {
      beginner: ['Unity Basics', 'C# Fundamentals', 'Game Design Principles'],
      intermediate: ['Advanced Unity', 'Multiplayer Games', 'Game Physics'],
      advanced: ['VR/AR Development', 'Game Optimization', 'Publishing'],
    },
    'AI': {
      beginner: ['Python Basics', 'Machine Learning Intro', 'Data Science'],
      intermediate: ['Deep Learning', 'Neural Networks', 'NLP'],
      advanced: ['Advanced AI', 'Computer Vision', 'AI Research'],
    },
    'Drawing': {
      beginner: ['Basic Shapes', 'Perspective', 'Shading'],
      intermediate: ['Portraits', 'Landscapes', 'Digital Art'],
      advanced: ['Advanced Techniques', 'Art Styles', 'Professional Work'],
    },
    'Singing': {
      beginner: ['Vocal Warm-ups', 'Breathing Techniques', 'Basic Scales'],
      intermediate: ['Vocal Range', 'Harmony', 'Performance'],
      advanced: ['Advanced Techniques', 'Stage Presence', 'Recording'],
    },
    'Coding': {
      beginner: ['HTML/CSS', 'JavaScript Basics', 'Git'],
      intermediate: ['React/Vue', 'Node.js', 'Databases'],
      advanced: ['System Design', 'DevOps', 'Architecture'],
    },
  };
  return domains[domain] || domains['Coding'];
};

const getMonthTitle = (domain, month, totalMonths, skillLevel) => {
  const titles = {
    'Game Development': {
      beginner: ['Getting Started with Unity', 'Building Your First Game', 'Adding Features', 'Polishing & Publishing'],
      intermediate: ['Advanced Mechanics', 'Multiplayer Systems', 'Performance Optimization', 'Monetization'],
      advanced: ['VR/AR Development', 'Advanced Graphics', 'Game Engine Development', 'Industry Best Practices'],
    },
    'AI': {
      beginner: ['Python Fundamentals', 'Data Science Basics', 'Machine Learning Intro', 'Building Models'],
      intermediate: ['Deep Learning', 'Neural Networks', 'NLP & Computer Vision', 'Advanced Projects'],
      advanced: ['Research Methods', 'Advanced Architectures', 'AI Ethics', 'Cutting-edge Research'],
    },
    'Drawing': {
      beginner: ['Fundamentals', 'Shapes & Forms', 'Perspective & Composition', 'Putting It Together'],
      intermediate: ['Portraits', 'Landscapes', 'Digital Art Basics', 'Advanced Digital'],
      advanced: ['Master Techniques', 'Art Styles', 'Professional Portfolio', 'Industry Standards'],
    },
    'Singing': {
      beginner: ['Vocal Basics', 'Breathing & Support', 'Scales & Intervals', 'Simple Songs'],
      intermediate: ['Vocal Range', 'Harmony & Theory', 'Performance Skills', 'Recording Basics'],
      advanced: ['Advanced Techniques', 'Stage Presence', 'Professional Recording', 'Career Development'],
    },
    'Coding': {
      beginner: ['HTML/CSS Basics', 'JavaScript Fundamentals', 'Building Projects', 'Deployment'],
      intermediate: ['React/Vue', 'Backend Development', 'Full-Stack Projects', 'Advanced Concepts'],
      advanced: ['System Design', 'DevOps & CI/CD', 'Architecture Patterns', 'Leadership'],
    },
  };

  const domainTitles = titles[domain] || titles['Coding'];
  const levelTitles = domainTitles[skillLevel] || domainTitles.beginner;
  return levelTitles[Math.min(month - 1, levelTitles.length - 1)] || `Month ${month}`;
};

const getWeekTitle = (domain, month, week, skillLevel) => {
  const weekTitles = [
    'Foundation Week',
    'Practice Week',
    'Building Week',
    'Mastery Week',
  ];
  return weekTitles[(week - 1) % 4] || `Week ${week}`;
};

const getTaskTitle = (domain, month, week, task, skillLevel) => {
  const taskTemplates = {
    'Game Development': [
      'Learn Unity Interface',
      'Create First Scene',
      'Add Player Movement',
      'Implement Game Mechanics',
      'Add UI Elements',
      'Polish & Test',
    ],
    'AI': [
      'Python Basics',
      'Data Manipulation',
      'Machine Learning Intro',
      'Build First Model',
      'Evaluate & Improve',
      'Deploy Model',
    ],
    'Drawing': [
      'Basic Shapes Practice',
      'Perspective Study',
      'Shading Techniques',
      'Composition Exercise',
      'Complete Drawing',
      'Review & Improve',
    ],
    'Singing': [
      'Vocal Warm-up Routine',
      'Breathing Exercises',
      'Scale Practice',
      'Song Learning',
      'Performance Practice',
      'Recording Session',
    ],
    'Coding': [
      'Learn Concepts',
      'Practice Exercises',
      'Build Mini Project',
      'Code Review',
      'Refactor Code',
      'Deploy Project',
    ],
  };

  const templates = taskTemplates[domain] || taskTemplates['Coding'];
  return templates[(task - 1) % templates.length];
};

const getTaskDescription = (domain, month, week, task, skillLevel) => {
  return `Complete the ${getTaskTitle(domain, month, week, task, skillLevel)} task. Focus on understanding the concepts and practicing regularly.`;
};

const getDailyPractice = (domain, dailyHours, skillLevel) => {
  const learningHours = Math.floor(dailyHours * 0.6);
  const practiceHours = Math.floor(dailyHours * 0.3);
  const testMinutes = Math.floor((dailyHours * 0.1) * 60);

  return {
    learning: `${learningHours}h learning`,
    practice: `${practiceHours}h practice`,
    test: `${testMinutes}min test/quiz`,
  };
};

const getMonthlyGoals = (domain, month, totalMonths, skillLevel) => {
  const goals = {
    'Game Development': [
      'Master Unity basics and create your first scene',
      'Build a complete game with player controls',
      'Add game mechanics and features',
      'Polish and prepare for publishing',
    ],
    'AI': [
      'Master Python fundamentals and data manipulation',
      'Understand machine learning basics',
      'Build and train your first model',
      'Deploy and evaluate models',
    ],
    'Drawing': [
      'Master basic shapes and forms',
      'Learn perspective and composition',
      'Develop shading and texture skills',
      'Create complete artworks',
    ],
    'Singing': [
      'Develop proper breathing and support',
      'Master basic scales and intervals',
      'Learn and perform songs',
      'Record and evaluate performances',
    ],
    'Coding': [
      'Master HTML/CSS and JavaScript basics',
      'Build interactive web projects',
      'Learn frameworks and backend',
      'Deploy full-stack applications',
    ],
  };

  const domainGoals = goals[domain] || goals['Coding'];
  return domainGoals[Math.min(month - 1, domainGoals.length - 1)] || `Complete Month ${month} objectives`;
};

const getMonthlyResources = (domain, month, skillLevel) => {
  const resources = {
    'Game Development': [
      'Unity Learn Platform',
      'Brackeys YouTube Channel',
      'Unity Documentation',
      'Game Design Books',
    ],
    'AI': [
      'Coursera ML Course',
      'Kaggle Learn',
      'Fast.ai',
      'Research Papers',
    ],
    'Drawing': [
      'Proko YouTube Channel',
      'Drawabox Course',
      'Art Books',
      'Online Communities',
    ],
    'Singing': [
      'Vocal Coach YouTube',
      'Singing Courses',
      'Music Theory Books',
      'Practice Apps',
    ],
    'Coding': [
      'MDN Web Docs',
      'FreeCodeCamp',
      'Codecademy',
      'GitHub Projects',
    ],
  };

  const domainResources = resources[domain] || resources['Coding'];
  return domainResources.slice(0, 3);
};
