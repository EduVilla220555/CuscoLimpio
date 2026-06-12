-- seed_rutas.sql
-- Rutas de recolección de prueba

INSERT INTO rutas (nombre, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Matutina Histórica', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'en_progreso'
FROM zonas z, usuarios u
WHERE z.nombre = 'Centro Histórico' AND u.email = 'operador1@cuscolimpio.local'
LIMIT 1;

INSERT INTO rutas (nombre, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Nocturna Wanchaq', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'pendiente'
FROM zonas z, usuarios u
WHERE z.nombre = 'Wanchaq' AND u.email = 'operador2@cuscolimpio.local'
LIMIT 1;

INSERT INTO rutas (nombre, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Comercial San Sebastián', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'completada'
FROM zonas z, usuarios u
WHERE z.nombre = 'San Sebastián' AND u.email = 'operador1@cuscolimpio.local'
LIMIT 1;
