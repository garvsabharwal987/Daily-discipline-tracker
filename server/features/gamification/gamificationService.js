const User = require('../../models/User');
const Task = require('../../models/Task');

/**
 * Service to handle gamification logic
 */
class GamificationService {
  /**
   * Add XP to a user and check for level-ups/badges
   * @param {string} userId 
   * @param {number} amount 
   */
  async addXP(userId, amount) {
    const user = await User.findById(userId);
    if (!user) return;

    // Initialize gamification object if it doesn't exist
    if (!user.gamification) {
      user.gamification = { xp: 0, level: 1, badges: [] };
    }

    user.gamification.xp += amount;

    // Level up logic: Every 100 XP = 1 Level
    const newLevel = Math.floor(user.gamification.xp / 100) + 1;
    const leveledUp = newLevel > user.gamification.level;
    
    if (leveledUp) {
      user.gamification.level = newLevel;
    }

    // Check for badges
    await this.checkBadges(user);

    await user.save();
    return {
      xp: user.gamification.xp,
      level: user.gamification.level,
      leveledUp
    };
  }

  /**
   * Check and award badges based on achievements
   * @param {Object} user 
   */
  async checkBadges(user) {
    const earnedBadgeIds = user.gamification.badges.map(b => b.id);
    
    // 1. Task Completion Badges
    const completedTasksCount = await Task.countDocuments({ 
      user: user._id, 
      status: 'completed' 
    });

    const taskBadges = [
      { id: 'first_task', name: 'First Step', description: 'Complete your first task', threshold: 1, icon: '🎯' },
      { id: 'task_warrior', name: 'Task Warrior', description: 'Complete 10 tasks', threshold: 10, icon: '⚔️' },
      { id: 'task_master', name: 'Task Master', description: 'Complete 50 tasks', threshold: 50, icon: '👑' }
    ];

    for (const badge of taskBadges) {
      if (completedTasksCount >= badge.threshold && !earnedBadgeIds.includes(badge.id)) {
        user.gamification.badges.push({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          earnedAt: new Date()
        });
      }
    }

    // 2. Streak Badges (Placeholder - assuming streak is tracked elsewhere or we can check)
    // We could check the 'streaks' collection if it exists, or calculate here.
    // For now, let's stick to task counts as a baseline.
  }

  /**
   * Get gamification stats for a user
   * @param {string} userId 
   */
  async getStats(userId) {
    const user = await User.findById(userId).select('gamification');
    return user.gamification;
  }
}

module.exports = new GamificationService();
