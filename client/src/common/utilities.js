import axios from 'axios';

export const HTTP = axios.create({
  baseURL: process.env.API_URL,
});

HTTP.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  config.headers.authorization = `Bearer ${token}`;
  return config;
}, (error) => {
  console.log('request failed');
  return Promise.reject(error);
});

export function empty() {

}
