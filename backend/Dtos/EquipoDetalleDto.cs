using BackendApi.Models;

namespace BackendApi.Dtos
{
    public class EquipoDetalleDto
    {
        public int Id { get; set; }
        public string CodigoInventario { get; set; } = "";
        public string Nombre { get; set; } = "";
        public string? Marca { get; set; }
        public string? Modelo { get; set; }
        public string? Tipo { get; set; }
        public string? NumeroSerie { get; set; }
        public bool Activo { get; set; }
        public DateTime? FechaAdquisicion { get; set; }
        public DateTime? FechaVencGarantia { get; set; }
        public int? ProveedorId { get; set; }
        public string? ProveedorNombre { get; set; }
        public int? UbicacionId { get; set; }
        public string? UbicacionNombre { get; set; }

        public AsignacionVigenteDto? AsignacionActual { get; set; }
        public IEnumerable<Periferico> Perifericos { get; set; } = Enumerable.Empty<Periferico>();
        public IEnumerable<HistorialCambio> Historial { get; set; } = Enumerable.Empty<HistorialCambio>();
    }

    public class AsignacionVigenteDto
    {
        public int UsuarioId { get; set; }
        public string Nombre { get; set; } = "";
        public string? Email { get; set; }
        public DateTime FechaDesde { get; set; }
    }
}
