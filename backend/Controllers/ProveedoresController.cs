// backend/Controllers/ProveedoresControllers.cs


using BackendApi.Data;
using BackendApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProveedoresController : ControllerBase
{
    private readonly IDatabaseProvider _db;
    public ProveedoresController(IDatabaseProvider db) => _db = db;

    [HttpGet]
    public Task<IEnumerable<Proveedor>> Get() =>
        _db.QueryAsync<Proveedor>("SELECT * FROM proveedores ORDER BY Nombre");
}
