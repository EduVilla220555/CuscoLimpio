-- seed_zonas.sql
-- Zonas representativas del distrito de Cusco
INSERT INTO zonas (nombre, descripcion, centro_lat, centro_lng) VALUES
('Centro Histórico', 'Área histórica y turística del Cusco', -13.516667, -71.978333),
('San Blas', 'Barrio artesanal de San Blas', -13.518200, -71.977500),
('San Sebastián', 'Zona residencial y comercial', -13.521500, -71.980000),
('Wanchaq', 'Sector sur-este cercano a la estación', -13.512800, -71.967000),
('Santiago', 'Barrio de Santiago', -13.528500, -71.970500),
('San Cristóbal', 'Zona elevada con vistas a la ciudad', -13.515000, -71.983000),
('San Jerónimo', 'Zona próxima al Estadio Garcilaso', -13.548000, -71.945000)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), descripcion=VALUES(descripcion), centro_lat=VALUES(centro_lat), centro_lng=VALUES(centro_lng);

 
