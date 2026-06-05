import api, { clearAuthToken, setAuthToken } from './axios.config';

async function login(credentials) {
	const response = await api.post('/auth/login', credentials);
	const data = response.data?.data;
	setAuthToken(data?.token);
	return data;
}

async function register(payload) {
	const response = await api.post('/auth/register', payload);
	return response.data?.data;
}

async function createSupervisor(payload) {
	const response = await api.post('/auth/register-supervisor', payload);
	return response.data?.data;
}

async function logout() {
	await api.post('/auth/logout');
	clearAuthToken();
}

async function refresh(token) {
	const response = await api.post('/auth/refresh', { token });
	return response.data?.data;
}

const authApi = {
	login,
	register,
	createSupervisor,
	logout,
	refresh,
	setToken: setAuthToken,
	clearToken: clearAuthToken
};

export default authApi;
 
