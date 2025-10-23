// backend/Dtos/AsignacionDto.cs
namespace BackendApi.Dtos
{
    public class AsignacionDto
    {
        public int Id { get; set; }
        public int EquipoId { get; set; }
        public int UsuarioId { get; set; }
        public string UsuarioNombre { get; set; } = "";
        public string? UsuarioEmail { get; set; }
        public DateTime FechaDesde { get; set; }
        public DateTime? FechaHasta { get; set; } // ← Nullable
        public string? Observacion { get; set; }
    }
}