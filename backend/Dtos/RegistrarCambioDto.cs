//backend/Dtos/RegistrarCambioDto.cs


namespace BackendApi.Dtos
{
    public class RegistrarCambioDto
    {
        public string Descripcion { get; set; } = "";
        public string? Usuario { get; set; }
        public DateTime? Fecha { get; set; } // si viene null usamos UtcNow
    }
}
