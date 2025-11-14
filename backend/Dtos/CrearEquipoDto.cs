//backend/Dtos/CrearEquipoDto.cs


namespace BackendApi.Dtos
{
    public class CrearEquipoDto
    {
        public string CodigoInventario { get; set; } = "";
        public string Nombre { get; set; } = "";
        public string? Marca { get; set; }
        public string? Modelo { get; set; }
        public string? Tipo { get; set; }
        public string? NumeroSerie { get; set; }
    }
}
