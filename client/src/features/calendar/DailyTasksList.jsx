import { motion } from 'framer-motion';

export default function DailyTasksList({ tasks, date }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-3xl mb-4">
          😴
        </div>
        <p className="text-surface-500 dark:text-surface-400">No tasks found for this day.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <motion.div
          key={task._id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`
            p-4 rounded-xl border flex items-center gap-4 transition-all
            ${task.status === 'completed' 
              ? 'bg-green-500/5 border-green-500/20' 
              : 'bg-white dark:bg-surface-800/50 border-surface-200 dark:border-surface-700/50'}
          `}
        >
          <div className={`
            w-6 h-6 rounded-lg border-2 flex items-center justify-center
            ${task.status === 'completed'
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-surface-300 dark:border-surface-600'}
          `}>
            {task.status === 'completed' && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm truncate ${task.status === 'completed' ? 'text-surface-500 line-through' : 'text-surface-900 dark:text-white'}`}>
              {task.title}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                task.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400' :
                'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
              }`}>
                {task.priority}
              </span>
              {task.category && (
                <span className="text-[10px] text-surface-400 dark:text-surface-500">
                  • {task.category}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
