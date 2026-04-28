import api from '../../services/api';

export const getMonthSummary = async (year, month) => {
  const response = await api.get(`/calendar/month?year=${year}&month=${month}`);
  return response.data;
};

export const getTasksByDate = async (date) => {
  const response = await api.get(`/tasks?date=${date}`);
  return response.data;
};
