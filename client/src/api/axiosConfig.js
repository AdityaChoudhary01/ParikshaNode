import axios from 'axios';
import { store } from '@/app/store';
import { logout } from '@/app/slices/authSlice';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000, 
});

// 1. REQUEST INTERCEPTOR: Attaches the token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR: Handles errors, especially 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    
    // CRITICAL: Check if the server responded with a 401 Unauthorized status
    // and prevent repeated processing for the same session failure.
    if (response && response.status === 401) {
      console.error("401 Unauthorized received. Forcing client-side logout.");

      if (store) {
        // Dispatch the Redux logout action which clears localStorage
        store.dispatch(logout()); 
      }
      
      // Notify the user once.
      toast.error('Session expired or invalid token. Please log in again.');

      // Return a rejected promise to stop all subsequent concurrent calls 
      // from generating more 401 errors.
      return Promise.reject(new Error('Session invalidated by 401 interceptor.'));
    }
    
    return Promise.reject(error);
  }
);

export default api;
