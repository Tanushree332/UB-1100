import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Target, Sparkles } from 'lucide-react';
import { getFromStorage } from '../utils/storage';

const Navbar = () => {
  const location = useLocation();
  const userData = getFromStorage('userData');

  if (!userData) return null;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/productivity', label: 'Productivity', icon: Target },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 glass border-b border-white/20 dark:border-gray-700/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <span className="text-xl font-bold gradient-text">Smart Skill Planner</span>
          </Link>

          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
