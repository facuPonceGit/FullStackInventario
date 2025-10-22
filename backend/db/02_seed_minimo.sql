-- 02_seed_minimo.sql — Datos iniciales
USE inventario;

-- Proveedores
INSERT INTO proveedores (Nombre, Telefono, Email) VALUES
  ('TechSupplier SA', '381-555-1000', 'ventas@techsupplier.com'),
  ('CompuWorld',      '381-555-2000', 'contacto@compuworld.com');

-- Ubicaciones
INSERT INTO ubicaciones (Nombre) VALUES
  ('Casa Central - Piso 2 - Soporte'),
  ('Depósito - Estantería A'),
  ('Sucursal Yerba Buena');

-- Usuarios asignados
INSERT INTO usuarios_asignados (Nombre, Email, Area) VALUES
  ('Ana Pérez',  'ana.perez@empresa.com',  'Finanzas'),
  ('Juan Gómez', 'juan.gomez@empresa.com', 'Sistemas'),
  ('Lucía Díaz', 'lucia.diaz@empresa.com', 'Ventas');

-- Equipo de ejemplo
INSERT INTO equipos
  (CodigoInventario,Nombre,Marca,Modelo,Tipo,NumeroSerie,ProveedorId,FechaAdquisicion,FechaVencGarantia,UbicacionId,Activo)
VALUES
  ('TAG-IT-0001','Notebook Lenovo','Lenovo','T14','Notebook','SN123',1,'2025-01-10','2027-01-10',1,1);

-- Periférico del equipo 1
INSERT INTO perifericos (EquipoId,Tipo,Marca,Modelo,NumeroSerie)
VALUES (1,'Monitor','Samsung','S24','MS24-001');

-- Cambio de ejemplo
INSERT INTO historial_cambios (EquipoId,Fecha,Descripcion,Usuario)
VALUES (1, NOW(), 'Actualización de RAM a 16GB','admin');

-- Asignación actual a usuario #2
INSERT INTO asignaciones (EquipoId,UsuarioId,FechaDesde,Observacion)
VALUES (1,2,NOW(),'Asignado para tareas de soporte');
