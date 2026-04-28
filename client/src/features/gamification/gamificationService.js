import api from '../../services/api';

export const getGamificationStats = async () => {
  const response = await api.get('/gamification/stats');
  return response.data;
};

export const getLeaderboard = async () => {
  const response = await api.get('/gamification/leaderboard');
  return response.data;
};
