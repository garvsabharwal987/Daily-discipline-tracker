import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import EditNicknameModal from '../../features/profile/EditNicknameModal';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout, setUser } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNicknameUpdate = (newNickname) => {
    setUser({ ...user, nickname: newNickname });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-all border border-transparent hover:border-surface-200 dark:hover:border-surface-700/50"
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/20">
          {(user?.nickname || user?.name)?.charAt(0).toUpperCase()}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-bold text-surface-900 dark:text-white leading-tight">
            {user?.nickname || user?.name}
          </p>
          <p className="text-[10px] text-surface-500 dark:text-surface-400">Level {user?.gamification?.level || 1}</p>
        </div>
        <svg 
          className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-72 glass-card overflow-hidden z-[100] shadow-2xl border border-surface-200 dark:border-surface-700/50"
          >
            {/* User Info Header */}
            <div className="p-5 border-b border-surface-200 dark:border-surface-700/50 bg-surface-50/50 dark:bg-surface-900/50">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">Profile</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="text-[10px] font-bold text-primary-500 hover:text-primary-400 transition-colors uppercase tracking-widest"
                >
                  Edit Nickname ✏️
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-xl font-bold">
                  {(user?.nickname || user?.name)?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-surface-900 dark:text-white truncate">{user?.nickname || user?.name}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="py-1 px-2 bg-surface-100 dark:bg-surface-800 rounded-lg">
                  <p className="text-[10px] font-mono text-surface-500 dark:text-surface-400">ID: {user?._id}</p>
                </div>
                <ThemeToggle />
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2 space-y-1">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 transition-colors group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">👤</span>
                <span className="text-sm font-semibold">View Profile</span>
              </Link>
              <Link
                to="/streaks"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 transition-colors group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">🔥</span>
                <span className="text-sm font-semibold">Streak History</span>
              </Link>
              <Link
                to="/calendar"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 transition-colors group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">📅</span>
                <span className="text-sm font-semibold">Calendar View</span>
              </Link>
            </div>

            {/* Footer / Logout */}
            <div className="p-2 border-t border-surface-200 dark:border-surface-700/50 bg-surface-50/30 dark:bg-surface-900/30">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">🚪</span>
                <span className="text-sm font-bold">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <EditNicknameModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentNickname={user?.nickname}
        onUpdate={handleNicknameUpdate}
      />
    </div>
  );
}
