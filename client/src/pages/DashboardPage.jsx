import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import api from '../services/api';
import { ProgressRing, LoadingSkeleton } from '../components/ui/SharedComponents';
import { useAuth } from '../context/AuthContext';
import WordOfDay from '../features/word/WordOfDay';
import MiniCalendar from '../features/calendar/MiniCalendar';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

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

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton count={6} height="h-32" />;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header, Word of Day & Mini Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <motion.div variants={item} className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.nickname || user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1 mb-6">{today}</p>
          <WordOfDay />
        </motion.div>
        
        <div className="lg:col-span-2 flex justify-end">
          <motion.div variants={item} className="w-full max-w-[260px]">
            <MiniCalendar />
          </motion.div>
        </div>
      </div>

      {/* Stat Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Card */}
        <div className="stat-card bg-gradient-to-br from-streak-500/10 to-streak-600/5 dark:from-streak-500/20 dark:to-streak-600/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl animate-streak-fire">🔥</span>
            <span className="badge bg-streak-100 text-streak-700 dark:bg-streak-500/20 dark:text-streak-400">Streak</span>
          </div>
          <p className="text-4xl font-extrabold text-surface-900 dark:text-white">{stats?.streaks?.current || 0}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">day streak • Best: {stats?.streaks?.longest || 0}</p>
        </div>

        {/* Tasks Today */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">✅</span>
            <ProgressRing 
              progress={stats?.tasks?.todayTotal ? (stats.tasks.todayCompleted / stats.tasks.todayTotal) * 100 : 0} 
              size={48} 
              strokeWidth={4} 
            />
          </div>
          <p className="text-4xl font-extrabold text-surface-900 dark:text-white">
            {stats?.tasks?.todayCompleted || 0}/{stats?.tasks?.todayTotal || 0}
          </p>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">tasks completed today</p>
        </div>

        {/* Vocabulary Today */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">📚</span>
            <ProgressRing 
              progress={stats?.vocab?.todayProgress || 0} 
              size={48} 
              strokeWidth={4}
              color="#10b981"
            />
          </div>
          <p className="text-4xl font-extrabold text-surface-900 dark:text-white">
            {stats?.vocab?.todayWords || 0}/3
          </p>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">words learned today</p>
        </div>

        {/* Reading */}
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">📖</span>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              stats?.reading?.todayCompleted 
                ? 'bg-accent-100 dark:bg-accent-500/20' 
                : 'bg-surface-100 dark:bg-surface-700'
            }`}>
              {stats?.reading?.todayCompleted ? (
                <svg className="w-6 h-6 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )}
            </div>
          </div>
          <p className="text-4xl font-extrabold text-surface-900 dark:text-white">{stats?.reading?.totalDays || 0}</p>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">reading days total</p>
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <motion.div variants={item} className="glass-card p-6">
          <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Weekly Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.weeklyData || []} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" className="text-xs" tick={{ fill: '#94a3b8' }} />
                <YAxis className="text-xs" tick={{ fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Bar dataKey="completed" name="Completed" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="tasks" name="Total Tasks" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Progress Trend */}
        <motion.div variants={item} className="glass-card p-6">
          <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Vocabulary & Reading</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.weeklyData || []}>
                <defs>
                  <linearGradient id="vocabGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="readGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" tick={{ fill: '#94a3b8' }} />
                <YAxis tick={{ fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Area type="monotone" dataKey="vocab" name="Words" stroke="#6366f1" fill="url(#vocabGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="reading" name="Reading" stroke="#10b981" fill="url(#readGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Stats */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
            <span className="text-2xl">📋</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats?.tasks?.total || 0}</p>
            <p className="text-sm text-surface-500 dark:text-surface-400">Total tasks created</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-500/20 flex items-center justify-center">
            <span className="text-2xl">🧠</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats?.vocab?.totalWords || 0}</p>
            <p className="text-sm text-surface-500 dark:text-surface-400">Words learned</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-streak-100 dark:bg-streak-500/20 flex items-center justify-center">
            <span className="text-2xl">🏆</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{stats?.streaks?.totalCompletedDays || 0}</p>
            <p className="text-sm text-surface-500 dark:text-surface-400">Perfect days</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
