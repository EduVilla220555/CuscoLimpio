import { NavLink, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const menuItems = [
	{ to: '/dashboard', label: 'Resumen', roles: ['admin', 'supervisor', 'operador'] },
	{ to: '/usuarios', label: 'Usuarios', roles: ['admin'] },
	{ to: '/zonas', label: 'Zonas', roles: ['admin'] },
	{ to: '/residuos', label: 'Residuos', roles: ['admin'] },
	{ to: '/rutas', label: 'Rutas', roles: ['admin', 'supervisor', 'operador'] },
	{ to: '/alertas', label: 'Alertas', roles: ['admin', 'supervisor', 'operador'] },
	{ to: '/reportes', label: 'Reportes', roles: ['admin'] }
];

export default function Layout() {
	const { user, logout } = useAuth();
	const visibleMenuItems = menuItems
		.filter((item) => !item.roles || item.roles.includes(user?.role))
		.map((item) => {
			if (user?.role === 'operador' && item.to === '/rutas') {
				return { ...item, label: 'Mis rutas' };
			}
			return item;
		});

	return (
		<div className="app-shell">
			<aside className="sidebar">
				<div className="brand-block">
					<p className="eyebrow">CuscoLimpio</p>
					<h1>Gestión ambiental urbana</h1>
					<p>Distrito de Cusco, provincia de Cusco</p>
				</div>
				<nav className="sidebar-nav">
					{visibleMenuItems.map((item) => (
						<NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
							{item.label}
						</NavLink>
					))}
				</nav>
				<div className="sidebar-footer">
					<div>
						<span className="muted">Sesión</span>
						<strong>{user?.nombre ?? 'Invitado'}</strong>
					</div>
					<button className="ghost-button" type="button" onClick={logout}>
						Cerrar sesión
					</button>
				</div>
			</aside>
			<main className="main-content">
				<Outlet />
			</main>
		</div>
	);
}
 
