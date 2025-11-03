// backend/Dtos/ReporteResumenDto.cs
namespace BackendApi.Dtos
{
    public class ReporteResumenDto
    {
        public int TotalEquipos { get; set; }
        public int EquiposActivos { get; set; }
        public int EquiposInactivos { get; set; }
        public int EquiposAsignados { get; set; }
        public int EquiposSinAsignar { get; set; }
        public IEnumerable<EquiposPorTipoDto> DistribucionPorTipo { get; set; } = Enumerable.Empty<EquiposPorTipoDto>();
        public IEnumerable<EquiposPorUbicacionDto> DistribucionPorUbicacion { get; set; } = Enumerable.Empty<EquiposPorUbicacionDto>();
    }

    public class EquiposPorTipoDto
    {
        public string Tipo { get; set; } = "";
        public int Cantidad { get; set; }
        public decimal Porcentaje { get; set; }
    }

    public class EquiposPorUbicacionDto
    {
        public string Ubicacion { get; set; } = "";
        public int Cantidad { get; set; }
        public decimal Porcentaje { get; set; }
    }
}