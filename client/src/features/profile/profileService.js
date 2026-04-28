import api from '../../services/api';

export const getProfileStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};
