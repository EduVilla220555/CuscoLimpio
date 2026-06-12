-- seed_residuos.sql
-- Registros de recolección de residuos

INSERT INTO residuos (tipo_id, descripcion, peso, zona_id, usuario_id)
SELECT t.id, 'Recolección ordinaria de restaurantes', 150.50, z.id, u.id
FROM tipos_residuos t, zonas z, usuarios u
WHERE t.nombre = 'Organico' AND z.nombre = 'Centro Histórico' AND u.email = 'operador1@cuscolimpio.local'
LIMIT 1;

INSERT INTO residuos (tipo_id, descripcion, peso, zona_id, usuario_id)
SELECT t.id, 'Cartones y plásticos de zona comercial', 200.00, z.id, u.id
FROM tipos_residuos t, zonas z, usuarios u
WHERE t.nombre = 'Reciclable' AND z.nombre = 'Wanchaq' AND u.email = 'operador2@cuscolimpio.local'
LIMIT 1;

INSERT INTO residuos (tipo_id, descripcion, peso, zona_id, usuario_id)
SELECT t.id, 'Residuos domiciliarios mezclados', 85.20, z.id, u.id
FROM tipos_residuos t, zonas z, usuarios u
WHERE t.nombre = 'No_Reciclable' AND z.nombre = 'San Sebastián' AND u.email = 'operador1@cuscolimpio.local'
LIMIT 1;
