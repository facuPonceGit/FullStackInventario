-- 01_schema.sql — Creación de base y tablas (MySQL/MariaDB compatibles)
-- Ejecutar con un usuario administrador (root) o con privilegios suficientes

## 3. Scripts de Base de Datos Actualizados

### `backend/db/01_schema.sql` (estructura final corregida)

```sql
-- 01_schema.sql — Creación de base y tablas (MySQL/MariaDB compatibles)
-- Ejecutar con un usuario administrador (root) o con privilegios suficientes

-- 1) Base de datos
CREATE DATABASE IF NOT EXISTS inventario
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE inventario;

-- 2) Catálogos
CREATE TABLE IF NOT EXISTS proveedores (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(120) NOT NULL,
  Telefono VARCHAR(50),
  Email VARCHAR(120)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ubicaciones (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS usuarios_asignados (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(120) NOT NULL,
  Email VARCHAR(120),
  Area VARCHAR(120)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3) Equipos (R1 + R3 + R4)
CREATE TABLE IF NOT EXISTS equipos (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  CodigoInventario VARCHAR(50)  NOT NULL,
  Nombre           VARCHAR(120) NOT NULL,
  Marca            VARCHAR(80),
  Modelo           VARCHAR(80),
  Tipo             VARCHAR(80),
  NumeroSerie      VARCHAR(120),
  ProveedorId      INT NULL,
  FechaAdquisicion DATETIME NULL,
  FechaVencGarantia DATETIME NULL,
  UbicacionId      INT NULL,
  Activo           TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT uq_equipos_codigo UNIQUE (CodigoInventario),
  CONSTRAINT fk_eq_prov FOREIGN KEY (ProveedorId) REFERENCES proveedores(Id),
  CONSTRAINT fk_eq_ubi  FOREIGN KEY (UbicacionId)  REFERENCES ubicaciones(Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4) Periféricos (R1)
CREATE TABLE IF NOT EXISTS perifericos (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  EquipoId INT NOT NULL,
  Tipo     VARCHAR(80) NOT NULL,
  Marca    VARCHAR(80),
  Modelo   VARCHAR(80),
  NumeroSerie VARCHAR(120),
  CONSTRAINT fk_per_eq FOREIGN KEY (EquipoId) REFERENCES equipos(Id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5) Historial de cambios (R2)
CREATE TABLE IF NOT EXISTS historial_cambios (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  EquipoId INT NOT NULL,
  Fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Descripcion TEXT NOT NULL,
  Usuario VARCHAR(120),
  CONSTRAINT fk_hist_eq FOREIGN KEY (EquipoId) REFERENCES equipos(Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6) Asignaciones (R4)
CREATE TABLE IF NOT EXISTS asignaciones (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  EquipoId INT NOT NULL,
  UsuarioId INT NOT NULL,
  FechaDesde DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FechaHasta DATETIME NULL,
  Observacion VARCHAR(250),
  CONSTRAINT fk_asig_eq  FOREIGN KEY (EquipoId) REFERENCES equipos(Id),
  CONSTRAINT fk_asig_usr FOREIGN KEY (UsuarioId) REFERENCES usuarios_asignados(Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7) Índices útiles
CREATE INDEX idx_equipos_ubicacion           ON equipos (UbicacionId);
CREATE INDEX idx_historial_equipo_fecha      ON historial_cambios (EquipoId, Fecha);
CREATE INDEX idx_asignaciones_equipo_vigente ON asignaciones (EquipoId, FechaHasta);

-- 8) Usuario de aplicación (opcional pero recomendado)
CREATE USER IF NOT EXISTS 'inventario_app'@'localhost' IDENTIFIED BY '2194';
GRANT ALL PRIVILEGES ON inventario.* TO 'inventario_app'@'localhost';
FLUSH PRIVILEGES;