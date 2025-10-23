//backend/Dtos/AsignarUsuarioDto.cs

namespace BackendApi.Dtos
{
    public class AsignarUsuarioDto
    {
        public int UsuarioId { get; set; }
        public DateTime? FechaDesde { get; set; } // si null, usamos UtcNow
        public string? Observacion { get; set; }
    }
}
