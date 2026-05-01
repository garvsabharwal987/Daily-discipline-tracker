import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths, isSameDay } from 'date-fns';
import api from '../services/api';
import { LoadingSkeleton } from '../components/ui/SharedComponents';
import toast from 'react-hot-toast';

export default function StreaksPage() {
  const [streaks, setStreaks] = useState([]);
  const [taskSummary, setTaskSummary] = useState([]);
  const [stats, setStats] = useState({ currentStreak: 0, longestStreak: 0, totalCompletedDays: 0 });
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [streakRes, statsRes, taskRes] = await Promise.all([
        api.get('/streaks'), 
        api.get('/streaks/stats'),
        api.get('/tasks/summary')
      ]);
      setStreaks(streakRes.data.data);
      setStats(statsRes.data.data);
      setTaskSummary(taskRes.data.data);
    } catch { toast.error('Failed to load streaks'); }
    finally { setLoading(false); }
  };

  // Auto-scroll to center current month
  useEffect(() => {
    if (!loading && scrollRef.current) {
      const container = scrollRef.current;
      // Current month is the last one in our last-12-months view
      setTimeout(() => {
        const monthWidth = 140; // Approx width including gap
        const currentMonthPos = 11 * monthWidth; 
        container.scrollLeft = currentMonthPos - container.offsetWidth / 2 + (monthWidth / 2);
      }, 100);
    }
  }, [loading]);

  // Group data by month for the LeetCode-style view
  const monthlyData = useMemo(() => {
    const streakMap = {};
    streaks.forEach(s => { streakMap[s.date] = s; });

    const taskMap = {};
    taskSummary.forEach(t => { taskMap[t._id] = t.completed; });

    const today = new Date();
    const months = [];

    // Last 12 months
    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(today, i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      const daysInMonth = eachDayOfInterval({ start, end });

      const firstDayOfWeek = getDay(start);
      const days = [];
      for (let j = 0; j < firstDayOfWeek; j++) {
        days.push(null);
      }

      daysInMonth.forEach(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const streak = streakMap[dateStr];
        const taskCount = taskMap[dateStr] || 0;
        
        days.push({
          date: dateStr,
          taskCount,
          data: streak || null,
          isToday: isSameDay(date, today)
        });
      });

      months.push({
        name: format(monthDate, 'MMM'),
        year: format(monthDate, 'yyyy'),
        days
      });
    }
    return months;
  }, [streaks, taskSummary]);

  const getColor = (count) => {
    if (count === 0) return 'bg-surface-100 dark:bg-surface-800/50';
    if (count === 1) return 'bg-green-300 dark:bg-green-900/40';
    if (count <= 3) return 'bg-green-500 dark:bg-green-600/60';
    return 'bg-green-700 dark:bg-green-500';
  };

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

      {/* LeetCode Style Heatmap */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-6">Activity History</h3>
        
        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-surface-200 dark:scrollbar-thumb-surface-800 scroll-smooth"
        >
          {monthlyData.map((month, mIdx) => (
            <div key={mIdx} className="flex-shrink-0">
              <div className="grid grid-rows-7 grid-flow-col gap-1">
                {month.days.map((day, dIdx) => (
                  <div key={dIdx} className="relative group">
                    <div 
                      className={`
                        w-[14px] h-[14px] rounded-[3px] transition-all duration-300
                        ${!day ? 'bg-transparent' : getColor(day.taskCount)}
                        ${day?.isToday ? 'ring-2 ring-primary-500 ring-offset-1 dark:ring-offset-surface-900 scale-110 z-10' : ''}
                        ${day ? 'cursor-pointer hover:scale-125 hover:z-20' : ''}
                      `} 
                    />
                    {day && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                        <div className="bg-surface-950 dark:bg-surface-700 text-white text-[11px] font-bold rounded-xl px-3 py-2 whitespace-nowrap shadow-2xl border border-white/10">
                          <p className="text-surface-400 text-[10px] mb-1">{format(new Date(day.date), 'MMMM d, yyyy')}</p>
                          <p>{day.taskCount} tasks completed</p>
                          {day.data && (
                            <div className="mt-1.5 flex gap-2 pt-1.5 border-t border-white/5 opacity-80">
                              <span className={day.data.vocabCompleted ? 'text-green-400' : 'text-surface-500'}>📚 Vocab</span>
                              <span className={day.data.readingCompleted ? 'text-green-400' : 'text-surface-500'}>📖 Read</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-bold text-surface-400 mt-3 text-center uppercase tracking-widest">
                {month.name}
              </p>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-4 text-[10px] text-surface-400 font-bold uppercase tracking-widest">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 3, 5].map((count, i) => (
              <div key={i} className={`w-[12px] h-[12px] rounded-[2px] ${getColor(count)}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* How streaks work */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4">How streaks work</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700/50">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-bold text-surface-900 dark:text-white">Daily Tasks</p>
              <p className="text-xs text-surface-500 mt-0.5">Complete all assigned tasks</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700/50">
            <span className="text-2xl">📚</span>
            <div>
              <p className="font-bold text-surface-900 dark:text-white">Vocabulary</p>
              <p className="text-xs text-surface-500 mt-0.5">Learn at least 3 new words</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/50 border border-surface-100 dark:border-surface-700/50">
            <span className="text-2xl">📖</span>
            <div>
              <p className="font-bold text-surface-900 dark:text-white">Reading</p>
              <p className="text-xs text-surface-500 mt-0.5">Complete your daily reading</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
