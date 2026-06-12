-- 002_crear_zonas.sql
CREATE TABLE IF NOT EXISTS zonas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(120) NOT NULL,
	descripcion TEXT,
	distrito VARCHAR(100),
	calles_recorrer TEXT,
	centro_lat DECIMAL(10,7),
	centro_lng DECIMAL(10,7),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
