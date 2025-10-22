namespace BackendApi.Models
{
    public class Periferico
    {
        public int Id { get; set; }
        public int EquipoId { get; set; }
        public string Tipo { get; set; } = "";
        public string? Marca { get; set; }
        public string? Modelo { get; set; }
        public string? NumeroSerie { get; set; }
    }
}
