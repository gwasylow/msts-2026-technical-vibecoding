using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MSTSTechVibe.Api.Controllers;

[ApiController]
[Route("api/health")]
public sealed class HealthController : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "ok"
        });
    }
}