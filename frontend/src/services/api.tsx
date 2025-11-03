import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error(
        `Backend not reachable!`,
      );
      console.error(`Check if your backend server is running at: ${API_BASE_URL}`);
    } else {
      console.error(
        ` API Error: ${error.response.status} ${error.response.statusText}`,
      );
    }
    return Promise.reject(error);
  }
);

export default api;