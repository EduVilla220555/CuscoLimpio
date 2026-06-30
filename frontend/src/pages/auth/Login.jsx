import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [form, setForm] = useState({ email: '', password: '' });
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	function handleChange(event) {
		const { name, value } = event.target;
		setForm((current) => ({ ...current, [name]: value }));
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setLoading(true);
		setError('');

		try {
			await login(form);
			navigate('/dashboard', { replace: true });
		} catch (err) {
			setError(err?.response?.data?.message || 'No se pudo iniciar sesión');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="auth-layout">
			<section className="auth-hero">
				<div className="hero-badge">CuscoLimpio</div>
				<h1>Plataforma de monitoreo y gestión de rutas de limpieza en Cusco</h1>
				<p>
					Control de rutas, alertas y seguimiento en tiempo real con un enfoque exclusivo en el Distrito de Cusco.
				</p>

			</section>
			<section className="auth-card">
				<div className="section-heading compact">
					<p className="eyebrow">Acceso al sistema</p>
					<h2>Iniciar sesión</h2>
					<p>Ingresa con tu cuenta para revisar operaciones, rutas y reportes.</p>
				</div>
				<form className="stack" onSubmit={handleSubmit}>
					<label className="field">
						<span>Correo</span>
						<input name="email" type="email" value={form.email} onChange={handleChange} placeholder="usuario@cuscolimpio.pe" required />
					</label>
					<label className="field">
						<span>Contraseña</span>
						<input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
					</label>
					{error ? <div className="form-error">{error}</div> : null}
					<button className="primary-button" type="submit" disabled={loading}>
						{loading ? 'Ingresando...' : 'Entrar'}
					</button>
				</form>
				{/* <p className="auth-footer">
					¿No tienes cuenta? Contacta al administrador del sistema.
				</p> */}
			</section>
		</div>
	);
}
 
