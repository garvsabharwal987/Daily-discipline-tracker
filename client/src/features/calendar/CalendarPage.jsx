import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMonthSummary, getTasksByDate } from './calendarService';
import CalendarGrid from './CalendarGrid';
import DailyTasksList from './DailyTasksList';
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

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [summary, setSummary] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dayTasks, setDayTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    fetchMonthSummary();
  }, [currentDate]);

  useEffect(() => {
    if (selectedDate) {
      fetchDayTasks();
    }
  }, [selectedDate]);

  const fetchMonthSummary = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString();
      const data = await getMonthSummary(year, month);
      setSummary(data.data || []);
    } catch (err) {
      console.error('Failed to fetch month summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDayTasks = async () => {
    setTasksLoading(true);
    try {
      const data = await getTasksByDate(selectedDate);
      setDayTasks(data.data || []);
    } catch (err) {
      console.error('Failed to fetch day tasks:', err);
    } finally {
      setTasksLoading(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  if (loading && summary.length === 0) {
    return <LoadingSkeleton count={3} height="h-64" />;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Calendar</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Track your consistency across the month</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-surface-800 p-2 rounded-xl border border-surface-200 dark:border-surface-700/50 shadow-sm">
          <button 
            onClick={handlePrevMonth}
            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-surface-600 dark:text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-bold text-surface-900 dark:text-white min-w-[140px] text-center">
            {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-surface-600 dark:text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <motion.div variants={item} className="lg:col-span-2">
          <div className="glass-card p-6 h-full">
            <CalendarGrid 
              currentDate={currentDate} 
              summary={summary} 
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
            />
          </div>
        </motion.div>

        {/* Day Details */}
        <motion.div variants={item}>
          <div className="glass-card p-6 h-full flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-surface-900 dark:text-white">
                {new Date(selectedDate).toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
              </h3>
              <p className="text-sm text-surface-500 dark:text-surface-400">Tasks for this day</p>
            </div>
            
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {tasksLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-16 bg-surface-100 dark:bg-surface-800 rounded-xl animate-pulse" />
                    ))}
                  </motion.div>
                ) : (
                  <DailyTasksList key="list" tasks={dayTasks} date={selectedDate} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
