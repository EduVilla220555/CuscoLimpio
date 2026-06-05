-- 004_crear_rutas.sql
CREATE TABLE IF NOT EXISTS rutas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(140) NOT NULL,
	zona_id INT,
	operario_id INT,
	fecha_inicio DATE,
	fecha_fin DATE,
	estado ENUM('pendiente','en_progreso','completada') DEFAULT 'pendiente',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (zona_id) REFERENCES zonas(id) ON DELETE SET NULL,
	FOREIGN KEY (operario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

 
