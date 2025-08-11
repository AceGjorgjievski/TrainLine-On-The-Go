import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://locahost:8080',
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// JWT-specific endpoints only
export const endpoints = {
  auth: {
    login: '/api/auth/login',
  },
};
