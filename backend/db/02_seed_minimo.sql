--  // backend/db/02_seed_minimo.sql
-- 02_seed_minimo.sql — Datos iniciales corregidos
USE inventario;

-- Limpiar datos existentes (opcional)
DELETE FROM asignaciones;
DELETE FROM historial_cambios;
DELETE FROM perifericos;
DELETE FROM equipos;
DELETE FROM usuarios_asignados;
DELETE FROM ubicaciones;
DELETE FROM proveedores;

-- Proveedores
INSERT INTO proveedores (Nombre, Telefono, Email) VALUES
  ('TechSupplier SA', '381-555-1000', 'ventas@techsupplier.com'),
  ('CompuWorld', '381-555-2000', 'contacto@compuworld.com'),
  ('ElectroParts', '381-555-3000', 'info@electroparts.com');

-- Ubicaciones
INSERT INTO ubicaciones (Nombre) VALUES
  ('Casa Central - Piso 2 - Soporte'),
  ('Depósito - Estantería A'),
  ('Sucursal Yerba Buena'),
  ('Oficina Administrativa'),
  ('Sala de Servidores');

-- Usuarios asignados
INSERT INTO usuarios_asignados (Nombre, Email, Area) VALUES
  ('Ana Pérez', 'ana.perez@empresa.com', 'Finanzas'),
  ('Juan Gómez', 'juan.gomez@empresa.com', 'Sistemas'),
  ('Lucía Díaz', 'lucia.diaz@empresa.com', 'Ventas'),
  ('Carlos Ruiz', 'carlos.ruiz@empresa.com', 'Recursos Humanos'),
  ('María Lopez', 'maria.lopez@empresa.com', 'Marketing');

-- Equipos de ejemplo
INSERT INTO equipos (CodigoInventario, Nombre, Marca, Modelo, Tipo, NumeroSerie, ProveedorId, FechaAdquisicion, FechaVencGarantia, UbicacionId, Activo) VALUES
  ('TAG-IT-0001', 'Notebook Lenovo', 'Lenovo', 'T14', 'Notebook', 'SN123', 1, '2025-01-10', '2027-01-10', 1, 1),
  ('TAG-IT-0002', 'Workstation Dell', 'Dell', 'Precision 3560', 'Workstation', 'SN456', 2, '2024-11-15', '2026-11-15', 2, 1),
  ('TAG-IT-0003', 'Monitor Principal', 'Samsung', 'S27A600', 'Monitor', 'SN789', 1, '2024-09-20', '2026-09-20', 3, 1);

-- Periféricos
INSERT INTO perifericos (EquipoId, Tipo, Marca, Modelo, NumeroSerie) VALUES
  (1, 'Monitor', 'Samsung', 'S24', 'MS24-001'),
  (1, 'Teclado', 'Logitech', 'K120', 'TK120-001'),
  (1, 'Mouse', 'Logitech', 'M185', 'TM185-001'),
  (2, 'Monitor', 'Dell', 'P2422H', 'DP2422H-001'),
  (2, 'Docking Station', 'Dell', 'WD19', 'DWD19-001');

-- Historial de cambios
INSERT INTO historial_cambios (EquipoId, Fecha, Descripcion, Usuario) VALUES
  (1, NOW() - INTERVAL 30 DAY, 'Equipo ingresado al sistema', 'admin'),
  (1, NOW() - INTERVAL 15 DAY, 'Actualización de RAM a 16GB', 'tecnico'),
  (1, NOW() - INTERVAL 7 DAY, 'Instalación software corporativo', 'soporte'),
  (2, NOW() - INTERVAL 20 DAY, 'Configuración inicial completada', 'admin'),
  (3, NOW() - INTERVAL 10 DAY, 'Calibración de colores', 'tecnico');

-- Asignaciones
INSERT INTO asignaciones (EquipoId, UsuarioId, FechaDesde, Observacion) VALUES
  (1, 2, NOW() - INTERVAL 25 DAY, 'Asignado para tareas de soporte técnico'),
  (2, 1, NOW() - INTERVAL 18 DAY, 'Para análisis financiero'),
  (3, 3, NOW() - INTERVAL 12 DAY, 'Estación de trabajo ventas');

-- Asignación anterior finalizada
INSERT INTO asignaciones (EquipoId, UsuarioId, FechaDesde, FechaHasta, Observacion) VALUES
  (1, 4, NOW() - INTERVAL 40 DAY, NOW() - INTERVAL 26 DAY, 'Asignación temporal para proyecto RH');