-- 005_crear_alertas.sql
CREATE TABLE IF NOT EXISTS alertas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	tipo VARCHAR(80),
	descripcion TEXT,
	zona_id INT,
	ruta_id INT,
	usuario_id INT,
	estado ENUM('abierta','resuelta') DEFAULT 'abierta',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (zona_id) REFERENCES zonas(id) ON DELETE SET NULL,
	FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE SET NULL,
	FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
