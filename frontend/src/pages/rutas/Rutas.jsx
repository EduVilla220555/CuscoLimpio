import { useEffect, useMemo, useState } from 'react';
import rutaApi from '../../api/ruta.api';
import zonaApi from '../../api/zona.api';
import usuarioApi from '../../api/usuario.api';
import useAuth from '../../hooks/useAuth';

const initialForm = {
	nombre: '',
	zona_id: '',
	operario_id: '',
	fecha_inicio: '',
	fecha_fin: '',
	estado: 'pendiente'
};

const states = [
	{ value: 'pendiente', label: 'Pendiente' },
	{ value: 'en_progreso', label: 'En progreso' },
	{ value: 'completada', label: 'Completada' }
];

export default function Rutas() {
	const { user } = useAuth();
	const isOperator = user?.role === 'operador' || user?.role === 'operario';
	const canManageRoutes = !isOperator;
	const [items, setItems] = useState([]);
	const [zonas, setZonas] = useState([]);
	const [usuarios, setUsuarios] = useState([]);
	const [form, setForm] = useState(initialForm);
	const [editingId, setEditingId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');

	async function loadData() {
		setLoading(true);
		setError('');
		try {
			const [routes, zoneList, userList] = await Promise.all([
				rutaApi.listRoutes(),
				zonaApi.listZones(),
				usuarioApi.listUsers()
			]);
			setItems(routes);
			setZonas(zoneList);
			setUsuarios(userList.filter((usuario) => usuario.role === 'operador' || usuario.role === 'operario' || usuario.role === 'supervisor' || usuario.role === 'admin'));
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudieron cargar las rutas');
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
			nombre: item.nombre || '',
			zona_id: item.zona_id ?? '',
			operario_id: item.operario_id ?? '',
			fecha_inicio: item.fecha_inicio || '',
			fecha_fin: item.fecha_fin || '',
			estado: item.estado || 'pendiente'
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
				nombre: form.nombre,
				zona_id: form.zona_id === '' ? null : Number(form.zona_id),
				operario_id: form.operario_id === '' ? null : Number(form.operario_id),
				fecha_inicio: form.fecha_inicio || null,
				fecha_fin: form.fecha_fin || null,
				estado: form.estado
			};
			if (editingId) {
				await rutaApi.updateRoute(editingId, payload);
				setMessage('Ruta actualizada correctamente');
			} else {
				await rutaApi.createRoute(payload);
				setMessage('Ruta creada correctamente');
			}
			resetForm();
			await loadData();
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo guardar la ruta');
		} finally {
			setSaving(false);
		}
	}

	async function handleDelete(id) {
		if (!confirm('¿Eliminar esta ruta?')) {
			return;
		}
		try {
			await rutaApi.deleteRoute(id);
			await loadData();
			setMessage('Ruta eliminada correctamente');
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo eliminar la ruta');
		}
	}

	const title = useMemo(() => (editingId ? 'Editar ruta' : 'Crear ruta'), [editingId]);
	const visibleItems = isOperator ? items.filter((item) => Number(item.operario_id) === Number(user?.id)) : items;

	return (
		<section className="page-panel">
			<div className="section-heading">
				<p className="eyebrow">Módulo 3</p>
				<h2>Rutas</h2>
				<p>Planeación y seguimiento básico de rutas de recolección.</p>
			</div>
			<div className="panel-grid">
				{canManageRoutes ? (
					<article className="page-panel">
						<div className="section-heading compact">
							<p className="eyebrow">Formulario</p>
							<h3>{title}</h3>
						</div>
						<form className="stack" onSubmit={handleSubmit}>
						<label className="field"><span>Nombre</span><input name="nombre" value={form.nombre} onChange={handleChange} required /></label>
						<label className="field">
							<span>Zona</span>
							<select name="zona_id" value={form.zona_id} onChange={handleChange}>
								<option value="">Sin zona</option>
								{zonas.map((zona) => <option key={zona.id} value={zona.id}>{zona.nombre}</option>)}
							</select>
						</label>
						<label className="field">
							<span>Operador</span>
							<select name="operario_id" value={form.operario_id} onChange={handleChange}>
												<option value="">Sin operador</option>
								{usuarios.map((usuario) => <option key={usuario.id} value={usuario.id}>{usuario.nombre} ({usuario.role})</option>)}
							</select>
						</label>
						<label className="field"><span>Fecha inicio</span><input name="fecha_inicio" type="date" value={form.fecha_inicio} onChange={handleChange} /></label>
						<label className="field"><span>Fecha fin</span><input name="fecha_fin" type="date" value={form.fecha_fin} onChange={handleChange} /></label>
						<label className="field">
							<span>Estado</span>
							<select name="estado" value={form.estado} onChange={handleChange}>
								{states.map((state) => <option key={state.value} value={state.value}>{state.label}</option>)}
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
							<h3>Rutas asignadas</h3>
						</div>
						<p>Solo puedes consultar las rutas asignadas a tu usuario.</p>
					</article>
				)}
				<article className="page-panel">
					<div className="section-heading compact">
						<p className="eyebrow">Listado</p>
						<h3>Rutas registradas</h3>
					</div>
					{loading ? <p>Cargando rutas...</p> : visibleItems.length === 0 ? <div className="empty-state">No hay rutas registradas aún.</div> : (
						<div className="table-wrap">
							<table className="data-table">
								<thead>
									<tr>
										<th>Nombre</th>
										<th>Zona</th>
										<th>Operador</th>
										<th>Estado</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody>
									{visibleItems.map((item) => (
										<tr key={item.id}>
											<td>{item.nombre}</td>
											<td>{item.zona_nombre || '-'}</td>
											<td>{item.operario_nombre || '-'}</td>
											<td>{item.estado}</td>
											{canManageRoutes ? (
												<td className="row-actions">
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
 
