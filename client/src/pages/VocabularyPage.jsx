import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Modal, EmptyState, LoadingSkeleton, ProgressRing } from '../components/ui/SharedComponents';
import toast from 'react-hot-toast';
import { addDays, subDays } from 'date-fns';

export default function VocabularyPage() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [formData, setFormData] = useState({ word: '', meaning: '', synonyms: '', antonyms: '' });

  useEffect(() => { fetchWords(); }, [selectedDate]);

  const fetchWords = async () => {
    setLoading(true);
    try { const res = await api.get(`/vocab?date=${selectedDate}`); setWords(res.data.data); }
    catch { toast.error('Failed to load words'); }
    finally { setLoading(false); }
  };

  const fetchHistory = async () => {
    try { const res = await api.get('/vocab/history?limit=50'); setHistory(res.data.data); setShowHistory(true); }
    catch { toast.error('Failed to load history'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vocab', {
        ...formData, date: selectedDate,
        synonyms: formData.synonyms.split(',').map(s => s.trim()).filter(Boolean),
        antonyms: formData.antonyms.split(',').map(s => s.trim()).filter(Boolean),
      });
      toast.success('Word added! 📚');
      setShowForm(false); setFormData({ word: '', meaning: '', synonyms: '', antonyms: '' });
      fetchWords(); api.put(`/streaks/${selectedDate}`).catch(() => {});
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add word'); }
  };

  const deleteWord = async (id) => {
    try { await api.delete(`/vocab/${id}`); toast.success('Word removed'); fetchWords(); api.put(`/streaks/${selectedDate}`).catch(() => {}); }
    catch { toast.error('Failed to delete'); }
  };

  const progress = Math.min((words.length / 3) * 100, 100);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Vocabulary Builder</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Learn 3 new words every day</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchHistory} className="btn-secondary">📜 History</button>
          <button onClick={() => setShowForm(true)} className="btn-primary" disabled={words.length >= 3}>+ Add Word</button>
        </div>
      </div>

      {/* Date Nav + Progress */}
      <div className="glass-card p-4 flex items-center justify-between">
        <button onClick={() => setSelectedDate(subDays(new Date(selectedDate), 1).toISOString().split('T')[0])} className="btn-ghost p-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex items-center gap-4">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent text-lg font-semibold text-surface-900 dark:text-white outline-none cursor-pointer" />
          <ProgressRing progress={progress} size={56} strokeWidth={5} color={words.length >= 3 ? '#10b981' : '#6366f1'} />
        </div>
        <button onClick={() => setSelectedDate(addDays(new Date(selectedDate), 1).toISOString().split('T')[0])} className="btn-ghost p-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Status */}
      <div className={`glass-card p-4 text-center ${words.length >= 3 ? 'bg-accent-50 dark:bg-accent-500/10 border-accent-200 dark:border-accent-500/30' : ''}`}>
        <p className="font-semibold text-lg">
          {words.length >= 3 ? '🎉 Daily goal completed!' : `${words.length}/3 words added — ${3 - words.length} more to go!`}
        </p>
      </div>

      {/* Word Cards */}
      {loading ? <LoadingSkeleton count={3} height="h-32" /> : words.length === 0 ? (
        <EmptyState icon="📚" title="No words yet" description="Add your first word to start building your vocabulary" action={<button onClick={() => setShowForm(true)} className="btn-primary">Add a Word</button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {words.map((w, i) => (
              <motion.div key={w._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.1 }} className="glass-card p-5 group relative">
                <button onClick={() => deleteWord(w._id)} className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400 capitalize">{w.word}</h3>
                  <p className="text-surface-600 dark:text-surface-300 mt-1">{w.meaning}</p>
                </div>
                {w.synonyms?.length > 0 && (
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-accent-600 dark:text-accent-400 uppercase">Synonyms</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {w.synonyms.map((s, j) => <span key={j} className="badge bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400">{s}</span>)}
                    </div>
                  </div>
                )}
                {w.antonyms?.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Antonyms</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {w.antonyms.map((a, j) => <span key={j} className="badge bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400">{a}</span>)}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Word Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Add New Word">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Word *</label>
            <input type="text" value={formData.word} onChange={(e) => setFormData({ ...formData, word: e.target.value })} className="input-field" placeholder="e.g., Ephemeral" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Meaning *</label>
            <textarea value={formData.meaning} onChange={(e) => setFormData({ ...formData, meaning: e.target.value })} className="input-field resize-none h-20" placeholder="Definition..." required />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Synonyms (comma-separated)</label>
            <input type="text" value={formData.synonyms} onChange={(e) => setFormData({ ...formData, synonyms: e.target.value })} className="input-field" placeholder="transient, fleeting, brief" />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Antonyms (comma-separated)</label>
            <input type="text" value={formData.antonyms} onChange={(e) => setFormData({ ...formData, antonyms: e.target.value })} className="input-field" placeholder="permanent, lasting" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">Add Word</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </Modal>

      {/* History Modal */}
      <Modal isOpen={showHistory} onClose={() => setShowHistory(false)} title="Word History" maxWidth="max-w-2xl">
        <div className="max-h-96 overflow-y-auto scrollbar-thin space-y-2">
          {history.map(w => (
            <div key={w._id} className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 flex items-center justify-between">
              <div>
                <span className="font-semibold text-primary-600 dark:text-primary-400 capitalize">{w.word}</span>
                <span className="text-surface-500 mx-2">—</span>
                <span className="text-sm text-surface-600 dark:text-surface-300">{w.meaning}</span>
              </div>
              <span className="text-xs text-surface-400">{w.date}</span>
            </div>
          ))}
          {history.length === 0 && <p className="text-center text-surface-500 py-8">No words yet</p>}
        </div>
      </Modal>
    </motion.div>
  );
}
