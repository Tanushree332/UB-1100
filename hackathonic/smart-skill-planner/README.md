# 🎯 Smart Skill Planner

A modern, hackathon-ready web application that helps students create personalized learning roadmaps based on their interests, available time, and learning duration.

## ✨ Features

### Core Features
- **User Input Page**: Beautiful form with glassmorphism design for collecting student preferences
- **Roadmap Generator**: Dynamic roadmap generation based on domain, hours, and duration
- **Dashboard**: Comprehensive dashboard with progress tracking, tasks, and daily tests
- **Daily Test System**: Interactive quiz module with instant feedback
- **Progress Tracking**: Visual progress bars, task completion, and streak counter
- **Achievement System**: Unlock badges as you progress through your learning journey

### Extra Features (Hackathon Wow Factor)
- 🎨 **Avatar Selection**: Choose from 8 different avatars
- 🏆 **Achievement Badges**: Unlock achievements as you complete milestones
- 🎉 **Confetti Animations**: Celebrate task completions with confetti
- 🌓 **Dark/Light Mode**: Toggle between themes
- 💪 **Streak Counter**: Track your daily practice streak
- 📱 **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile

## 🚀 Tech Stack

- **Frontend**: React.js 19
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Confetti**: Canvas Confetti
- **Build Tool**: Vite
- **Storage**: LocalStorage (No database required)

## 📦 Installation

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
   
   Note: Using `--legacy-peer-deps` to resolve React 19 compatibility with some packages.

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🎮 Usage

1. **Fill out the form** with your details:
   - Your name
   - Choose an avatar
   - Select your interested domain (Game Development, AI, Drawing, Singing, Coding)
   - Set daily free hours (1-8 hours)
   - Choose roadmap duration (1-12 months)
   - Select skill level (Beginner, Intermediate, Advanced)

2. **View your personalized roadmap** with:
   - Monthly goals and objectives
   - Weekly tasks and practice suggestions
   - Daily practice recommendations
   - Recommended resources

3. **Track your progress**:
   - Complete tasks to see progress bars update
   - Take daily tests to reinforce learning
   - Unlock achievements as you progress
   - Maintain your daily streak

## 📁 Project Structure

```
smart-skill-planner/
├── src/
│   ├── components/          # Reusable components
│   │   ├── AchievementBadge.jsx
│   │   ├── AvatarSelector.jsx
│   │   ├── DailyTest.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── TaskCard.jsx
│   │   └── ThemeToggle.jsx
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   └── UserInputPage.jsx
│   ├── data/                 # Static data
│   │   ├── avatars.js
│   │   └── quizData.js
│   ├── utils/               # Utility functions
│   │   ├── roadmapGenerator.js
│   │   └── storage.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css           # Global styles
├── public/                  # Static assets
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🎨 Design Features

- **Glassmorphism**: Modern glass-effect cards with backdrop blur
- **Gradient Backgrounds**: Beautiful gradient backgrounds that adapt to theme
- **Smooth Animations**: Framer Motion animations for delightful interactions
- **Micro-interactions**: Hover effects, scale animations, and transitions
- **Color Scheme**: Purple, pink, and blue gradient theme
- **Responsive Design**: Mobile-first approach with breakpoints for all devices

## 🗄️ Data Storage

All data is stored locally in the browser's localStorage:
- User data (name, domain, preferences)
- Roadmap structure and progress
- Completed tasks
- Achievements unlocked
- Streak counter
- Theme preference

**No backend or database required!**

## 🎯 Supported Domains

- **Game Development**: Unity, C#, game design principles
- **AI**: Machine Learning, Deep Learning, Data Science
- **Drawing**: Fundamentals, perspective, digital art
- **Singing**: Vocal techniques, breathing, performance
- **Coding**: Web development, frameworks, full-stack

## 🏆 Achievements

Unlock achievements as you progress:
- 🎯 **First Step**: Complete your first task
- 🔥 **Week Warrior**: Complete 7 days in a row
- 🏆 **Month Master**: Complete a full month
- 🧠 **Quiz Master**: Score 100% on a quiz
- 👑 **Roadmap Champion**: Complete entire roadmap

## 🌟 Hackathon Ready

This project is designed to be:
- ✅ **Demo-ready**: Clean, polished UI/UX
- ✅ **Feature-complete**: All core features implemented
- ✅ **Well-documented**: Clear code structure and comments
- ✅ **Responsive**: Works on all devices
- ✅ **No dependencies on external APIs**: Fully self-contained
- ✅ **Fast**: Optimized with Vite for quick builds

## 📝 License

This project is open source and available for hackathon use.

## 🙏 Acknowledgments

Built with ❤️ for students who want to level up their skills!

---

**Happy Learning! 🚀**
