namespace BackendApi.Models
{
    public class UsuarioAsignado
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = "";
        public string? Email { get; set; }
        public string? Area { get; set; }
    }
}
