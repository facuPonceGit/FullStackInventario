namespace BackendApi.Models
{
    public class HistorialCambio
    {
        public int Id { get; set; }
        public int EquipoId { get; set; }
        public DateTime Fecha { get; set; }
        public string Descripcion { get; set; } = "";
        public string? Usuario { get; set; }
    }
}
