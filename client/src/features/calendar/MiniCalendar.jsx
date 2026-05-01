import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

export default function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [streaks, setStreaks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreaks = async () => {
      try {
        const res = await api.get('/streaks');
        setStreaks(res.data.data);
      } catch (err) {
        console.error('Failed to fetch streaks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStreaks();
  }, []);

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const startDay = getDay(startOfMonth(currentDate));
  const blanks = Array(startDay).fill(null);

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const isDayActive = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return streaks.some(s => s.date === dateStr && (s.allCompleted || s.tasksCompleted));
  };

  return (
    <div className="glass-card p-4 w-full select-none border border-surface-200/50 dark:border-surface-700/30">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-surface-900 dark:text-white uppercase tracking-wider">
          {format(currentDate, 'MMMM yyyy')}
        </h4>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-md text-surface-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-md text-surface-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-[10px] font-bold text-surface-400 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-center">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, i) => <div key={`b-${i}`} className="h-6" />)}
        {days.map(day => {
          const active = isDayActive(day);
          const today = isSameDay(day, new Date());
          
          return (
            <div key={day.toString()} className="h-6 flex items-center justify-center relative">
              <div className={`
                w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold transition-all
                ${today ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 scale-110' : 'text-surface-600 dark:text-surface-400'}
                ${active && !today ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' : ''}
              `}>
                {format(day, 'd')}
              </div>
              {active && !today && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
