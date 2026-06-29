-- seed_rutas.sql
-- Rutas de recolección de prueba

INSERT INTO rutas (nombre, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Matutina Histórica', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'en_progreso'
FROM zonas z, usuarios u
WHERE z.nombre = 'Centro Histórico' AND u.email = 'operador1@cuscolimpio.local'
LIMIT 1;

INSERT INTO rutas (nombre, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta San Blas Nocturna', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'pendiente'
FROM zonas z, usuarios u
WHERE z.nombre = 'San Blas' AND u.email = 'operador2@cuscolimpio.local'
LIMIT 1;

INSERT INTO rutas (nombre, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Subida San Cristóbal', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'completada'
FROM zonas z, usuarios u
WHERE z.nombre = 'San Cristóbal' AND u.email = 'operador3@cuscolimpio.local'
LIMIT 1;

INSERT INTO rutas (nombre, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Pendiente Santa Ana', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'pendiente'
FROM zonas z, usuarios u
WHERE z.nombre = 'Santa Ana' AND u.email = 'operador1@cuscolimpio.local'
LIMIT 1;
