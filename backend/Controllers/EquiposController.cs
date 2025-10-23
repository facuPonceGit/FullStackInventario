// backend/Controllers/EquipoControllers.cs


using BackendApi.Dtos;
using BackendApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EquiposController : ControllerBase
{
    private readonly EquipoService _svc;
    public EquiposController(EquipoService svc) => _svc = svc;

    [HttpGet]
    public async Task<IActionResult> Get() => Ok(await _svc.ListarAsync());

    [HttpPost]
    public async Task<IActionResult> Crear([FromBody] CrearEquipoDto dto)
    {
        var id = await _svc.CrearAsync(dto);
        return Created($"/api/equipos/{id}", new { id });
    }

    [HttpPost("{id:int}/perifericos")]
    public async Task<IActionResult> AgregarPeriferico(int id, [FromBody] CrearPerifericoDto dto)
    {
        if (!await _svc.EquipoExisteAsync(id))
            return NotFound(new { message = "El equipo no existe." });

        await _svc.AgregarPerifericoAsync(id, dto);
        return NoContent();
    }

    [HttpGet("{id:int}/perifericos")]
    public async Task<IActionResult> ListarPerifericos(int id)
    {
        if (!await _svc.EquipoExisteAsync(id))
            return NotFound(new { message = "El equipo no existe." });

        return Ok(await _svc.ListarPerifericosAsync(id));
    }

    // R2: alta de cambio
    [HttpPost("{id:int}/historial")]
    public async Task<IActionResult> RegistrarCambio(int id, [FromBody] RegistrarCambioDto dto)
    {
        if (!await _svc.EquipoExisteAsync(id))
            return NotFound(new { message = "El equipo no existe." });

        await _svc.RegistrarCambioAsync(id, dto);
        return NoContent();
    }

    // R2: consulta de historial
    [HttpGet("{id:int}/historial")]
    public async Task<IActionResult> Historial(int id)
    {
        if (!await _svc.EquipoExisteAsync(id))
            return NotFound(new { message = "El equipo no existe." });

        return Ok(await _svc.ObtenerHistorialAsync(id));
    }

    [HttpPut("{id:int}/compra-garantia")]
    public async Task<IActionResult> ActualizarCompraGarantia(int id, [FromBody] CompraGarantiaDto dto)
    {
        if (!await _svc.EquipoExisteAsync(id))
            return NotFound(new { message = "El equipo no existe." });

        var (ok, error) = await _svc.ActualizarCompraYGarantiaAsync(id, dto);
        if (!ok) return BadRequest(new { message = error });
        return NoContent();
    }

    // R4 — Cambiar ubicación (en URL; 0 o ausencia = limpiar)
    [HttpPut("{id:int}/ubicacion/{ubicacionId:int?}")]
    public async Task<IActionResult> CambiarUbicacion(int id, int? ubicacionId)
    {
        if (!await _svc.EquipoExisteAsync(id))
            return NotFound(new { message = "El equipo no existe." });

        var (ok, error) = await _svc.CambiarUbicacionAsync(id, ubicacionId);
        if (!ok) return BadRequest(new { message = error });
        return NoContent();
    }

    // R4 — Asignar usuario
    [HttpPost("{id:int}/asignar")]
    public async Task<IActionResult> AsignarUsuario(int id, [FromBody] AsignarUsuarioDto dto)
    {
        if (!await _svc.EquipoExisteAsync(id))
            return NotFound(new { message = "El equipo no existe." });

        var (ok, error) = await _svc.AsignarUsuarioAsync(id, dto);
        if (!ok) return BadRequest(new { message = error });
        return NoContent();
    }

    // R4 — Asignación vigente
    [HttpGet("{id:int}/asignacion")]
    public async Task<IActionResult> AsignacionActual(int id)
    {
        if (!await _svc.EquipoExisteAsync(id))
            return NotFound(new { message = "El equipo no existe." });

        var asignacion = await _svc.ObtenerAsignacionVigenteAsync(id);
        return Ok(asignacion); // puede ser null
    }

    // R4 — Historial de asignaciones
    [HttpGet("{id:int}/asignaciones")]
    public async Task<IActionResult> Asignaciones(int id)
    {
        if (!await _svc.EquipoExisteAsync(id))
            return NotFound(new { message = "El equipo no existe." });

        return Ok(await _svc.ListarAsignacionesAsync(id));
    }

    [HttpGet("{id:int}/detalle")]
    public async Task<IActionResult> Detalle(int id)
    {
        var detalle = await _svc.ObtenerDetalleAsync(id);
        if (detalle is null) return NotFound(new { message = "El equipo no existe." });
        return Ok(detalle);
    }
}
