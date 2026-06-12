import { useEffect, useMemo, useState } from 'react';
import zonaApi from '../../api/zona.api';

const initialForm = {
	nombre: '',
	descripcion: '',
	distrito: '',
	calles_recorrer: '',
	centro_lat: '',
	centro_lng: ''
};

export default function Zonas() {
	const [zones, setZones] = useState([]);
	const [form, setForm] = useState(initialForm);
	const [editingId, setEditingId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');

	async function loadZones() {
		setLoading(true);
		setError('');

		try {
			setZones(await zonaApi.listZones());
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudieron cargar las zonas');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadZones();
	}, []);

	function handleChange(event) {
		const { name, value } = event.target;
		setForm((current) => ({ ...current, [name]: value }));
	}

	function startEdit(zone) {
		setEditingId(zone.id);
		setForm({
			nombre: zone.nombre || '',
			descripcion: zone.descripcion || '',
			distrito: zone.distrito || '',
			calles_recorrer: zone.calles_recorrer || '',
			centro_lat: zone.centro_lat ?? '',
			centro_lng: zone.centro_lng ?? ''
		});
		setMessage('');
		setError('');
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
				descripcion: form.descripcion || null,
				distrito: form.distrito || null,
				calles_recorrer: form.calles_recorrer || null,
				centro_lat: form.centro_lat === '' ? null : Number(form.centro_lat),
				centro_lng: form.centro_lng === '' ? null : Number(form.centro_lng)
			};

			if (editingId) {
				await zonaApi.updateZone(editingId, payload);
				setMessage('Zona actualizada correctamente');
			} else {
				await zonaApi.createZone(payload);
				setMessage('Zona creada correctamente');
			}

			resetForm();
			await loadZones();
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo guardar la zona');
		} finally {
			setSaving(false);
		}
	}

	async function handleDelete(id) {
		if (!confirm('¿Eliminar esta zona?')) {
			return;
		}

		try {
			await zonaApi.deleteZone(id);
			await loadZones();
			setMessage('Zona eliminada correctamente');
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo eliminar la zona');
		}
	}

	const title = useMemo(() => (editingId ? 'Editar zona' : 'Crear zona'), [editingId]);

	return (
		<section className="page-panel">
			<div className="section-heading">
				<p className="eyebrow">Módulo 1</p>
				<h2>Zonas</h2>
				<p>Gestión de zonas de recolección del distrito de Cusco.</p>
			</div>

			<div className="panel-grid">
				<article className="page-panel">
					<div className="section-heading compact">
						<p className="eyebrow">Formulario</p>
						<h3>{title}</h3>
					</div>
					<form className="stack" onSubmit={handleSubmit}>
						<label className="field">
							<span>Nombre</span>
							<input name="nombre" value={form.nombre} onChange={handleChange} required />
						</label>
						<label className="field">
							<span>Descripción</span>
							<textarea name="descripcion" rows="4" value={form.descripcion} onChange={handleChange} />
						</label>
						<label className="field">
							<span>Distrito</span>
							<input name="distrito" value={form.distrito} onChange={handleChange} />
						</label>
						<label className="field">
							<span>Calles a recorrer</span>
							<textarea name="calles_recorrer" rows="3" value={form.calles_recorrer} onChange={handleChange} />
						</label>
						<label className="field">
							<span>Latitud</span>
							<input name="centro_lat" value={form.centro_lat} onChange={handleChange} />
						</label>
						<label className="field">
							<span>Longitud</span>
							<input name="centro_lng" value={form.centro_lng} onChange={handleChange} />
						</label>
						{error ? <div className="form-error">{error}</div> : null}
						{message ? <div className="form-success">{message}</div> : null}
						<div className="form-actions">
							<button className="primary-button" type="submit" disabled={saving}>
								{saving ? 'Guardando...' : 'Guardar'}
							</button>
							{editingId ? (
								<button className="ghost-button" type="button" onClick={resetForm}>Cancelar</button>
							) : null}
						</div>
					</form>
				</article>

				<article className="page-panel">
					<div className="section-heading compact">
						<p className="eyebrow">Listado</p>
						<h3>Zonas registradas</h3>
					</div>
					{loading ? (
						<p>Cargando zonas...</p>
					) : zones.length === 0 ? (
						<div className="empty-state">No hay zonas registradas aún.</div>
					) : (
						<div className="table-wrap">
							<table className="data-table">
								<thead>
									<tr>
										<th>Nombre</th>
										<th>Descripción</th>
										<th>Distrito</th>
										<th>Calles</th>
										<th>Coordenadas</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody>
									{zones.map((zone) => (
										<tr key={zone.id}>
											<td>{zone.nombre}</td>
											<td>{zone.descripcion || '-'}</td>
											<td>{zone.distrito || '-'}</td>
											<td title={zone.calles_recorrer || ''}>
												{zone.calles_recorrer ? (zone.calles_recorrer.length > 30 ? zone.calles_recorrer.substring(0, 30) + '...' : zone.calles_recorrer) : '-'}
											</td>
											<td>{zone.centro_lat ?? '-'}, {zone.centro_lng ?? '-'}</td>
											<td className="row-actions">
												<button className="ghost-button" type="button" onClick={() => startEdit(zone)}>Editar</button>
												<button className="ghost-button danger" type="button" onClick={() => handleDelete(zone.id)}>Eliminar</button>
											</td>
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
 
