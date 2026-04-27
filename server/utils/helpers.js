// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Normalize a date to YYYY-MM-DD
const normalizeDate = (date) => {
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  return new Date(date).toISOString().split('T')[0];
};

// Calculate consecutive streak days from sorted dates
const calculateStreak = (streakDays) => {
  if (!streakDays || streakDays.length === 0) return { current: 0, longest: 0 };

  // Sort dates descending
  const sorted = streakDays
    .filter(d => d.allCompleted)
    .map(d => d.date)
    .sort((a, b) => b.localeCompare(a));

  if (sorted.length === 0) return { current: 0, longest: 0 };

  // Calculate current streak
  let current = 0;
  const today = getTodayDate();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Check if the most recent completed day is today or yesterday
  if (sorted[0] === today || sorted[0] === yesterdayStr) {
    current = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prevDate = new Date(sorted[i - 1]);
      const currDate = new Date(sorted[i]);
      const diffDays = (prevDate - currDate) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        current++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let longest = 1;
  let tempStreak = 1;
  const allSorted = [...sorted].sort((a, b) => a.localeCompare(b));
  for (let i = 1; i < allSorted.length; i++) {
    const prevDate = new Date(allSorted[i - 1]);
    const currDate = new Date(allSorted[i]);
    const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      tempStreak++;
      longest = Math.max(longest, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return { current, longest: Math.max(longest, current) };
};

module.exports = { getTodayDate, normalizeDate, calculateStreak };
