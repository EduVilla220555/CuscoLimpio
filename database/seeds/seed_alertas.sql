-- seed_alertas.sql
-- Alertas de prueba en las rutas de Cusco

-- 1. Acumulación Excesiva
INSERT INTO alertas (tipo, descripcion, zona_id, ruta_id, usuario_id, estado)
SELECT 'Acumulación Excesiva', 'Desborde de contenedores por exceso de residuos orgánicos', z.id, r.id, u.id, 'abierta'
FROM rutas r
JOIN zonas z ON r.zona_id = z.id
JOIN usuarios u ON u.email = 'operador1@cuscolimpio.local'
WHERE z.nombre = 'Mercado San Pedro'
LIMIT 1;

-- 2. Incidencia Vehicular
INSERT INTO alertas (tipo, descripcion, zona_id, ruta_id, usuario_id, estado)
SELECT 'Incidencia Vehicular', 'Llanta baja del compactador, esperando soporte técnico', z.id, r.id, u.id, 'abierta'
FROM rutas r
JOIN zonas z ON r.zona_id = z.id
JOIN usuarios u ON u.email = 'operador2@cuscolimpio.local'
WHERE z.nombre = 'Barrio de Lucrepata'
LIMIT 1;

-- 3. Bloqueo de Vía
INSERT INTO alertas (tipo, descripcion, zona_id, ruta_id, usuario_id, estado)
SELECT 'Bloqueo de Vía', 'Tráfico cerrado por procesión/desfile en el centro', z.id, r.id, u.id, 'resuelta'
FROM rutas r
JOIN zonas z ON r.zona_id = z.id
JOIN usuarios u ON u.email = 'operador1@cuscolimpio.local'
WHERE z.nombre = 'Centro Histórico Principal'
LIMIT 1;

-- 4. Incidencia de Seguridad
INSERT INTO alertas (tipo, descripcion, zona_id, ruta_id, usuario_id, estado)
SELECT 'Incidencia de Seguridad', 'Vandalismo en los tachos de basura, falta contenedor', z.id, r.id, u.id, 'abierta'
FROM rutas r
JOIN zonas z ON r.zona_id = z.id
JOIN usuarios u ON u.email = 'operador3@cuscolimpio.local'
WHERE z.nombre = 'Eje Av. El Sol y Qoricancha'
LIMIT 1;

-- 5. Derrame de Peligrosos
INSERT INTO alertas (tipo, descripcion, zona_id, ruta_id, usuario_id, estado)
SELECT 'Derrame de Peligrosos', 'Presencia de residuos hospitalarios mezclados con basura común', z.id, r.id, u.id, 'abierta'
FROM rutas r
JOIN zonas z ON r.zona_id = z.id
JOIN usuarios u ON u.email = 'operador3@cuscolimpio.local'
WHERE z.nombre = 'Mercado San Pedro'
LIMIT 1;

-- 6. Clima Adverso
INSERT INTO alertas (tipo, descripcion, zona_id, ruta_id, usuario_id, estado)
SELECT 'Clima Adverso', 'Lluvia torrencial retrasando el recojo en zonas empinadas', z.id, r.id, u.id, 'resuelta'
FROM rutas r
JOIN zonas z ON r.zona_id = z.id
JOIN usuarios u ON u.email = 'operador2@cuscolimpio.local'
WHERE z.nombre = 'Barrio de San Blas'
LIMIT 1;
