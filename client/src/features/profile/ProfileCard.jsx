import { useAuth } from '../../context/AuthContext';

export default function ProfileCard() {
  const { user } = useAuth();

  return (
    <div className="glass-card p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <svg className="w-32 h-32 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-5xl font-bold shadow-2xl shadow-primary-500/30 ring-4 ring-white dark:ring-surface-800">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl font-black text-surface-900 dark:text-white">{user?.name}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
              <span className="text-lg">📧</span>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
              <span className="text-lg">🆔</span>
              <span className="text-sm font-mono bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded">
                {user?._id}
              </span>
            </div>
          </div>
          <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
            <span className="px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 text-xs font-bold uppercase tracking-wider">
              Level {user?.gamification?.level || 1}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-accent-100 dark:bg-accent-500/20 text-accent-700 dark:text-accent-300 text-xs font-bold uppercase tracking-wider">
              Member since {new Date(user?.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
