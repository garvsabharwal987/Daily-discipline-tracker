import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';

export default function WordOfDay() {
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchWord();
  }, []);

  const fetchWord = async () => {
    try {
      setError(false);
      const res = await api.get('/word/today');
      if (res.data.success && res.data.data) {
        setWordData(res.data.data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Failed to fetch word of the day:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="glass-card p-6 animate-pulse">
      <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/4 mb-4" />
      <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-2" />
      <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-full" />
    </div>
  );

  if (error || !wordData) return (
    <div className="glass-card p-6 border-dashed border-surface-300 dark:border-surface-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest">Word of the Day</h3>
        <button onClick={fetchWord} className="text-xs text-primary-500 hover:underline">Retry</button>
      </div>
      <p className="text-sm text-surface-500 italic">"Discipline is the bridge between goals and accomplishment."</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card relative overflow-hidden group border-l-4 border-l-primary-500"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
      
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-[0.2em]">Word of the Day</h3>
          <span className="text-xl group-hover:animate-bounce">✨</span>
        </div>

        <div className="space-y-1 mb-4">
          <h2 className="text-3xl font-black text-surface-900 dark:text-white capitalize tracking-tight">
            {wordData.word}
          </h2>
          <p className="text-surface-600 dark:text-surface-400 italic text-sm leading-relaxed">
            {wordData.meaning}
          </p>
        </div>

        {(wordData.synonyms?.length > 0 || wordData.antonyms?.length > 0) && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-200 dark:border-surface-700/50">
            {wordData.synonyms?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider mb-2">Synonyms</p>
                <div className="flex flex-wrap gap-1.5">
                  {wordData.synonyms.slice(0, 3).map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-500/10 text-[11px] text-primary-700 dark:text-primary-300 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {wordData.antonyms?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider mb-2">Antonyms</p>
                <div className="flex flex-wrap gap-1.5">
                  {wordData.antonyms.slice(0, 2).map(a => (
                    <span key={a} className="px-2 py-0.5 rounded-md bg-red-50 dark:bg-red-500/10 text-[11px] text-red-600 dark:text-red-400 font-medium">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
