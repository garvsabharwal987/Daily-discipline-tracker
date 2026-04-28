import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none border border-surface-200 dark:border-surface-700/50
        ${darkMode ? 'bg-surface-800' : 'bg-surface-100'}
      `}
    >
      <motion.div
        animate={{ x: darkMode ? 28 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`
          absolute top-[2px] w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-sm
          ${darkMode ? 'bg-primary-500' : 'bg-white'}
        `}
      >
        {darkMode ? '🌙' : '☀️'}
      </motion.div>
      
      <div className="flex justify-between px-2 text-[10px] font-bold select-none">
        <span className={darkMode ? 'opacity-0' : 'opacity-100'}>OFF</span>
        <span className={darkMode ? 'opacity-100' : 'opacity-0'}>ON</span>
      </div>
    </button>
  );
}
