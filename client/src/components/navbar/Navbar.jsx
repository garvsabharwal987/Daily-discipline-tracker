import ProfileDropdown from './ProfileDropdown';

export default function Navbar({ onMenuClick }) {
  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-surface-200 dark:border-surface-700/50 px-4 sm:px-6 lg:px-8 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors text-surface-600 dark:text-surface-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="hidden lg:flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary-500/20">
              D
            </div>
            <span className="font-bold text-lg text-surface-900 dark:text-white">Daily Discipline</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
}
