import { motion } from 'framer-motion';

export default function XPProgress({ xp, level }) {
  const currentLevelXP = xp % 100;
  const progress = currentLevelXP; // Since level is every 100 XP
  
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Current Level</h3>
          <p className="text-3xl font-black text-surface-900 dark:text-white">Level {level}</p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary-500/30">
          {level}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-surface-600 dark:text-surface-400 font-medium">{xp} Total XP</span>
          <span className="text-primary-600 dark:text-primary-400 font-bold">{100 - currentLevelXP} XP to Level {level + 1}</span>
        </div>
        
        <div className="h-4 w-full bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden border border-surface-200 dark:border-surface-700/50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          />
        </div>
      </div>
    </div>
  );
}
