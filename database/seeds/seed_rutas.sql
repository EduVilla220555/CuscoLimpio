-- seed_rutas.sql
-- Rutas de recolección de prueba: 3 para cada uno de los 3 operarios

-- Operario 1 (operador1@cuscolimpio.local)
INSERT INTO rutas (nombre, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Histórica Plaza', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'en_progreso'
FROM zonas z, usuarios u
WHERE z.nombre = 'Centro Histórico' AND u.email = 'operador1@cuscolimpio.local'
LIMIT 1;

INSERT INTO rutas (nombre, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta San Cristóbal Alta', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'pendiente'
FROM zonas z, usuarios u
WHERE z.nombre = 'San Cristóbal' AND u.email = 'operador1@cuscolimpio.local'
LIMIT 1;

INSERT INTO rutas (nombre, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Santa Ana Baja', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'completada'
FROM zonas z, usuarios u
WHERE z.nombre = 'Santa Ana' AND u.email = 'operador1@cuscolimpio.local'
LIMIT 1;

-- Operario 2 (operador2@cuscolimpio.local)
INSERT INTO rutas (nombre, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta San Blas Artistas', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'en_progreso'
FROM zonas z, usuarios u
WHERE z.nombre = 'San Blas' AND u.email = 'operador2@cuscolimpio.local'
LIMIT 1;

INSERT INTO rutas (nombre, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Centro Comercial', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'pendiente'
FROM zonas z, usuarios u
WHERE z.nombre = 'Centro Histórico' AND u.email = 'operador2@cuscolimpio.local'
LIMIT 1;

INSERT INTO rutas (nombre, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Santa Ana Residencial', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'completada'
FROM zonas z, usuarios u
WHERE z.nombre = 'Santa Ana' AND u.email = 'operador2@cuscolimpio.local'
LIMIT 1;

-- Operario 3 (operador3@cuscolimpio.local)
INSERT INTO rutas (nombre, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Mirador Cristóbal', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'en_progreso'
FROM zonas z, usuarios u
WHERE z.nombre = 'San Cristóbal' AND u.email = 'operador3@cuscolimpio.local'
LIMIT 1;

INSERT INTO rutas (nombre, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Plazoleta San Blas', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'pendiente'
FROM zonas z, usuarios u
WHERE z.nombre = 'San Blas' AND u.email = 'operador3@cuscolimpio.local'
LIMIT 1;

INSERT INTO rutas (nombre, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Histórica Nocturna', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'completada'
FROM zonas z, usuarios u
WHERE z.nombre = 'Centro Histórico' AND u.email = 'operador3@cuscolimpio.local'
LIMIT 1;
