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

