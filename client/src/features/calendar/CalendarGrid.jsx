import { motion } from 'framer-motion';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarGrid({ currentDate, summary, selectedDate, onDateClick }) {
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const prevMonthDays = getDaysInMonth(year, month - 1);
  const days = [];

  // Previous month padding
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      day: prevMonthDays - i,
      month: month - 1,
      year: month === 0 ? year - 1 : year,
      currentMonth: false
    });
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      month: month,
      year: year,
      currentMonth: true
    });
  }

  // Next month padding
  const totalSlots = 42; // 6 rows * 7 days
  const nextMonthPadding = totalSlots - days.length;
  for (let i = 1; i <= nextMonthPadding; i++) {
    days.push({
      day: i,
      month: month + 1,
      year: month === 11 ? year + 1 : year,
      currentMonth: false
    });
  }

  const formatDate = (y, m, d) => {
    return `${y}-${(m + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Weekdays header */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(day => (
          <div key={day} className="text-center py-2 text-xs font-bold text-surface-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-2 flex-1">
        {days.map((dateObj, idx) => {
          const dateStr = formatDate(dateObj.year, dateObj.month, dateObj.day);
          const dayData = summary.find(s => s.date === dateStr);
          const isSelected = selectedDate === dateStr;
          const isToday = new Date().toISOString().split('T')[0] === dateStr;
          
          let statusClass = "bg-surface-50 dark:bg-surface-900/50 border-surface-200 dark:border-surface-700/50";
          
          if (dayData) {
            if (dayData.allDone) {
              statusClass = "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400";
            } else if (dayData.completed > 0) {
              statusClass = "bg-primary-500/10 border-primary-500/30 text-primary-600 dark:text-primary-400";
            }
          }

          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDateClick(dateStr)}
              className={`
                relative flex flex-col items-center justify-center p-2 min-h-[64px] rounded-xl border transition-all duration-200
                ${!dateObj.currentMonth ? 'opacity-30' : 'opacity-100'}
                ${isSelected ? 'ring-2 ring-primary-500 border-primary-500 z-10' : ''}
                ${statusClass}
                ${isToday && !isSelected ? 'border-accent-500 shadow-sm shadow-accent-500/20' : ''}
              `}
            >
              <span className={`text-sm font-bold ${isToday ? 'text-accent-600 dark:text-accent-400 underline decoration-2 underline-offset-4' : ''}`}>
                {dateObj.day}
              </span>
              
              {dayData && (
                <div className="mt-1 flex flex-col items-center">
                  <div className="text-[10px] opacity-70">
                    {dayData.completed}/{dayData.total}
                  </div>
                  {dayData.allDone && (
                    <div className="absolute top-1 right-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
                    </div>
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-surface-500 dark:text-surface-400 border-t border-surface-200 dark:border-surface-700/50 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30" />
          <span>All Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary-500/20 border border-primary-500/30" />
          <span>Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700/50" />
          <span>Pending / No Tasks</span>
        </div>
      </div>
    </div>
  );
}
