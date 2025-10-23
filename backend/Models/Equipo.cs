//backend/Models/Equipo.cs


namespace BackendApi.Models
{
    public class Equipo
    {
        public int Id { get; set; }
        public string CodigoInventario { get; set; } = "";
        public string Nombre { get; set; } = "";
        public string? Marca { get; set; }
        public string? Modelo { get; set; }
        public string? Tipo { get; set; }
        public string? NumeroSerie { get; set; }
        public bool Activo { get; set; } = true;
    }
}
