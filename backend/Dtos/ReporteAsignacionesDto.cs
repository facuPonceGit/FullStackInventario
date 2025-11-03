// backend/Dtos/ReporteAsignacionesDto.cs
namespace BackendApi.Dtos
{
    public class ReporteAsignacionesDto
    {
        public int TotalAsignacionesActivas { get; set; }
        public IEnumerable<AsignacionesPorAreaDto> AsignacionesPorArea { get; set; } = Enumerable.Empty<AsignacionesPorAreaDto>();
        public IEnumerable<UsuarioConMasEquiposDto> TopUsuarios { get; set; } = Enumerable.Empty<UsuarioConMasEquiposDto>();
    }

    public class AsignacionesPorAreaDto
    {
        public string Area { get; set; } = "";
        public int Cantidad { get; set; }
        public decimal Porcentaje { get; set; }
    }

    public class UsuarioConMasEquiposDto
    {
        public string UsuarioNombre { get; set; } = "";
        public string Area { get; set; } = "";
        public int CantidadEquipos { get; set; }
    }
}