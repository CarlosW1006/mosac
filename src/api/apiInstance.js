import axios from 'axios';

const API = axios.create({
   baseURL: process.env.VUE_APP_API_URL,
   headers: {
      'Content-Type': 'application/json',
   },
});

API.interceptors.request.use((config) => {
   const token = sessionStorage.getItem('session');
   if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
   }
   return config;
});

export default API;
