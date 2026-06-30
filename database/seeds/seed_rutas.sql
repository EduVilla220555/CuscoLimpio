-- seed_rutas.sql
-- Rutas de recolección reales para el Distrito de Cusco

-- Operario 1 (operador1@cuscolimpio.local)
INSERT INTO rutas (nombre, lugares_recorrido, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Centro Monumental (Madrugada)', 'Plaza de Armas, Portal de Panes, Portal de Carnes, Loreto, Santa Catalina', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'en_progreso'
FROM zonas z, usuarios u
WHERE z.nombre = 'Centro Histórico Principal' AND u.email = 'operador1@cuscolimpio.local'
LIMIT 1;

INSERT INTO rutas (nombre, lugares_recorrido, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta San Cristóbal - Saphy (Mañana)', 'Pumacurco, Don Bosco, Resbalosa, Saphy', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'pendiente'
FROM zonas z, usuarios u
WHERE z.nombre = 'San Cristóbal y Saphy' AND u.email = 'operador1@cuscolimpio.local'
LIMIT 1;

INSERT INTO rutas (nombre, lugares_recorrido, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Comercial Mercado San Pedro', 'Cascaparo, Santa Clara, Hospital, Tupac Amaru', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'completada'
FROM zonas z, usuarios u
WHERE z.nombre = 'Mercado San Pedro' AND u.email = 'operador1@cuscolimpio.local'
LIMIT 1;

-- Operario 2 (operador2@cuscolimpio.local)
INSERT INTO rutas (nombre, lugares_recorrido, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta San Blas (Tarde)', 'Carmen Alto, Tandapata, Suytuqhatu, Choquechaca', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'en_progreso'
FROM zonas z, usuarios u
WHERE z.nombre = 'Barrio de San Blas' AND u.email = 'operador2@cuscolimpio.local'
LIMIT 1;

INSERT INTO rutas (nombre, lugares_recorrido, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Santa Ana y Arcopata', 'Cuesta de Santa Ana, Calle Meloc, Calle Abancay, Arcopata', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'pendiente'
FROM zonas z, usuarios u
WHERE z.nombre = 'Santa Ana' AND u.email = 'operador2@cuscolimpio.local'
LIMIT 1;

INSERT INTO rutas (nombre, lugares_recorrido, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Lucrepata - Recoleta', 'Av. Lucrepata, Calle Recoleta, Pampa de la Alianza', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'completada'
FROM zonas z, usuarios u
WHERE z.nombre = 'Barrio de Lucrepata' AND u.email = 'operador2@cuscolimpio.local'
LIMIT 1;

-- Operario 3 (operador3@cuscolimpio.local)
INSERT INTO rutas (nombre, lugares_recorrido, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Comercial Av. El Sol', 'Av. El Sol, Santo Domingo, Pampa del Castillo, Arrayan, Av. Tullumayo', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'en_progreso'
FROM zonas z, usuarios u
WHERE z.nombre = 'Eje Av. El Sol y Qoricancha' AND u.email = 'operador3@cuscolimpio.local'
LIMIT 1;

INSERT INTO rutas (nombre, lugares_recorrido, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Centro Periférica (Noche)', 'Cuesta del Almirante, Plazoleta Nazarenas, Purgatorio, Ataud', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'pendiente'
FROM zonas z, usuarios u
WHERE z.nombre = 'Centro Histórico Principal' AND u.email = 'operador3@cuscolimpio.local'
LIMIT 1;

INSERT INTO rutas (nombre, lugares_recorrido, zona_id, operario_id, fecha_inicio, fecha_fin, estado)
SELECT 'Ruta Repaso San Pedro - Cascaparo', 'Cascaparo (repaso), Santa Clara, Hospital', z.id, u.id, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 MONTH), 'completada'
FROM zonas z, usuarios u
WHERE z.nombre = 'Mercado San Pedro' AND u.email = 'operador3@cuscolimpio.local'
LIMIT 1;
