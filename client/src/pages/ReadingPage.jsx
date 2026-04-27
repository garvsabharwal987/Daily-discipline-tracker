import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { LoadingSkeleton } from '../components/ui/SharedComponents';
import toast from 'react-hot-toast';
import { addDays, subDays } from 'date-fns';

export default function ReadingPage() {
  const [log, setLog] = useState({ completed: false, articleLink: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => { fetchLog(); }, [selectedDate]);

  const fetchLog = async () => {
    setLoading(true);
    try { const res = await api.get(`/reading?date=${selectedDate}`); setLog(res.data.data); }
    catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  const saveLog = async (updates) => {
    setSaving(true);
    try {
      const data = { ...log, ...updates, date: selectedDate };
      const res = await api.post('/reading', data);
      setLog(res.data.data);
      toast.success(updates.completed !== undefined ? (updates.completed ? 'Reading completed! 📖' : 'Unmarked') : 'Saved!');
      api.put(`/streaks/${selectedDate}`).catch(() => {});
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSkeleton count={3} height="h-24" />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Reading Tracker</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Read something in English every day</p>
      </div>

      {/* Date Nav */}
      <div className="glass-card p-4 flex items-center justify-between">
        <button onClick={() => setSelectedDate(subDays(new Date(selectedDate), 1).toISOString().split('T')[0])} className="btn-ghost p-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent text-lg font-semibold text-surface-900 dark:text-white outline-none cursor-pointer" />
        <button onClick={() => setSelectedDate(addDays(new Date(selectedDate), 1).toISOString().split('T')[0])} className="btn-ghost p-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Completion Toggle */}
      <motion.div whileTap={{ scale: 0.98 }} className={`glass-card p-8 text-center cursor-pointer transition-all duration-300 ${log.completed ? 'bg-accent-50 dark:bg-accent-500/10 border-accent-200 dark:border-accent-500/30' : 'hover:border-primary-300 dark:hover:border-primary-600'}`} onClick={() => saveLog({ completed: !log.completed })}>
        <div className="text-6xl mb-4">{log.completed ? '✅' : '📖'}</div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
          {log.completed ? 'Reading Done!' : 'Did you read today?'}
        </h2>
        <p className="text-surface-500 dark:text-surface-400">
          {log.completed ? 'Great job keeping up!' : 'Tap to mark as completed'}
        </p>
      </motion.div>

      {/* Article Link */}
      <div className="glass-card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Article Link (optional)</label>
          <input type="url" value={log.articleLink || ''} onChange={(e) => setLog({ ...log, articleLink: e.target.value })} className="input-field" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Notes / Summary</label>
          <textarea value={log.notes || ''} onChange={(e) => setLog({ ...log, notes: e.target.value })} className="input-field resize-none h-32" placeholder="Write key takeaways..." />
        </div>
        <button onClick={() => saveLog({ articleLink: log.articleLink, notes: log.notes })} disabled={saving} className="btn-primary w-full disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Notes'}
        </button>
      </div>
    </motion.div>
  );
}
