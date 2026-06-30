import { useEffect, useMemo, useState } from 'react';
import alertaApi from '../../api/alerta.api';
import rutaApi from '../../api/ruta.api';
import usuarioApi from '../../api/usuario.api';
import useAuth from '../../hooks/useAuth';

const initialForm = {
	tipo: '',
	descripcion: '',
	ruta_id: '',
	usuario_id: ''
};

export default function Alertas() {
	const { user } = useAuth();
	const isOperator = user?.role === 'operador';
	const canManageAlerts = !isOperator;
	const [items, setItems] = useState([]);
	const [rutas, setRutas] = useState([]);
	const [form, setForm] = useState(initialForm);
	const [editingId, setEditingId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');
	const [operatorRouteIds, setOperatorRouteIds] = useState([]);

	async function loadData() {
		setLoading(true);
		setError('');
		try {
			const [alerts, routeList, operatorRoutes] = await Promise.all([
				alertaApi.listAlerts(),
				canManageAlerts ? rutaApi.listRoutes() : Promise.resolve([]),
				isOperator ? rutaApi.listRoutes() : Promise.resolve([])
			]);
			setItems(alerts);
			setRutas(routeList);
			if (isOperator && user?.id) {
				const ids = operatorRoutes
					.filter((route) => Number(route.operario_id) === Number(user.id))
					.map((route) => Number(route.id));
				setOperatorRouteIds(ids);
			}
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudieron cargar las alertas');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadData();
	}, []);

	function handleChange(event) {
		const { name, value } = event.target;
		setForm((current) => ({ ...current, [name]: value }));
	}

	function startEdit(item) {
		setEditingId(item.id);
		setForm({
			tipo: item.tipo || '',
			descripcion: item.descripcion || '',
			ruta_id: item.ruta_id ?? '',
			usuario_id: item.usuario_id ?? ''
		});
		setError('');
		setMessage('');
	}

	function resetForm() {
		setEditingId(null);
		setForm(initialForm);
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setSaving(true);
		setError('');
		setMessage('');
		try {
			const payload = {
				tipo: form.tipo,
				descripcion: form.descripcion,
				zona_id: null,
				ruta_id: form.ruta_id === '' ? null : Number(form.ruta_id),
				usuario_id: null
			};
			if (editingId) {
				await alertaApi.updateAlert(editingId, payload);
				setMessage('Alerta actualizada correctamente');
			} else {
				await alertaApi.createAlert(payload);
				setMessage('Alerta creada correctamente');
			}
			resetForm();
			await loadData();
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo guardar la alerta');
		} finally {
			setSaving(false);
		}
	}

	async function handleResolve(id) {
		try {
			await alertaApi.resolveAlert(id);
			await loadData();
			setMessage('Alerta resuelta correctamente');
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo resolver la alerta');
		}
	}

	async function handleDelete(id) {
		if (!confirm('¿Eliminar esta alerta?')) return;
		try {
			await alertaApi.deleteAlert(id);
			await loadData();
			setMessage('Alerta eliminada correctamente');
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo eliminar la alerta');
		}
	}

	const title = useMemo(() => (editingId ? 'Editar alerta' : 'Crear alerta'), [editingId]);
	const visibleItems = useMemo(() => {
		if (!isOperator) return items;
		return items.filter((item) => {
			const byUser = Number(item.usuario_id) === Number(user?.id);
			const byRoute = operatorRouteIds.includes(Number(item.ruta_id));
			return byUser || byRoute;
		});
	}, [isOperator, items, operatorRouteIds, user?.id]);

	return (
		<section className="page-panel">
			<div className="section-heading">
				<p className="eyebrow">Módulo 5</p>
				<h2>Alertas</h2>
				<p>Notificaciones de cercanía, incidencias y retrasos.</p>
			</div>
			<div className="panel-grid">
				{canManageAlerts ? (
					<article className="page-panel">
						<div className="section-heading compact">
							<p className="eyebrow">Formulario</p>
							<h3>{title}</h3>
						</div>
						<form className="stack" onSubmit={handleSubmit}>
							<label className="field">
								<span>Tipo</span>
								<select name="tipo" value={form.tipo} onChange={handleChange} required>
									<option value="">Seleccione tipo...</option>
									<option value="Acumulación Excesiva">Acumulación Excesiva</option>
									<option value="Incidencia Vehicular">Incidencia Vehicular</option>
									<option value="Bloqueo de Vía">Bloqueo de Vía</option>
									<option value="Incidencia de Seguridad">Incidencia de Seguridad</option>
									<option value="Derrame de Peligrosos">Derrame de Peligrosos</option>
									<option value="Clima Adverso">Clima Adverso</option>
								</select>
							</label>
							<label className="field"><span>Descripción</span><textarea name="descripcion" rows="4" value={form.descripcion} onChange={handleChange} required /></label>
							<label className="field">
								<span>Ruta</span>
								<select name="ruta_id" value={form.ruta_id} onChange={handleChange}>
									<option value="">Sin ruta</option>
									{rutas.map((ruta) => <option key={ruta.id} value={ruta.id}>{ruta.nombre}</option>)}
								</select>
							</label>
							{error ? <div className="form-error">{error}</div> : null}
							{message ? <div className="form-success">{message}</div> : null}
							<div className="form-actions">
								<button className="primary-button" type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
								{editingId ? <button className="ghost-button" type="button" onClick={resetForm}>Cancelar</button> : null}
							</div>
						</form>
					</article>
				) : (
					<article className="page-panel">
						<div className="section-heading compact">
							<p className="eyebrow">Operador</p>
							<h3>Alertas asignadas</h3>
						</div>
						<p>Solo puedes consultar alertas. La creación y gestión la realizan supervisores o administradores.</p>
					</article>
				)}
				<article className="page-panel">
					<div className="section-heading compact">
						<p className="eyebrow">Listado</p>
						<h3>{isOperator ? 'Mis alertas' : 'Alertas registradas'}</h3>
					</div>
					{loading ? <p>Cargando alertas...</p> : visibleItems.length === 0 ? <div className="empty-state">No hay alertas registradas aún.</div> : (
						<div className="table-wrap">
							<table className="data-table">
								<thead>
									<tr>
										<th>Tipo</th>
										<th>Distrito</th>
										<th>Ruta</th>
										<th>Estado</th>
										{canManageAlerts ? <th>Acciones</th> : null}
									</tr>
								</thead>
								<tbody>
									{visibleItems.map((item) => (
										<tr key={item.id}>
											<td>{item.tipo}</td>
											<td><span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', background: 'rgba(0,0,0,0.05)', color: 'var(--muted)' }}>Cusco, Cusco</span></td>
											<td>{item.ruta_nombre || '-'}</td>
											<td>{item.estado}</td>
											{canManageAlerts ? (
												<td className="row-actions">
													<button className="ghost-button" type="button" onClick={() => handleResolve(item.id)}>Resolver</button>
													<button className="ghost-button" type="button" onClick={() => startEdit(item)}>Editar</button>
													<button className="ghost-button danger" type="button" onClick={() => handleDelete(item.id)}>Eliminar</button>
												</td>
											) : null}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</article>
			</div>
		</section>
	);
} 
