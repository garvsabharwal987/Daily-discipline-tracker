import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { LoadingSkeleton } from '../components/ui/SharedComponents';
import toast from 'react-hot-toast';

export default function StreaksPage() {
  const [streaks, setStreaks] = useState([]);
  const [stats, setStats] = useState({ currentStreak: 0, longestStreak: 0, totalCompletedDays: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [streakRes, statsRes] = await Promise.all([api.get('/streaks'), api.get('/streaks/stats')]);
      setStreaks(streakRes.data.data);
      setStats(statsRes.data.data);
    } catch { toast.error('Failed to load streaks'); }
    finally { setLoading(false); }
  };

  // Build heatmap data for last 365 days
  const heatmapData = useMemo(() => {
    const map = {};
    streaks.forEach(s => { map[s.date] = s; });
    const days = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const streak = map[dateStr];
      days.push({
        date: dateStr,
        dayOfWeek: d.getDay(),
        level: streak ? (streak.allCompleted ? 4 : streak.tasksCompleted && streak.vocabCompleted ? 3 : streak.tasksCompleted || streak.vocabCompleted || streak.readingCompleted ? 2 : 1) : 0,
        data: streak || null
      });
    }
    return days;
  }, [streaks]);

  // Group by weeks for the grid
  const weeks = useMemo(() => {
    const w = [];
    let currentWeek = [];
    // Pad start
    if (heatmapData.length > 0) {
      const firstDay = heatmapData[0].dayOfWeek;
      for (let i = 0; i < firstDay; i++) currentWeek.push(null);
    }
    heatmapData.forEach(day => {
      currentWeek.push(day);
      if (currentWeek.length === 7) { w.push(currentWeek); currentWeek = []; }
    });
    if (currentWeek.length > 0) { while (currentWeek.length < 7) currentWeek.push(null); w.push(currentWeek); }
    return w;
  }, [heatmapData]);

  const levelColors = ['bg-surface-100 dark:bg-surface-800', 'bg-accent-100 dark:bg-accent-900', 'bg-accent-300 dark:bg-accent-700', 'bg-accent-500 dark:bg-accent-500', 'bg-accent-600 dark:bg-accent-400'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  if (loading) return <LoadingSkeleton count={4} height="h-32" />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Streaks</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Consistency is the key to mastery</p>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-card p-6 text-center bg-gradient-to-br from-streak-500/10 to-streak-600/5 dark:from-streak-500/20 dark:to-streak-600/10">
          <div className="text-5xl mb-2 animate-streak-fire">🔥</div>
          <p className="text-4xl font-extrabold text-surface-900 dark:text-white">{stats.currentStreak}</p>
          <p className="text-sm text-surface-500 mt-1">Current Streak</p>
        </motion.div>
        <div className="glass-card p-6 text-center">
          <div className="text-5xl mb-2">🏆</div>
          <p className="text-4xl font-extrabold text-surface-900 dark:text-white">{stats.longestStreak}</p>
          <p className="text-sm text-surface-500 mt-1">Longest Streak</p>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="text-5xl mb-2">⭐</div>
          <p className="text-4xl font-extrabold text-surface-900 dark:text-white">{stats.totalCompletedDays}</p>
          <p className="text-sm text-surface-500 mt-1">Perfect Days</p>
        </div>
      </div>

      {/* Heatmap Calendar */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Activity Calendar</h3>
        <div className="overflow-x-auto scrollbar-thin pb-2">
          <div className="inline-flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day, di) => (
                  <div key={di} className="relative group">
                    <div className={`w-[13px] h-[13px] rounded-[3px] ${day ? levelColors[day.level] : 'bg-transparent'} transition-colors`} />
                    {day && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 pointer-events-none">
                        <div className="bg-surface-900 dark:bg-surface-700 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                          <p className="font-semibold">{day.date}</p>
                          {day.data ? (
                            <div className="mt-1 space-y-0.5">
                              <p>{day.data.tasksCompleted ? '✅' : '❌'} Tasks</p>
                              <p>{day.data.vocabCompleted ? '✅' : '❌'} Vocabulary</p>
                              <p>{day.data.readingCompleted ? '✅' : '❌'} Reading</p>
                            </div>
                          ) : <p className="mt-1 text-surface-400">No data</p>}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-xs text-surface-500">
          <span>Less</span>
          {levelColors.map((c, i) => <div key={i} className={`w-[13px] h-[13px] rounded-[3px] ${c}`} />)}
          <span>More</span>
        </div>
      </div>

      {/* What counts */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-3">How streaks work</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <span className="text-2xl">✅</span>
            <div><p className="font-semibold text-surface-900 dark:text-white">Complete all tasks</p><p className="text-sm text-surface-500">Finish every task for the day</p></div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <span className="text-2xl">📚</span>
            <div><p className="font-semibold text-surface-900 dark:text-white">Learn 3 words</p><p className="text-sm text-surface-500">Add 3 vocabulary words</p></div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50">
            <span className="text-2xl">📖</span>
            <div><p className="font-semibold text-surface-900 dark:text-white">Read an article</p><p className="text-sm text-surface-500">Complete daily reading</p></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
