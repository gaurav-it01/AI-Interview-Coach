import axios from 'axios';


function resolveApiBaseUrl() {
  let base = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, '') || '';

  if (!base) {
    return '';
  }

  if (base.endsWith('/api')) {
    base = base.slice(0, -4);
  }

  return base;
}

const apiClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 60000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:session-expired'));
      const isAuthPage =
        window.location.pathname === '/login' ||
        window.location.pathname === '/signup';

      if (!isAuthPage) {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
