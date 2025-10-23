// backend/Services/EquipoService.cs - VERSIÓN CORREGIDA
using BackendApi.Data;
using BackendApi.Dtos;
using BackendApi.Models;

namespace BackendApi.Services
{
    public class EquipoService
    {
        private readonly IDatabaseProvider _db;
        public EquipoService(IDatabaseProvider db) => _db = db;

        public Task<IEnumerable<Equipo>> ListarAsync() =>
            _db.QueryAsync<Equipo>("SELECT * FROM equipos ORDER BY Id DESC");

        public async Task<int> CrearAsync(CrearEquipoDto dto)
        {
            const string sql = @"
INSERT INTO equipos (CodigoInventario,Nombre,Marca,Modelo,Tipo,NumeroSerie,Activo)
VALUES (@CodigoInventario,@Nombre,@Marca,@Modelo,@Tipo,@NumeroSerie,1);
SELECT LAST_INSERT_ID();";

            long id64 = await _db.QuerySingleOrDefaultAsync<long?>(sql, dto) ?? 0L;
            return (int)id64;
        }

        public Task<int> AgregarPerifericoAsync(int equipoId, CrearPerifericoDto dto) =>
            _db.ExecuteAsync(
                @"INSERT INTO perifericos (EquipoId,Tipo,Marca,Modelo,NumeroSerie)
                  VALUES (@EquipoId,@Tipo,@Marca,@Modelo,@NumeroSerie)",
                new { EquipoId = equipoId, dto.Tipo, dto.Marca, dto.Modelo, dto.NumeroSerie });

        public Task<IEnumerable<Periferico>> ListarPerifericosAsync(int equipoId) =>
            _db.QueryAsync<Periferico>(
                "SELECT * FROM perifericos WHERE EquipoId=@EquipoId ORDER BY Id DESC",
                new { EquipoId = equipoId });

        // ---------------- R2: Historial de cambios ----------------
        public Task<int> RegistrarCambioAsync(int equipoId, RegistrarCambioDto dto)
        {
            var fecha = dto.Fecha ?? DateTime.UtcNow;
            const string sql = @"
                INSERT INTO historial_cambios (EquipoId,Fecha,Descripcion,Usuario)
                VALUES (@EquipoId,@Fecha,@Descripcion,@Usuario)";
            return _db.ExecuteAsync(sql, new
            {
                EquipoId = equipoId,
                Fecha = fecha,
                dto.Descripcion,
                dto.Usuario
            });
        }

        public Task<IEnumerable<HistorialCambio>> ObtenerHistorialAsync(int equipoId) =>
            _db.QueryAsync<HistorialCambio>(
                @"SELECT Id, EquipoId, Fecha, Descripcion, Usuario
                  FROM historial_cambios
                  WHERE EquipoId=@EquipoId
                  ORDER BY Fecha DESC",
                new { EquipoId = equipoId });

        public async Task<(bool ok, string? error)> ActualizarCompraYGarantiaAsync(int id, CompraGarantiaDto dto)
        {
            // 0 ó negativo = "sin proveedor"
            int? prov = (dto.ProveedorId.HasValue && dto.ProveedorId.Value > 0)
                ? dto.ProveedorId
                : null;

            // Si viene proveedor, se valida que exista
            if (prov.HasValue)
            {
                var existe = await _db.QuerySingleOrDefaultAsync<int?>(
                    "SELECT Id FROM proveedores WHERE Id=@Id LIMIT 1", new { Id = prov.Value });
                if (existe is null)
                    return (false, "ProveedorId inválido (no existe en proveedores)");
            }

            await _db.ExecuteAsync(
                @"UPDATE equipos
             SET FechaAdquisicion=@Compra,
                 FechaVencGarantia=@Garantia,
                 ProveedorId=@ProveedorId
           WHERE Id=@Id",
                new { Id = id, Compra = dto.Compra, Garantia = dto.Garantia, ProveedorId = prov });

            return (true, null);
        }

        // R4 — Cambiar ubicación (0 o null => limpiar)
        public async Task<(bool ok, string? error)> CambiarUbicacionAsync(int id, int? ubicacionId)
        {
            int? ubi = (ubicacionId.HasValue && ubicacionId.Value > 0) ? ubicacionId : null;

            if (ubi.HasValue)
            {
                var existe = await _db.QuerySingleOrDefaultAsync<int?>(
                    "SELECT Id FROM ubicaciones WHERE Id=@Id LIMIT 1", new { Id = ubi.Value });
                if (existe is null) return (false, "UbicacionId inválido (no existe)");
            }

            await _db.ExecuteAsync("UPDATE equipos SET UbicacionId=@Ubi WHERE Id=@Id",
                new { Ubi = ubi, Id = id });

            return (true, null);
        }

        // R4 — Asignar usuario (cierra vigente y abre nueva asignación)
        public async Task<(bool ok, string? error)> AsignarUsuarioAsync(int equipoId, AsignarUsuarioDto dto)
        {
            // validar usuario
            var usr = await _db.QuerySingleOrDefaultAsync<int?>(
                "SELECT Id FROM usuarios_asignados WHERE Id=@Id LIMIT 1", new { Id = dto.UsuarioId });
            if (usr is null) return (false, "UsuarioId inválido (no existe)");

            var fecha = dto.FechaDesde ?? DateTime.UtcNow;

            await _db.ExecuteAsync(@"
        UPDATE asignaciones
           SET FechaHasta = @Fecha
         WHERE EquipoId=@EquipoId AND FechaHasta IS NULL;

        INSERT INTO asignaciones (EquipoId,UsuarioId,FechaDesde,Observacion)
        VALUES (@EquipoId,@UsuarioId,@Fecha,@Obs);
    ", new
            {
                EquipoId = equipoId,
                UsuarioId = dto.UsuarioId,
                Fecha = fecha,
                Obs = dto.Observacion
            });

            return (true, null);
        }

        // R4 — Ver asignación vigente
        public async Task<AsignacionVigenteDto?> ObtenerAsignacionVigenteAsync(int equipoId)
        {
            return await _db.QuerySingleOrDefaultAsync<AsignacionVigenteDto>(
                @"SELECT a.UsuarioId, u.Nombre, u.Email, a.FechaDesde
          FROM asignaciones a
          JOIN usuarios_asignados u ON u.Id = a.UsuarioId
         WHERE a.EquipoId=@EquipoId AND a.FechaHasta IS NULL
         LIMIT 1",
                new { EquipoId = equipoId });
        }

        // R4 — Ver historial de asignaciones
        public async Task<IEnumerable<AsignacionDto>> ListarAsignacionesAsync(int equipoId)
        {
            return await _db.QueryAsync<AsignacionDto>(
                @"SELECT a.Id, a.EquipoId, a.UsuarioId, u.Nombre as UsuarioNombre, u.Email as UsuarioEmail,
                 a.FechaDesde, a.FechaHasta, a.Observacion
          FROM asignaciones a
          JOIN usuarios_asignados u ON u.Id = a.UsuarioId
         WHERE a.EquipoId=@EquipoId
         ORDER BY a.FechaDesde DESC",
                new { EquipoId = equipoId });
        }

        public async Task<bool> EquipoExisteAsync(int id)
        {
            var existe = await _db.QuerySingleOrDefaultAsync<int?>(
                "SELECT 1 FROM equipos WHERE Id=@Id LIMIT 1", new { Id = id });
            return existe.HasValue;
        }

        public async Task<EquipoDetalleDto?> ObtenerDetalleAsync(int id)
        {
            //  PROBLEMA CRÍTICO: El dynamic no está mapeando correctamente
            // Usemos un tipo específico en lugar de dynamic
            var cab = await _db.QuerySingleOrDefaultAsync<EquipoCabeceraDto>(@"
        SELECT e.Id, e.CodigoInventario, e.Nombre, e.Marca, e.Modelo, e.Tipo, e.NumeroSerie,
               e.Activo, e.FechaAdquisicion, e.FechaVencGarantia, e.ProveedorId, e.UbicacionId,
               p.Nombre AS ProveedorNombre, u.Nombre AS UbicacionNombre
          FROM equipos e
          LEFT JOIN proveedores p ON p.Id = e.ProveedorId
          LEFT JOIN ubicaciones u ON u.Id = e.UbicacionId
         WHERE e.Id=@Id", new { Id = id });

            if (cab == null) return null;

            var peris = await _db.QueryAsync<Periferico>(
                "SELECT * FROM perifericos WHERE EquipoId=@Id ORDER BY Id DESC", new { Id = id });

            var hist = await _db.QueryAsync<HistorialCambio>(@"
        SELECT Id, EquipoId, Fecha, Descripcion, Usuario
          FROM historial_cambios
         WHERE EquipoId=@Id
         ORDER BY Fecha DESC", new { Id = id });

            var asig = await _db.QuerySingleOrDefaultAsync<AsignacionVigenteDto>(@"
        SELECT a.UsuarioId, u.Nombre, u.Email, a.FechaDesde
          FROM asignaciones a
          JOIN usuarios_asignados u ON u.Id = a.UsuarioId
         WHERE a.EquipoId=@Id AND a.FechaHasta IS NULL
         LIMIT 1", new { Id = id });

            return new EquipoDetalleDto
            {
                Id = cab.Id,
                CodigoInventario = cab.CodigoInventario,
                Nombre = cab.Nombre,
                Marca = cab.Marca,
                Modelo = cab.Modelo,
                Tipo = cab.Tipo,
                NumeroSerie = cab.NumeroSerie,
                Activo = cab.Activo,
                FechaAdquisicion = cab.FechaAdquisicion,
                FechaVencGarantia = cab.FechaVencGarantia,
                ProveedorId = cab.ProveedorId,
                ProveedorNombre = cab.ProveedorNombre,
                UbicacionId = cab.UbicacionId,
                UbicacionNombre = cab.UbicacionNombre,
                AsignacionActual = asig,
                Perifericos = peris,
                Historial = hist
            };
        }
    }

    //  AGREGAR ESTA CLASE para reemplazar el dynamic
    public class EquipoCabeceraDto
    {
        public int Id { get; set; }
        public string CodigoInventario { get; set; } = "";
        public string Nombre { get; set; } = "";
        public string? Marca { get; set; }
        public string? Modelo { get; set; }
        public string? Tipo { get; set; }
        public string? NumeroSerie { get; set; }
        public bool Activo { get; set; }
        public DateTime? FechaAdquisicion { get; set; }  // ← Nullable
        public DateTime? FechaVencGarantia { get; set; } // ← Nullable
        public int? ProveedorId { get; set; }
        public string? ProveedorNombre { get; set; }
        public int? UbicacionId { get; set; }
        public string? UbicacionNombre { get; set; }
    }
}