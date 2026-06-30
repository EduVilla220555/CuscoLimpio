-- Schema principal para CuscoLimpio
-- Ejecutar en MySQL: CREATE DATABASE cusco_limpio; USE cusco_limpio;

-- Tipos de residuos
CREATE TABLE IF NOT EXISTS tipos_residuos (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	descripcion TEXT,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(100) NOT NULL,
	email VARCHAR(150) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	role ENUM('admin','supervisor','operador') NOT NULL DEFAULT 'operador',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Zonas
CREATE TABLE IF NOT EXISTS zonas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(120) NOT NULL,
	descripcion TEXT,
	distrito VARCHAR(100),
	calles_recorrer TEXT,
	centro_lat DECIMAL(10,7),
	centro_lng DECIMAL(10,7),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	UNIQUE KEY ux_zonas_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Residuos
CREATE TABLE IF NOT EXISTS residuos (
	id INT AUTO_INCREMENT PRIMARY KEY,
	tipo_id INT NOT NULL,
	descripcion TEXT,
	peso DECIMAL(8,2) DEFAULT 0,
	zona_id INT,
	usuario_id INT,
	fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (tipo_id) REFERENCES tipos_residuos(id) ON DELETE RESTRICT,
	FOREIGN KEY (zona_id) REFERENCES zonas(id) ON DELETE SET NULL,
	FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rutas
CREATE TABLE IF NOT EXISTS rutas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(140) NOT NULL,
	lugares_recorrido TEXT,
	zona_id INT,
	operario_id INT,
	fecha_inicio DATE,
	fecha_fin DATE,
	estado ENUM('pendiente','en_progreso','completada') DEFAULT 'pendiente',
	puntos_completados INT DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (zona_id) REFERENCES zonas(id) ON DELETE SET NULL,
	FOREIGN KEY (operario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Alertas
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

-- Reportes
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

-- Índices útiles
CREATE INDEX idx_residuos_tipo ON residuos(tipo_id);
CREATE INDEX idx_residuos_zona ON residuos(zona_id);
 
