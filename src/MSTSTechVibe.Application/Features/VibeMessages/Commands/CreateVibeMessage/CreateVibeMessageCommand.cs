using MediatR;

namespace MSTSTechVibe.Application.Features.VibeMessages.Commands.CreateVibeMessage;

public sealed record CreateVibeMessageCommand(string Title, string Description) : IRequest<VibeMessageDto>;