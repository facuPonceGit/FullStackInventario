// backend/Controllers/ReportesController.cs
using BackendApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportesController : ControllerBase
{
    private readonly IReportesService _svc;
    public ReportesController(IReportesService svc) => _svc = svc;

    [HttpGet("resumen")]
    public async Task<IActionResult> Resumen() => Ok(await _svc.ObtenerResumenAsync());

    [HttpGet("garantias")]
    public async Task<IActionResult> Garantias() => Ok(await _svc.ObtenerEstadoGarantiasAsync());

    [HttpGet("asignaciones")]
    public async Task<IActionResult> Asignaciones() => Ok(await _svc.ObtenerAsignacionesAsync());

    [HttpGet("excel")]
    public async Task<IActionResult> DescargarExcel()
    {
        var bytes = await _svc.GenerarReporteExcelAsync();
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "reporte_inventario.xlsx");
    }

    [HttpGet("pdf")]
    public async Task<IActionResult> DescargarPdf()
    {
        var bytes = await _svc.GenerarReportePdfAsync();
        return File(bytes, "application/pdf", "reporte_inventario.pdf");
    }
}