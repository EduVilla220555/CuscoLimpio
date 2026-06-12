-- seed_zonas.sql
-- Zonas representativas del distrito de Cusco y alrededores
INSERT INTO zonas (nombre, descripcion, distrito, calles_recorrer, centro_lat, centro_lng) VALUES
('Centro Histórico', 'Área histórica y turística del Cusco', 'Cusco', 'Plaza de Armas, Calle Loreto, Cuesta de San Blas, Calle Saphi', -13.516667, -71.978333),
('San Blas', 'Barrio artesanal', 'Cusco', 'Carmen Alto, Tandapata, Siete Culebras', -13.518200, -71.977500),
('San Sebastián', 'Zona residencial y comercial', 'San Sebastián', 'Av. De la Cultura, Av. Cusco, Vía Expresa', -13.521500, -71.980000),
('Wanchaq', 'Sector sur-este cercano a la estación', 'Wanchaq', 'Av. El Sol, Av. Micaela Bastidas, Av. Garcilaso', -13.512800, -71.967000),
('Santiago', 'Barrio de Santiago', 'Santiago', 'Antonio Lorena, Huancaro, Av. Grau', -13.528500, -71.970500),
('San Cristóbal', 'Zona elevada con vistas a la ciudad', 'Cusco', 'Resbalosa, Pumacurco, Don Bosco', -13.515000, -71.983000),
('San Jerónimo', 'Zona próxima a la salida', 'San Jerónimo', 'Av. De la Cultura (tramo sur), Cajonahuaylla', -13.548000, -71.945000)
ON DUPLICATE KEY UPDATE 
	descripcion=VALUES(descripcion), 
	distrito=VALUES(distrito), 
	calles_recorrer=VALUES(calles_recorrer), 
	centro_lat=VALUES(centro_lat), 
	centro_lng=VALUES(centro_lng);

 
