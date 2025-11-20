import axios from 'axios';
import {getDefaultStore} from 'jotai';
import {tokenAtom} from '../atoms/authAtoms';

// Your base API URL
const BASE_URL = 'https://online.devcoauctioneers.co.za/api';

// Axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Access the Jotai store
const store = getDefaultStore();

// Request interceptor to inject the token
apiClient.interceptors.request.use(
    (config) => {
        const token = store.get(tokenAtom);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token on 401 error
            store.set(tokenAtom, null);

            // Redirect to login page
            window.location.href = '/auth/Login'; // Ensure this matches your login route
        }
        return Promise.reject(error);
    }
);

export default apiClient;
