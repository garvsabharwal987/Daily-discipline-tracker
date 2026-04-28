import { motion } from 'framer-motion';

export default function ProgressSection({ stats }) {
  const currentXP = stats?.user?.gamification?.xp || 0;
  const level = stats?.user?.gamification?.level || 1;
  const progress = currentXP % 100;

  const statItems = [
    { label: 'Tasks Completed', value: stats?.tasks?.totalCompleted || 0, icon: '✅', color: 'bg-green-500' },
    { label: 'Current Streak', value: stats?.streaks?.current || 0, icon: '🔥', color: 'bg-orange-500' },
    { label: 'Total XP', value: currentXP, icon: '✨', color: 'bg-primary-500' },
    { label: 'Global Rank', value: '#1', icon: '🏆', color: 'bg-yellow-500' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-surface-900 dark:text-white flex items-center gap-2">
        <span>📊</span> Progress Overview
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 flex items-center gap-4 border border-surface-200 dark:border-surface-700/50"
          >
            <div className={`w-12 h-12 rounded-2xl ${item.color}/10 flex items-center justify-center text-2xl`}>
              {item.icon}
            </div>
            <div>
              <p className="text-2xl font-black text-surface-900 dark:text-white">{item.value}</p>
              <p className="text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-surface-900 dark:text-white">Level {level} Experience</h4>
          <span className="text-sm font-bold text-primary-500">{currentXP} XP Total</span>
        </div>
        
        <div className="relative h-4 w-full bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
          />
        </div>
        <p className="text-xs text-center text-surface-500 dark:text-surface-400 font-medium">
          {100 - progress} XP until Level {level + 1}
        </p>
      </div>
    </div>
  );
}
