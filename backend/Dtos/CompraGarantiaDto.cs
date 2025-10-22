namespace BackendApi.Dtos
{
    public class CompraGarantiaDto
    {
        public DateTime? Compra { get; set; }      // FechaAdquisicion
        public DateTime? Garantia { get; set; }    // FechaVencGarantia
        public int? ProveedorId { get; set; }      // FK a proveedores nullable
    } 
}
