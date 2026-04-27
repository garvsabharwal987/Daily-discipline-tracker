import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Modal, EmptyState, LoadingSkeleton } from '../components/ui/SharedComponents';
import toast from 'react-hot-toast';
import { addDays, subDays } from 'date-fns';

const priorityConfig = {
  high: { label: 'High', class: 'badge-high', dot: 'bg-red-500' },
  medium: { label: 'Medium', class: 'badge-medium', dot: 'bg-streak-500' },
  low: { label: 'Low', class: 'badge-low', dot: 'bg-accent-500' },
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const initForm = { title: '', description: '', priority: 'medium', reminderTime: '', isRecurring: false, recurringPattern: null };
  const [formData, setFormData] = useState(initForm);

  useEffect(() => { fetchTasks(); }, [selectedDate]);

  const fetchTasks = async () => {
    setLoading(true);
    try { const res = await api.get(`/tasks?date=${selectedDate}`); setTasks(res.data.data); }
    catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) { await api.put(`/tasks/${editingTask._id}`, formData); toast.success('Task updated'); }
      else { await api.post('/tasks', { ...formData, date: selectedDate }); toast.success('Task created! 📝'); }
      setShowForm(false); setEditingTask(null); setFormData(initForm); fetchTasks();
      api.put(`/streaks/${selectedDate}`).catch(() => {});
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save task'); }
  };

  const toggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await api.put(`/tasks/${task._id}`, { status: newStatus }); fetchTasks();
      api.put(`/streaks/${selectedDate}`).catch(() => {});
      if (newStatus === 'completed') toast.success('Task completed! 🎉');
    } catch { toast.error('Failed to update task'); }
  };

  const deleteTask = async (id) => {
    try { await api.delete(`/tasks/${id}`); toast.success('Task deleted'); fetchTasks(); api.put(`/streaks/${selectedDate}`).catch(() => {}); }
    catch { toast.error('Failed to delete task'); }
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setFormData({ title: task.title, description: task.description, priority: task.priority, reminderTime: task.reminderTime || '', isRecurring: task.isRecurring, recurringPattern: task.recurringPattern });
    setShowForm(true);
  };

  const navigateDate = (dir) => {
    const d = dir === 'next' ? addDays(new Date(selectedDate), 1) : subDays(new Date(selectedDate), 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Daily Tasks</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Plan and conquer your day</p>
        </div>
        <button id="add-task-btn" onClick={() => { setEditingTask(null); setFormData(initForm); setShowForm(true); }} className="btn-primary">+ New Task</button>
      </div>

      {/* Date Navigator */}
      <div className="glass-card p-4 flex items-center justify-between">
        <button onClick={() => navigateDate('prev')} className="btn-ghost p-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="text-center">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent text-center text-lg font-semibold text-surface-900 dark:text-white outline-none cursor-pointer" />
          <p className="text-sm text-surface-500">{completedCount}/{tasks.length} completed</p>
        </div>
        <button onClick={() => navigateDate('next')} className="btn-ghost p-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Progress */}
      {tasks.length > 0 && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-surface-600 dark:text-surface-400">Progress</span>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{Math.round((completedCount / tasks.length) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(completedCount / tasks.length) * 100}%` }} transition={{ duration: 0.7 }} className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
          </div>
        </div>
      )}

      {/* Task List */}
      {loading ? <LoadingSkeleton count={4} /> : tasks.length === 0 ? (
        <EmptyState icon="📝" title="No tasks yet" description="Start planning your day by adding your first task" action={<button onClick={() => setShowForm(true)} className="btn-primary">Create a Task</button>} />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {tasks.map((task, i) => (
              <motion.div key={task._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ delay: i * 0.05 }} className={`glass-card p-4 flex items-start gap-4 group ${task.status === 'completed' ? 'opacity-70' : ''}`}>
                <button onClick={() => toggleStatus(task)} className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${task.status === 'completed' ? 'bg-accent-500 border-accent-500 text-white' : 'border-surface-300 dark:border-surface-600 hover:border-primary-400'}`}>
                  {task.status === 'completed' && <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className={`font-semibold text-surface-900 dark:text-white ${task.status === 'completed' ? 'line-through text-surface-500 dark:text-surface-400' : ''}`}>{task.title}</h3>
                    <span className={priorityConfig[task.priority].class}>{priorityConfig[task.priority].label}</span>
                    {task.isRecurring && <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-400">🔄</span>}
                  </div>
                  {task.description && <p className="text-sm text-surface-500 line-clamp-2">{task.description}</p>}
                  {task.reminderTime && <p className="text-xs text-surface-400 mt-1">⏰ {task.reminderTime}</p>}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(task)} className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"><svg className="w-4 h-4 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                  <button onClick={() => deleteTask(task._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"><svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditingTask(null); }} title={editingTask ? 'Edit Task' : 'New Task'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Title *</label>
            <input id="task-title" type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" placeholder="What do you need to do?" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Description</label>
            <textarea id="task-desc" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field resize-none h-24" placeholder="Add details..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Priority</label>
              <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="input-field">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Reminder</label>
              <input type="time" value={formData.reminderTime} onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })} className="input-field" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">{editingTask ? 'Update' : 'Create'} Task</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
