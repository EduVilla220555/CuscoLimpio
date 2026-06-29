import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import useAuth from '../hooks/useAuth';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import Usuarios from '../pages/usuarios/Usuarios';
import Zonas from '../pages/zonas/Zonas';
import Residuos from '../pages/residuos/Residuos';
import Rutas from '../pages/rutas/Rutas';
import Alertas from '../pages/alertas/Alertas';
import Reportes from '../pages/reportes/Reportes';

function LoadingScreen() {
	return <div className="loading-screen">Cargando CuscoLimpio...</div>;
}

function HomeRedirect() {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return <LoadingScreen />;
	}

	return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

function PublicOnlyRoute({ children }) {
	const { isAuthenticated, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return <LoadingScreen />;
	}

	if (isAuthenticated) {
		const redirectTo = location.state?.from?.pathname || '/dashboard';
		return <Navigate to={redirectTo} replace />;
	}

	return children;
}

function ProtectedRoute({ children }) {
	const { isAuthenticated, loading } = useAuth();

	if (loading) {
		return <LoadingScreen />;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return children;
}

function RoleRoute({ allowedRoles, children }) {
	const { user, isAuthenticated, loading } = useAuth();

	if (loading) {
		return <LoadingScreen />;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (!allowedRoles.includes(user?.role)) {
		return <Navigate to="/dashboard" replace />;
	}

	return children;
}

export default function AppRouter() {
	return (
		<Routes>
			<Route path="/" element={<HomeRedirect />} />
			<Route
				path="/login"
				element={
					<PublicOnlyRoute>
						<Login />
					</PublicOnlyRoute>
				}
			/>
			<Route
				path="/register"
				element={
					<PublicOnlyRoute>
						<Register />
					</PublicOnlyRoute>
				}
			/>
			<Route
				element={
					<ProtectedRoute>
						<Layout />
					</ProtectedRoute>
				}
			>
				<Route path="/dashboard" element={<Dashboard />} />
				<Route
					path="/usuarios"
					element={
						<RoleRoute allowedRoles={['admin']}>
							<Usuarios />
						</RoleRoute>
					}
				/>
				<Route
					path="/zonas"
					element={
						<RoleRoute allowedRoles={['admin', 'supervisor']}>
							<Zonas />
						</RoleRoute>
					}
				/>
				<Route
					path="/residuos"
					element={
						<RoleRoute allowedRoles={['admin', 'supervisor']}>
							<Residuos />
						</RoleRoute>
					}
				/>
				<Route
					path="/rutas"
					element={
						<RoleRoute allowedRoles={['admin', 'supervisor', 'operador']}>
							<Rutas />
						</RoleRoute>
					}
				/>
				<Route
					path="/alertas"
					element={
						<RoleRoute allowedRoles={['admin', 'supervisor']}>
							<Alertas />
						</RoleRoute>
					}
				/>
				<Route
					path="/reportes"
					element={
						<RoleRoute allowedRoles={['admin', 'supervisor']}>
							<Reportes />
						</RoleRoute>
					}
				/>
			</Route>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}
 
