import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createOrderApi = async (data) => {
  const response = await api.post('/api/create-order', data);
  return response.data;
};

export const fetchOrderStatusApi = async (orderId) => {
  const response = await api.get(`/api/status/${orderId}`);
  return response.data;
};

export const dispatchOrderApi = async (orderId) => {
  const response = await api.post(`/api/dispatch/${orderId}`);
  return response.data;
};
