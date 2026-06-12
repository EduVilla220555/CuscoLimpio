-- seed_alertas.sql
-- Alertas de prueba en las rutas de Cusco

INSERT INTO alertas (tipo, descripcion, zona_id, ruta_id, usuario_id, estado)
SELECT 'Acumulación', 'Desmonte de construcción bloqueando la vía', z.id, r.id, u.id, 'abierta'
FROM rutas r
JOIN zonas z ON r.zona_id = z.id
JOIN usuarios u ON u.email = 'operador1@cuscolimpio.local'
WHERE z.nombre = 'Centro Histórico'
LIMIT 1;

INSERT INTO alertas (tipo, descripcion, zona_id, ruta_id, usuario_id, estado)
SELECT 'Camión Averiado', 'Falla mecánica en el compactador', z.id, r.id, u.id, 'resuelta'
FROM rutas r
JOIN zonas z ON r.zona_id = z.id
JOIN usuarios u ON u.email = 'operador2@cuscolimpio.local'
WHERE z.nombre = 'Wanchaq'
LIMIT 1;
