using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MSTSTechVibe.Api.Configuration;
using MSTSTechVibe.Api.Contracts.Countdown;

namespace MSTSTechVibe.Api.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/v1/countdown")]
public sealed class CountdownController : ControllerBase
{
    private readonly IOptions<CountdownSettings> _countdownOptions;

    public CountdownController(IOptions<CountdownSettings> countdownOptions)
    {
        _countdownOptions = countdownOptions;
    }

    [HttpGet]
    public ActionResult<GetCountdownResponse> Get()
    {
        var settings = _countdownOptions.Value;
        return Ok(new GetCountdownResponse(settings.Headline, settings.DeadlineUtc));
    }
}
