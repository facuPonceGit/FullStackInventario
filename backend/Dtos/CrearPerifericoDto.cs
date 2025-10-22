namespace BackendApi.Dtos
{
    public class CrearPerifericoDto
    {
        public string Tipo { get; set; } = "";
        public string? Marca { get; set; }
        public string? Modelo { get; set; }
        public string? NumeroSerie { get; set; }
    }
}
