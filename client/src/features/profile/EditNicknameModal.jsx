import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function EditNicknameModal({ isOpen, onClose, currentNickname, onUpdate }) {
  const [nickname, setNickname] = useState(currentNickname || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.patch('/users/update-nickname', { nickname });
      onUpdate(res.data.data.nickname);
      toast.success('Nickname updated! ✨');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update nickname');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass-card p-8 border border-surface-200 dark:border-surface-700/50 shadow-2xl"
          >
            <h2 className="text-2xl font-black text-surface-900 dark:text-white mb-2">Edit Nickname</h2>
            <p className="text-surface-500 dark:text-surface-400 mb-6 text-sm">Choose a cool name for your profile.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 px-1">Nickname</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={50}
                  className="w-full px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-surface-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  placeholder="Enter nickname..."
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700/50 text-surface-600 dark:text-surface-400 font-bold hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary py-3 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Update'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
