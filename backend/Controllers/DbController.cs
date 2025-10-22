using BackendApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Controllers;

[ApiController]
[Route("db")]
public class DbController : ControllerBase
{
    private readonly DbHealthService _svc;
    public DbController(DbHealthService svc) => _svc = svc;

    [HttpGet("ping")]
    public async Task<IActionResult> Ping() => Ok(await _svc.PingAsync());
}
