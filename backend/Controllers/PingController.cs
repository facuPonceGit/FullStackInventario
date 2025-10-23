// backend/Controllers/PingControllers.cs

using Microsoft.AspNetCore.Mvc;

namespace BackendApi.Controllers;

[ApiController]
[Route("ping")]
public class PingController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { ok = true, ts = DateTime.UtcNow });
}
