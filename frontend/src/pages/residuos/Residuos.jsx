import { useEffect, useMemo, useState } from 'react';
import residuoApi from '../../api/residuo.api';
import zonaApi from '../../api/zona.api';
import usuarioApi from '../../api/usuario.api';

const initialForm = {
	tipo_id: '',
	descripcion: '',
	peso: '',
	zona_id: '',
	usuario_id: ''
};

export default function Residuos() {
	const [items, setItems] = useState([]);
	const [tipos, setTipos] = useState([]);
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
			const [residues, residueTypes, zoneList, userList] = await Promise.all([
				residuoApi.listResidues(),
				residuoApi.listTypes(),
				zonaApi.listZones(),
				usuarioApi.listUsers()
			]);
			setItems(residues);
			setTipos(residueTypes);
			setZonas(zoneList);
			setUsuarios(userList);
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudieron cargar los residuos');
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
			tipo_id: String(item.tipo_id || ''),
			descripcion: item.descripcion || '',
			peso: item.peso ?? '',
			zona_id: item.zona_id ?? '',
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
				tipo_id: Number(form.tipo_id),
				descripcion: form.descripcion || null,
				peso: form.peso === '' ? 0 : Number(form.peso),
				zona_id: form.zona_id === '' ? null : Number(form.zona_id),
				usuario_id: form.usuario_id === '' ? null : Number(form.usuario_id)
			};
			if (editingId) {
				await residuoApi.updateResidue(editingId, payload);
				setMessage('Residuo actualizado correctamente');
			} else {
				await residuoApi.createResidue(payload);
				setMessage('Residuo registrado correctamente');
			}
			resetForm();
			await loadData();
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo guardar el residuo');
		} finally {
			setSaving(false);
		}
	}

	async function handleDelete(id) {
		if (!confirm('¿Eliminar este residuo?')) {
			return;
		}
		try {
			await residuoApi.deleteResidue(id);
			await loadData();
			setMessage('Residuo eliminado correctamente');
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo eliminar el residuo');
		}
	}

	const title = useMemo(() => (editingId ? 'Editar residuo' : 'Registrar residuo'), [editingId]);

	return (
		<section className="page-panel">
			<div className="section-heading">
				<p className="eyebrow">Módulo 2</p>
				<h2>Residuos</h2>
				<p>Registro de residuos segregados y su trazabilidad básica.</p>
			</div>
			<div className="panel-grid">
				<article className="page-panel">
					<div className="section-heading compact">
						<p className="eyebrow">Formulario</p>
						<h3>{title}</h3>
					</div>
					<form className="stack" onSubmit={handleSubmit}>
						<label className="field">
							<span>Tipo de residuo</span>
							<select name="tipo_id" value={form.tipo_id} onChange={handleChange} required>
								<option value="">Seleccionar</option>
								{tipos.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>)}
							</select>
						</label>
						<label className="field">
							<span>Descripción</span>
							<textarea name="descripcion" rows="4" value={form.descripcion} onChange={handleChange} />
						</label>
						<label className="field">
							<span>Peso (kg)</span>
							<input name="peso" type="number" step="0.01" value={form.peso} onChange={handleChange} />
						</label>
						<label className="field">
							<span>Zona</span>
							<select name="zona_id" value={form.zona_id} onChange={handleChange}>
								<option value="">Sin zona</option>
								{zonas.map((zona) => <option key={zona.id} value={zona.id}>{zona.nombre}</option>)}
							</select>
						</label>
						<label className="field">
							<span>Usuario</span>
							<select name="usuario_id" value={form.usuario_id} onChange={handleChange}>
								<option value="">Sin usuario</option>
								{usuarios.map((usuario) => <option key={usuario.id} value={usuario.id}>{usuario.nombre}</option>)}
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
				<article className="page-panel">
					<div className="section-heading compact">
						<p className="eyebrow">Listado</p>
						<h3>Residuos registrados</h3>
					</div>
					{loading ? <p>Cargando residuos...</p> : items.length === 0 ? <div className="empty-state">No hay residuos registrados aún.</div> : (
						<div className="table-wrap">
							<table className="data-table">
								<thead>
									<tr>
										<th>Tipo</th>
										<th>Peso</th>
										<th>Zona</th>
										<th>Usuario</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody>
									{items.map((item) => (
										<tr key={item.id}>
											<td>{item.tipo_nombre || item.tipo_id}</td>
											<td>{item.peso}</td>
											<td>{item.zona_nombre || '-'}</td>
											<td>{item.usuario_nombre || '-'}</td>
											<td className="row-actions">
												<button className="ghost-button" type="button" onClick={() => startEdit(item)}>Editar</button>
												<button className="ghost-button danger" type="button" onClick={() => handleDelete(item.id)}>Eliminar</button>
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
 
