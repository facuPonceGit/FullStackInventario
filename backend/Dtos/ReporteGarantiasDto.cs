// backend/Dtos/ReporteGarantiasDto.cs
namespace BackendApi.Dtos
{
    public class ReporteGarantiasDto
    {
        public int GarantiasVigentes { get; set; }
        public int GarantiasPorVencer { get; set; } // Próximos 30 días
        public int GarantiasVencidas { get; set; }
        public int SinGarantia { get; set; }
        public IEnumerable<GarantiaProximaVencerDto> ProximasAVencer { get; set; } = Enumerable.Empty<GarantiaProximaVencerDto>();
    }

    public class GarantiaProximaVencerDto
    {
        public int EquipoId { get; set; }
        public string CodigoInventario { get; set; } = "";
        public string Nombre { get; set; } = "";
        public DateTime FechaVencimiento { get; set; }
        public int DiasRestantes { get; set; }
    }
}