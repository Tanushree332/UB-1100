# Quick Start Guide

## Installation Steps

1. **Navigate to the project directory:**
   ```bash
   cd smart-skill-planner
   ```

2. **Install all dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
   
   Note: Using `--legacy-peer-deps` flag to resolve React 19 compatibility.
   
   This will install:
   - React & React DOM
   - Tailwind CSS & PostCSS
   - Framer Motion (animations)
   - Lucide React (icons)
   - Canvas Confetti (celebrations)

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The app will be available at `http://localhost:5173` (or the port shown in terminal)
   - The page will automatically reload when you make changes

## First Time Setup

1. Fill out the form with your details
2. Select your domain of interest
3. Choose your daily hours and roadmap duration
4. Click "Create My Roadmap"
5. Start learning!

## Troubleshooting

### If npm install fails:
- Make sure you have Node.js installed (v18 or higher)
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
- On Windows, you might need to run PowerShell as Administrator

### If the app doesn't load:
- Check that all dependencies are installed: `npm install`
- Make sure port 5173 is not in use
- Check the browser console for errors

### If styles don't load:
- Make sure Tailwind CSS is properly configured
- Check that `tailwind.config.js` and `postcss.config.js` exist
- Restart the dev server

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready to deploy!
