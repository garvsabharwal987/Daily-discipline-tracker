import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getGamificationStats, getLeaderboard } from './gamificationService';
import XPProgress from './components/XPProgress';
import BadgesGrid from './components/BadgesGrid';
import { LoadingSkeleton } from '../../components/ui/SharedComponents';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function GamificationPage() {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, leaderboardRes] = await Promise.all([
        getGamificationStats(),
        getLeaderboard()
      ]);
      setStats(statsRes.data);
      setLeaderboard(leaderboardRes.data);
    } catch (err) {
      console.error('Failed to fetch gamification data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton count={3} height="h-64" />;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Your Progress</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Level up by completing tasks and earning badges</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* XP & Level */}
          <motion.div variants={item}>
            <XPProgress xp={stats?.xp || 0} level={stats?.level || 1} />
          </motion.div>

          {/* Badges */}
          <motion.div variants={item}>
            <BadgesGrid earnedBadges={stats?.badges || []} />
          </motion.div>
        </div>

        {/* Leaderboard */}
        <motion.div variants={item} className="space-y-4">
          <h3 className="text-xl font-bold text-surface-900 dark:text-white">Leaderboard</h3>
          <div className="glass-card overflow-hidden">
            <div className="p-4 bg-surface-50/50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-700/50">
              <div className="flex text-xs font-bold text-surface-500 uppercase tracking-wider">
                <span className="w-10">#</span>
                <span className="flex-1">User</span>
                <span className="w-16 text-right">XP</span>
              </div>
            </div>
            <div className="divide-y divide-surface-200 dark:divide-surface-700/50">
              {leaderboard.map((user, index) => (
                <div key={user._id} className={`flex items-center p-4 ${index === 0 ? 'bg-primary-50/30 dark:bg-primary-500/5' : ''}`}>
                  <span className={`w-10 font-bold ${index < 3 ? 'text-primary-500' : 'text-surface-400'}`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-surface-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">Level {user.gamification?.level || 1}</p>
                  </div>
                  <span className="w-16 text-right font-bold text-primary-600 dark:text-primary-400">{user.gamification?.xp || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
