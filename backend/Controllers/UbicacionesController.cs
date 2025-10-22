using BackendApi.Data;
using BackendApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UbicacionesController : ControllerBase
{
    private readonly IDatabaseProvider _db;
    public UbicacionesController(IDatabaseProvider db) => _db = db;

    [HttpGet]
    public Task<IEnumerable<Ubicacion>> Get() =>
        _db.QueryAsync<Ubicacion>("SELECT * FROM ubicaciones ORDER BY Nombre");
}
