import { motion } from 'framer-motion';

const ALL_BADGES = [
  { id: 'first_task', name: 'First Step', description: 'Complete your first task', icon: '🎯' },
  { id: 'task_warrior', name: 'Task Warrior', description: 'Complete 10 tasks', icon: '⚔️' },
  { id: 'task_master', name: 'Task Master', description: 'Complete 50 tasks', icon: '👑' },
  { id: 'streak_7', name: 'Consistent', description: 'Maintain a 7-day streak', icon: '🔥' },
  { id: 'early_bird', name: 'Early Bird', description: 'Complete a task before 7 AM', icon: '🌅' }
];

export default function BadgesGrid({ earnedBadges }) {
  const earnedIds = earnedBadges.map(b => b.id);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-surface-900 dark:text-white">Achievements</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {ALL_BADGES.map((badge, index) => {
          const isEarned = earnedIds.includes(badge.id);
          const earnedData = earnedBadges.find(b => b.id === badge.id);

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`
                relative p-4 rounded-2xl border text-center transition-all duration-300
                ${isEarned 
                  ? 'bg-gradient-to-br from-white to-surface-50 dark:from-surface-800 dark:to-surface-900 border-primary-500/30 shadow-lg shadow-primary-500/5' 
                  : 'bg-surface-50/50 dark:bg-surface-900/50 border-surface-200 dark:border-surface-800 opacity-50 grayscale'}
              `}
            >
              <div className="text-4xl mb-3 transform transition-transform duration-300 hover:scale-110">
                {badge.icon}
              </div>
              <h4 className={`text-sm font-bold ${isEarned ? 'text-surface-900 dark:text-white' : 'text-surface-400'}`}>
                {badge.name}
              </h4>
              <p className="text-[10px] text-surface-500 dark:text-surface-400 mt-1 leading-tight">
                {badge.description}
              </p>
              
              {isEarned && (
                <div className="absolute -top-1 -right-1">
                  <div className="bg-primary-500 text-white p-1 rounded-full shadow-lg">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
