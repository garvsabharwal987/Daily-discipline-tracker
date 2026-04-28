import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/tasks', label: 'Tasks', icon: '✅' },
  { path: '/vocabulary', label: 'Vocabulary', icon: '📚' },
  { path: '/reading', label: 'Reading', icon: '📖' },
  { path: '/gamification', label: 'Progress', icon: '🏆' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72
        glass-card rounded-none border-r border-surface-200 dark:border-surface-700/50
        transform transition-transform duration-300 ease-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-surface-200/50 dark:border-surface-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-primary-500/30">
              D
            </div>
            <div>
              <h1 className="font-bold text-lg text-surface-900 dark:text-white">Discipline</h1>
              <p className="text-xs text-surface-500 dark:text-surface-400">Track your growth</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              end={item.path === '/'}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Tip / Info */}
        <div className="p-6 border-t border-surface-200/50 dark:border-surface-700/50">
          <div className="p-4 rounded-2xl bg-primary-500/5 border border-primary-500/10">
            <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1">Pro Tip</p>
            <p className="text-[11px] text-surface-600 dark:text-surface-400 leading-relaxed">
              Consistently completing tasks builds long-term discipline. Stay focused!
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
