using BackendApi.Data;
using BackendApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuariosAsignadosController : ControllerBase
{
    private readonly IDatabaseProvider _db;
    public UsuariosAsignadosController(IDatabaseProvider db) => _db = db;

    [HttpGet]
    public Task<IEnumerable<UsuarioAsignado>> Get() =>
        _db.QueryAsync<UsuarioAsignado>("SELECT * FROM usuarios_asignados ORDER BY Nombre");
}
