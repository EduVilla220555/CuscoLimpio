-- seed_zonas.sql
-- Zonas representativas del distrito de Cusco
INSERT INTO zonas (nombre, descripcion, distrito, calles_recorrer, centro_lat, centro_lng) VALUES
('Centro Histórico', 'Área histórica y turística de Cusco', 'Cusco', 'Plaza de Armas, Calle Loreto, Calle Saphi, Calle Triunfo', -13.516667, -71.978333),
('San Blas', 'Barrio artesanal de Cusco', 'Cusco', 'Carmen Alto, Tandapata, Siete Culebras, Cuesta de San Blas', -13.518200, -71.977500),
('San Cristóbal', 'Zona elevada y tradicional de Cusco', 'Cusco', 'Resbalosa, Pumacurco, Don Bosco, Cuesta del Almirante', -13.515000, -71.983000),
('Santa Ana', 'Barrio tradicional e histórico de Santa Ana', 'Cusco', 'Cuesta de Santa Ana, Calle Meloc, Calle Abancay, Arco de Santa Ana', -13.518000, -71.989000)
ON DUPLICATE KEY UPDATE 
	descripcion=VALUES(descripcion), 
	distrito=VALUES(distrito), 
	calles_recorrer=VALUES(calles_recorrer), 
	centro_lat=VALUES(centro_lat), 
	centro_lng=VALUES(centro_lng);

 
