-- 006_crear_reportes.sql
CREATE TABLE IF NOT EXISTS reportes (
	id INT AUTO_INCREMENT PRIMARY KEY,
	ruta_id INT,
	zona_id INT,
	residuos_total INT DEFAULT 0,
	peso_total DECIMAL(10,2) DEFAULT 0,
	fecha DATE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE SET NULL,
	FOREIGN KEY (zona_id) REFERENCES zonas(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 
