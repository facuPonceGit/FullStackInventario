-- 03_correcciones_finales.sql - Correcciones finales de datos y estructura
USE inventario;

-- Asegurar collation consistente
ALTER DATABASE inventario CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE proveedores CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE ubicaciones CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE usuarios_asignados CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE equipos CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE perifericos CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE historial_cambios CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE asignaciones CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Corregir cualquier fecha inválida residual
UPDATE equipos 
SET FechaAdquisicion = NULL 
WHERE FechaAdquisicion = '0000-00-00 00:00:00';

UPDATE equipos 
SET FechaVencGarantia = NULL 
WHERE FechaVencGarantia = '0000-00-00 00:00:00';

UPDATE asignaciones 
SET FechaHasta = NULL 
WHERE FechaHasta = '0000-00-00 00:00:00';

UPDATE historial_cambios 
SET Fecha = NOW() 
WHERE Fecha = '0000-00-00 00:00:00';

-- Verificar que no queden datos problemáticos
SELECT 
    'equipos' as tabla,
    COUNT(*) as problemas
FROM equipos 
WHERE FechaAdquisicion = '0000-00-00 00:00:00' 
   OR FechaVencGarantia = '0000-00-00 00:00:00'
UNION ALL
SELECT 
    'asignaciones' as tabla,
    COUNT(*) as problemas
FROM asignaciones 
WHERE FechaDesde = '0000-00-00 00:00:00'
   OR FechaHasta = '0000-00-00 00:00:00';