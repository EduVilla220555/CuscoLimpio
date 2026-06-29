import { useEffect, useMemo, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import authApi from '../../api/auth.api';
import rutaApi from '../../api/ruta.api';
import alertaApi from '../../api/alerta.api';

const stats = [
	{ label: 'Zonas planificadas', value: '8', note: 'Cobertura del distrito de Cusco' },
	{ label: 'Rutas monitoreadas', value: '12', note: 'Seguimiento de camiones y operarios' },
	{ label: 'Alertas abiertas', value: '3', note: 'Incidencias y notificaciones pendientes' },
	{ label: 'Reportes generados', value: '24', note: 'Por zona y tipo de residuo' }
];

const roadmap = [
	'Módulo 1: Gestión de usuarios y zonas',
	'Módulo 2: Gestión de residuos',
	'Módulo 3: Monitoreo de rutas',
	'Módulo 4: Aplicación móvil',
	'Módulo 5: Sistema de alertas',
	'Módulo 6: Reportes y analítica'
];

const operarioActions = [
	'Consultar rutas asignadas',
	'Registrar alertas de incidencias',
	'Actualizar estado de recolección'
];

export default function Dashboard() {
	const { user } = useAuth();
	const isAdmin = user?.role === 'admin';
	const isOperario = user?.role === 'operador';
	const [operatorStats, setOperatorStats] = useState({ rutasAsignadas: 0, tareasHoy: 0 });
	const [operatorStatsLoading, setOperatorStatsLoading] = useState(false);
	const [supervisorForm, setSupervisorForm] = useState({ nombre: '', email: '', password: '' });
	const [supervisorSaving, setSupervisorSaving] = useState(false);
	const [supervisorError, setSupervisorError] = useState('');
	const [supervisorMessage, setSupervisorMessage] = useState('');

	useEffect(() => {
		if (!isOperario || !user?.id) {
			return;
		}

		let mounted = true;
		setOperatorStatsLoading(true);

		rutaApi.listRoutes()
			.then((routes) => {
				if (!mounted) return;

				const assignedRoutes = routes.filter((route) => Number(route.operario_id) === Number(user.id));
				const tareasHoy = assignedRoutes.filter((route) => route.estado !== 'completada').length;

				setOperatorStats({
					rutasAsignadas: assignedRoutes.length,
					tareasHoy
				});
			})
			.catch(() => {
				if (!mounted) return;
				setOperatorStats({ rutasAsignadas: 0, tareasHoy: 0 });
			})
			.finally(() => {
				if (mounted) setOperatorStatsLoading(false);
			});

		return () => {
			mounted = false;
		};
	}, [isOperario, user?.id]);

	const operarioCards = useMemo(
		() => [
			{ label: 'Rutas asignadas', value: String(operatorStats.rutasAsignadas), note: 'Rutas vinculadas a tu usuario' },
			{ label: 'Tareas de hoy', value: String(operatorStats.tareasHoy), note: 'Rutas activas por atender' }
		],
		[operatorStats]
	);

	function handleSupervisorChange(event) {
		const { name, value } = event.target;
		setSupervisorForm((current) => ({ ...current, [name]: value }));
	}

	async function handleSupervisorSubmit(event) {
		event.preventDefault();
		setSupervisorSaving(true);
		setSupervisorError('');
		setSupervisorMessage('');

		try {
			await authApi.createSupervisor(supervisorForm);
			setSupervisorMessage('Supervisor creado correctamente');
			setSupervisorForm({ nombre: '', email: '', password: '' });
		} catch (err) {
			setSupervisorError(err?.response?.data?.message || 'No se pudo crear el supervisor');
		} finally {
			setSupervisorSaving(false);
		}
	}

	return (
		<section className="dashboard-page">
			<div className="section-heading">
				<p className="eyebrow">Panel principal</p>
				<h2>{isOperario ? 'Panel de operador' : 'Resumen operativo'}</h2>
				<p>
					Bienvenido{user?.nombre ? `, ${user.nombre}` : ''}. {isOperario ? 'Aquí verás solo las funciones relacionadas a tus tareas de campo.' : 'Esta vista concentra el estado base del sistema para la gestión ambiental urbana.'}
				</p>
			</div>
			{isOperario ? (
				<>
					{operatorStatsLoading ? <p>Cargando métricas del operador...</p> : null}
					<div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
						{operarioCards.map((item) => (
							<article className="metric-card" key={item.label}>
								<span>{item.label}</span>
								<strong>{item.value}</strong>
								<p>{item.note}</p>
							</article>
						))}
					</div>
					<div className="panel-grid" style={{ gridTemplateColumns: '1fr' }}>
							<article className="page-panel accent-panel" style={{ display: 'flex', flexDirection: 'column' }}>
						<div className="section-heading compact">
								<p className="eyebrow">Contexto territorial</p>
								<h3>Mapa de Cusco y Rutas de Recolección</h3>
							</div>
							<p style={{ marginBottom: '16px' }}>Visualiza tu ubicación y las rutas asignadas para el día de hoy en tiempo real.</p>
							<div className="map-container" style={{ width: '100%', height: '520px', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
								<iframe
									title="Mapa de Cusco"
									width="100%"
									height="100%"
									frameBorder="0"
									scrolling="no"
									marginHeight="0"
									marginWidth="0"
									src="https://www.openstreetmap.org/export/embed.html?bbox=-71.995%2C-13.525%2C-71.965%2C-13.505&amp;layer=mapnik"
									style={{ filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)', border: 'none', display: 'block' }}
								/>
							</div>
						</article>
					</div>
				</>
			) : (
				<div className="panel-grid">
					<article className="page-panel">
						<div className="section-heading compact">
							<p className="eyebrow">Ruta de avance</p>
							<h3>Fases y módulos del proyecto</h3>
						</div>
						<div className="timeline-list">
							{roadmap.map((item) => (
								<div className="timeline-item" key={item}>
									<span className="timeline-dot" />
									<p>{item}</p>
								</div>
							))}
						</div>
					</article>
					<article className="page-panel accent-panel">
						<div className="section-heading compact">
							<p className="eyebrow">Contexto territorial</p>
							<h3>Distrito de Cusco</h3>
						</div>
						<p>
							El sistema está orientado a problemas reales de recolección, segregación y trazabilidad dentro del distrito de Cusco, con foco en eficiencia operativa y comunicación ciudadana.
						</p>
					</article>
					{isAdmin ? (
						<article className="page-panel">
							<div className="section-heading compact">
								<p className="eyebrow">Admin</p>
								<h3>Crear supervisor</h3>
								<p>Solo el administrador puede registrar nuevos supervisores.</p>
							</div>
							<form className="stack" onSubmit={handleSupervisorSubmit}>
								<label className="field">
									<span>Nombre completo</span>
									<input name="nombre" value={supervisorForm.nombre} onChange={handleSupervisorChange} required />
								</label>
								<label className="field">
									<span>Correo</span>
									<input name="email" type="email" value={supervisorForm.email} onChange={handleSupervisorChange} required />
								</label>
								<label className="field">
									<span>Contraseña</span>
									<input name="password" type="password" value={supervisorForm.password} onChange={handleSupervisorChange} required />
								</label>
								{supervisorError ? <div className="form-error">{supervisorError}</div> : null}
								{supervisorMessage ? <div className="form-success">{supervisorMessage}</div> : null}
								<button className="primary-button" type="submit" disabled={supervisorSaving}>
									{supervisorSaving ? 'Creando...' : 'Crear supervisor'}
								</button>
							</form>
						</article>
					) : null}
				</div>
			)}
		</section>
	);
}
 
