import axios from 'axios';

/**
 * Normalize API base URL.
 * - Empty → use relative /api/* (Vite dev proxy → backend)
 * - http://localhost:5000 → backend root; services still use /api/... paths
 * - Accidental .../api suffix is stripped to avoid /api/api/... double paths
 */
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
