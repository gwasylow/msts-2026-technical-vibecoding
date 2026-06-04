using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MSTSTechVibe.Api.Contracts.VibeMessages;
using MSTSTechVibe.Application.Features.VibeMessages.Commands.CreateVibeMessage;
using MSTSTechVibe.Application.Features.VibeMessages.Queries.GetVibeMessages;

namespace MSTSTechVibe.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/v1/vibe-messages")]
public sealed class VibeMessagesController : ControllerBase
{
    private readonly IMediator _mediator;

    public VibeMessagesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new GetVibeMessagesQuery(), cancellationToken);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateVibeMessageRequest request, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new CreateVibeMessageCommand(request.Title, request.Description), cancellationToken);
        return Created($"/api/v1/vibe-messages/{response.Id}", response);
    }
}