import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
	timeout: Number(import.meta.env.VITE_REQUEST_TIMEOUT || 30000)
});

api.interceptors.request.use((config) => {
	if (typeof window !== 'undefined') {
		const raw = localStorage.getItem('cuscolimpio.auth');
		if (raw) {
			try {
				const stored = JSON.parse(raw);
				if (stored?.token && !config.headers.Authorization) {
					config.headers.Authorization = `Bearer ${stored.token}`;
				}
			} catch {
				localStorage.removeItem('cuscolimpio.auth');
			}
		}
	}

	return config;
});

export function setAuthToken(token) {
	if (token) {
		api.defaults.headers.common.Authorization = `Bearer ${token}`;
		return;
	}

	delete api.defaults.headers.common.Authorization;
}

export function clearAuthToken() {
	delete api.defaults.headers.common.Authorization;
}

export default api;
 
