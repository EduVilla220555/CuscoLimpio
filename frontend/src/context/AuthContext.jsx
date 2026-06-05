import { createContext, useEffect, useMemo, useState } from 'react';
import authApi from '../api/auth.api';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'cuscolimpio.auth';

function readStoredAuth() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

export function AuthProvider({ children }) {
	const stored = readStoredAuth();
	const [user, setUser] = useState(stored?.user ?? null);
	const [token, setToken] = useState(stored?.token ?? null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (token) {
			authApi.setToken(token);
		} else {
			authApi.clearToken();
		}
		setLoading(false);
	}, [token]);

	useEffect(() => {
		if (user && token) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
			return;
		}

		localStorage.removeItem(STORAGE_KEY);
	}, [user, token]);

	async function login(credentials) {
		const data = await authApi.login(credentials);
		setUser(data.user);
		setToken(data.token);
		return data;
	}

	async function register(payload) {
		return authApi.register(payload);
	}

	async function refresh() {
		if (!token) {
			return null;
		}

		const data = await authApi.refresh(token);
		setToken(data.token);
		return data.token;
	}

	function logout() {
		setUser(null);
		setToken(null);
		authApi.clearToken();
	}

	const value = useMemo(
		() => ({
			user,
			token,
			loading,
			isAuthenticated: Boolean(user && token),
			login,
			register,
			refresh,
			logout
		}),
		[user, token, loading]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
 
